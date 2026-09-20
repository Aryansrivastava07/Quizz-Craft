import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [{
        question: { type: String, required: true },
        options: { type: Array, required: true },
        answer: { type: Number, required: true },
        explanation: { type: String, required: true }
    }],
    type: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    }
},
{
    timestamps: true
})

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;