import { Router } from "express";
import {
    userRegister,
    userRequestVerificationMail,
    userVerification,
    sendOtp,
    userLogin,
    userLogout,
    userRefreshToken,
    getUser,
    updateProfile,
    updateAvatar,
    getAvatar,
    changePassword
} from "../controllers/user.controllers.js";
import  {authenticateUser}  from "../middlewares/authenticator.middleware.js";
import { avatarUpload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route('/register').post(userRegister);
router.route('/userRequestVerificationMail/:id').get(userRequestVerificationMail);
router.route('/userVerification/:id').post(userVerification);
router.route('/send-otp').post(sendOtp);
router.route('/login').post(userLogin);
router.route('/logout/:id').post(userLogout);
router.route('/refreshToken').post(userRefreshToken);
router.route('/user').get(authenticateUser,getUser);
router.route('/updateProfile').post(authenticateUser, updateProfile);
router.route('/updateAvatar').post(authenticateUser, avatarUpload.single('avatar'), updateAvatar);
router.route('/getAvatar').get(authenticateUser, getAvatar);
router.route('/changePassword').post(authenticateUser, changePassword);


export default router;