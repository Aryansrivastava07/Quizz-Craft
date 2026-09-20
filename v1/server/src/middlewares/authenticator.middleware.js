import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


export const authenticateUser = async(req,res,next) =>{
    try {
        const accessToken = req.header("Authorization")?.replace("Bearer ","");
        if(!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
                statusCode: 401
            });
        }
        
        const decode = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decode._id).select("-password -refreshToken");
        
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token",
                statusCode: 401
            });
        }
        
        if(!user.verified) {
            return res.status(401).json({
                success: false,
                message: "User not verified",
                statusCode: 401
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.log("Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: error?.message || "Authentication failed",
            statusCode: 401
        });
    }
}