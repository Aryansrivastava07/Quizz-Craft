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
    const { email, password , fullName, phoneNumber,cpassword } = req.body;
    
    
    if (!email || !password || !fullName || !phoneNumber || !cpassword) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    if(password != cpassword) res.status(400).json({message:"Password and Confirm Password does not match"});
    const existedUser = await User.find({email});

    if(existedUser.length != 0) res.status(400).json({message:"Email Is Already Registered"});
    
    const user = await User.create({ email, password, fullName, phoneNumber });
    if (!user) {
        return res.status(400).json({ message: 'Acoount Creation failed' });
    }
    // console.log(user);
    res.redirect('/login');
})

router.post('/login', async (req, res) => {
    const {email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    const user = await User.findOne({ email });
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
    
    res.cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .redirect('/');
});

router.post('/refreshToken', async (req, res) => {
    const { refreshToken } = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({ message: 'Invalid Request' });
    }
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!user) {
        return res.status(400).json({ message: 'Invalid Request' });
    }
    const existedUser = await User.findById(user._id);
    if (!existedUser) {
        return res.status(400).json({ message: 'Invalid Request' });
    }
    if (existedUser.refreshToken !== refreshToken) {
        return res.status(400).json({ message: 'Invalid Request' });
    }
    const accessToken = existedUser.generateAcessToken();
    if (!accessToken) {
        return res.status(400).json({ message: 'Invalid Request' });
    }
    res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: true,
    });
    res.status(200).json({ message: "Token Refreshed" });
})

router.post('/logout', authenticateUser, async (req, res) => {
    const user = req.user;
    await User.findByIdAndUpdate(user._id, { $set: { refreshToken: "" } }, { new: true });
    res.status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json({message: "User logged Out"});
});

router.get('/checkLogin', authenticateUser, async (req, res) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return res.status(200).json({ message: "User is not logged in" });
    const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decode._id);
    if (!user) return res.status(200).json({ message: "User is not logged in" });
    res.status(200).json({ message: "User is logged in" });
});

module.exports = router;