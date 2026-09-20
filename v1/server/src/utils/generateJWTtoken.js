
import { ApiError } from "./ApiError.js";
import  User  from "../models/user.model.js";

const getAccessToken = async(user) =>{
    try {
        
        const accessToken = user.generateAcessToken();
        if(!accessToken) throw new ApiError(500,"Access Generation Failed");
        return accessToken;
    } catch (error) {
        throw new ApiError(500,error?.message || "something went wrong during token generation");
    }
}

const getRefreshToken = async(user) =>{
    try {
        
        const refreshToken = user.generateRefreshToken();
        if(!refreshToken) throw new ApiError(500,"Refresh Generation Failed");
        await User.findByIdAndUpdate(user._id,{refreshToken});
        return refreshToken;
    } catch (error) {
        throw new ApiError(500,error?.message || "something went wrong during token generation");
    }
}

export {getAccessToken,getRefreshToken};
