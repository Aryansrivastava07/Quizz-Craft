const express = require('express');    //importing express
const mongoose = require('mongoose');   //importing mongoose
const run = require('./gemini');   //importing gemini.js
const router = express.Router();    //creating router
const { v4: uuidv4 } = require('uuid');  //importing uuid
const url = require('url');   //importing url
const multer = require('multer');   //importing multer
const Quiz = require('../models/questions.model');  //importing the model
const Result = require('../models/results.model');  //importing the model
let answer = [];   //array to store score
const quizData = require('../developmentAsset/quiz');   //importing quiz.js
//////////////////////////////////////////////// Home Route /////////////////////////////////////////////////

router.get('/', (req, res) => {
    res.render('index');
});

//////////////////////////////////////////////// Get Route to Create quiz from Pdf /////////////////////////////////////////////////

router.get('/pdfToQuiz', (req, res) => {
    res.render('pdfToQuiz');
});

//////////////////////////////////////////////// Get Route to Create quiz from Prompt /////////////////////////////////////////////////

router.get('/promptToQuiz', (req, res) => {
    res.render('promptToQuiz');
});

//////////////////////////////////////////////// Get Route to Quiz Home Page after creation of Quiz /////////////////////////////////////////////////

router.get('/quizHome', (req, res) => {
    res.render('quiz_home', { id: req.query.id });
});

//////////////////////////////////////////////// Get Route to Quiz Platform /////////////////////////////////////////////////
router.get('/quiz', async (req, res) => {
    if(req.query.no>0&&req.query.no<11){
        const quiz = await Quiz.findOne({ quizId: req.query.id });
        if (!quiz) {
            res.render('quiz_platform', {quiz: quizData});
        }
        else {
        const ques = quiz.questions[req.query.no - 1];
        res.render('quiz_platform',
            {
                quiz: quiz,
                title: quiz.title,
                question: quiz.questions,
                options: ques.options,
                no: parseFloat(req.query.no),
                id: req.query.id,
                answer: answer,
            }
        );
    }
    }else{
        res.json({message:"Invalid question number"});
    }
});

//////////////////////////////////////////////// Get Route to Score /////////////////////////////////////////////////
router.get('/score', async (req, res) => { 
    try {
        const result = await Result.findOne({ resultID: req.query.r });
        if (!result) {
            console.error('Result not found');
            return res.status(404).send('Result not found');
        }

        const score = result.score;
        const results = await Result.find({ quizId: req.query.id });
        results.sort((a, b) => b.score - a.score);
        const leaderboard = results.slice(0, 10);
        // console.log('Leaderboard:', leaderboard);
        res.render('result', { score: score, leaderboard: leaderboard, id: req.query.id, r: req.query.r });
    } catch (err) {
        console.error('Error fetching score:', err);
        res.status(500).send('Internal Server Error');
    }
});

//////////////////////////////////////////////// Get Route to Review Your Answer /////////////////////////////////////////////////

router.get('/review', async (req, res) => {
    const result = await Result.findOne({ resultID: req.query.r });
    const quiz = await Quiz.findOne({ quizId: req.query.id }); 
    const answers = quiz.answers;
    const explanations = quiz.explanations;
    const userAnswers = result.answer;
    res.render('review', {questions: quiz.questions, answers: answers,userAnswers:userAnswers,explanations:explanations });
});
//////////////////////////////////////////////// Post Route to create Quiz form Pdf/////////////////////////////////////////////////
router.post('/createQuiz', async (req, res) => {
    const content = req.body.quizContent;
    const difficulty = req.body.difficulty;
    const promptType = req.body.promptType;
    const quiz = await run(content, difficulty,promptType);
    const quizId = uuidv4();
    quiz.quizId = quizId;
    const newQuiz = new Quiz(quiz);
    try {
        await newQuiz.save();
        res.redirect(url.format({
            pathname: "/quizHome",
            query: {
                "id": quizId,
            }
        })
        );
    } catch (err) {
        console.log(err);
    }
}
);


//////////////////////////////////////////////// Post Route to Answer And Submit quiz /////////////////////////////////////////////////
router.post('/ques', async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ quizId: req.query.id });
        if (!quiz) {
            console.error('Quiz not found');
            return res.status(404).send('Quiz not found');
        }

        let score = 0;
        const userAnswer = req.body.arrayData;
        const answers = quiz.answers;
        answers.forEach((ans, index) => {
            if (ans == userAnswer[index]) {
                score++;
            }
        });

        const resultId = uuidv4();
        const name = req.body.name;
        const result = new Result({
            quizId: req.query.id,
            resultID: resultId,
            name: req.body.name,
            score: score,
            answer: userAnswer
        });

        try {
            const response = await result.save();
            res.json({ resultId: resultId });
        } catch (err) {
            console.error('Error saving result:', err);
            return res.status(500).send('Internal Server Error');
        }
    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).send('Internal Server Error');
    }
});


//////////////////////////////////////////////// Post Route to Join quiz /////////////////////////////////////////////////

router.post('/joinQuiz',async(req,res)=>{
    const quizId = req.body.quizId;
    answer = [4,4,4,4,4,4,4,4,4,4];
    res.redirect(url.format({
        pathname: "/quiz",
        query: {
            "id": quizId,
            "no": 1,
        }
    })
    );
});



///////////////////////////////////////////////// PDF to text /////////////////////////////////////////////////
// const upload = multer({ dest: './uploads/' });
// router.get('/convert', (req, res) => {
//     res.render('newopai');
// });
// const convertToText = require('./convertapi');
// router.post('/convert', upload.single('file'),(req, res) => {
//     if (!req.files || !req.files.file) {
//         return res.status(400).send('No file uploaded');
//     }
//     const file = req.files.file;
//     const fileName = file.name;
//     console.log(file);
//     console.log(fileName);
//     res.send('File Uploaded');
// });


module.exports = router;    //exporting router

