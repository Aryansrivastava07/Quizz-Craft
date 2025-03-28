const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticateUser = async(req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!accessToken) return res.redirect("/login");
        const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decode._id);
        if (!user) return res.redirect("/login");
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error?.message || "Verification unsuccessful" });
    }
}

exports.authenticateUser = authenticateUser;
