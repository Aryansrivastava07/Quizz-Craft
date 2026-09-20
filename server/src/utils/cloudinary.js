import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

// Configure Cloudinary
const configureCloudinary = () => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
};

const uploadOnCludinary = async (filePath)=>{
    try {
        if(!filePath){
            console.log("NO FILE PATH PRESENT");
            return null;
        }
        configureCloudinary();
        const uploadResponse = await cloudinary.uploader.upload(filePath,{
            resource_type : "auto"
        })
        // console.log("SUCESSFUL FILE UPLOAD ON CLODINARY:",uploadResponse.url);
        fs.unlinkSync(filePath);
        return uploadResponse;
    } catch (error) {
        fs.unlinkSync(filePath);
        console.log(error);
        return null;
    }
}

// Upload from buffer (for memory storage)
const uploadBufferToCloudinary = async (buffer, options = {}) => {
    try {
        if (!buffer) {
            console.log("NO BUFFER PRESENT");
            return null;
        }
        configureCloudinary();
        
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "quizcraft/avatars",
                    transformation: [
                        { width: 300, height: 300, crop: "fill", gravity: "face" },
                        { quality: "auto:good" }
                    ],
                    ...options
                },
                (error, result) => {
                    if (error) {
                        console.log("Cloudinary upload error:", error);
                        reject(error);
                    } else {
                        console.log("SUCCESSFUL BUFFER UPLOAD TO CLOUDINARY:", result.url);
                        resolve(result);
                    }
                }
            ).end(buffer);
        });
    } catch (error) {
        console.log("Buffer upload error:", error);
        return null;
    }
};

export {uploadOnCludinary, uploadBufferToCloudinary} ;