import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
    userId :{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    answers:{type: [Number], required: true},
    timeTaken:{type: Number, required: true},
    timeSpent: { type: [Number], default: [] }, // Array of time spent per question
},
{
    timestamps: true
})

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt;