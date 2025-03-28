const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const {authenticateUser} = require('../middlewares/authentication.middleware');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/register',(req,res)=>{
    res.render('register');
})
router.get('/login',(req,res)=>{
    res.render('login');
})

router.post('/register', async (req, res) => {
    const { email,username, password , fullName, phoneNumber } = req.body;

    if (!email || !password || !fullName || !phoneNumber) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    const existedUser = await User.find({$or:[{username},{email}]});

    if(existedUser.length != 0) throw new ApiError(400,"User Already Exist with same username");
    
    const user = await User.create({ email, username, password, fullName, phoneNumber });
    if (!user) {
        return res.status(400).json({ message: 'User already exists' });
    }

    res.status(201).json({ message: 'User registered successfully' }).redirect('/login');
})

router.post('/login', async (req, res) => {
    const {identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        res.status(400).json({message:"Invalid Credentials"});
    }
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();

    if(!accessToken || !refreshToken){
        res.status(400).json({message:"Token generation failed"});
    }
    const option = {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: true,
    }
    
    res.status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json({accessToken,refreshToken});
});

router.post('/logout', authenticateUser, async (req, res) => {
    const user = req.user;
    await User.findByIdAndUpdate(user._id, { $set: { refreshToken: "" } }, { new: true });
    res.status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json({message: "User logged Out"});
});

module.exports = router;