import { Router } from "express";
import { 
    getQuizForAttempt,
    submitAttempt,
    getLeaderboard,
    getAttemptHistory,
    reviewAttempt
 } from "../controllers/attempt.controllers.js";
import  {authenticateUser}  from "../middlewares/authenticator.middleware.js";
const router = Router();

router.use(authenticateUser);

router.route('/start/:quizId').get(getQuizForAttempt);
router.route('/submit/:quizId').post(submitAttempt);
router.route('/leaderboard/:quizId').get(getLeaderboard);
router.route('/history').get(getAttemptHistory);
router.route('/review/:attemptId').get(reviewAttempt);


export default router;