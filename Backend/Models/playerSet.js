import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    dbUser: {type:String, required:true},
    dbScores: [{ 
        quizType:{type:String, required:true},
        score: { type: Number, required: true },
        date: { type: Date, default: Date.now }
    }],
    dbTotalScores: { type: Number, default: 0 }
})

const Player = mongoose.model('PlayerSet', playerSchema);

export {Player}