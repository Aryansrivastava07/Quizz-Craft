import multer from "multer";
import path from "path";
import fs from "fs";

// Storage configuration for general file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "./public/temp";
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Memory storage for avatar uploads (to be processed by Cloudinary)
const memoryStorage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    // Allow images, PDFs, videos, and text files
    const allowedTypes = [
        'image/',           // All image types
        'application/pdf',  // PDF files
        'video/',          // All video types
        'text/',           // Text files
        'application/msword',                    // .doc files
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx files
        'application/vnd.ms-powerpoint',         // .ppt files
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx files
    ];
    
    const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type) || file.mimetype === type);
    
    if (isAllowed) {
        cb(null, true);
    } else {
        cb(new Error('File type not supported! Please upload images, PDFs, videos, or text files.'), false);
    }
};

// Avatar-specific file filter (images only)
const avatarFileFilter = (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed for avatars!'), false);
    }
};

// Create multer upload middleware for local storage (general files)
export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for videos and large files
    }
});

// Avatar upload middleware using memory storage (for Cloudinary direct upload)
export const avatarUpload = multer({
    storage: memoryStorage,
    fileFilter: avatarFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for avatars
    }
});

export default upload;