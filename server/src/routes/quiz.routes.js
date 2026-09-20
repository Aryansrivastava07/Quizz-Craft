import { Router } from "express";
import { quizCreation, getQuiz,updateQuiz, deleteQuiz,getAllQuizById} from "../controllers/quizCreation.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import  {authenticateUser}  from "../middlewares/authenticator.middleware.js";
const router = Router();

router.route('/quizCreation').post(authenticateUser,upload.array('files', 10) ,quizCreation);
router.route('/getQuiz').get(authenticateUser,getQuiz);
router.route('/updateQuiz').post(authenticateUser,updateQuiz);
router.route('/deleteQuiz/:id').delete(authenticateUser, deleteQuiz);
router.route('/getAllQuizById').get(authenticateUser,getAllQuizById);

export default router;
