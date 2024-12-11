const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quizId:{
        type:String,
        required:true
    }, 
    title:{
        type:String,
        required:true
    },
    questions:[
        {
            question:{
                type:String,
                required:true
            },
            options:{
                type:Array,
                required:true
            },
        }
    ],
    answers:{
        type:Array,
        required:true
    },
    explanations:{
        type:Array,
        required:true
    }
});

const Quiz = new mongoose.model("Quiz", quizSchema);

module.exports = Quiz;