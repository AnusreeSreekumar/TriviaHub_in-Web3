import { Router } from "express";
import { Player } from "../Models/playerSet.js";
import mongoose from "mongoose";

const playerroute = Router();
mongoose.connect('mongodb://localhost:27017/TriviaHub_W3')

playerroute.get('/fetchUser/:user', async (req, res) => {
    try {
        const fetchKey = req.params.user;
        console.log(fetchKey);
        
        const existingUser = await Player.findOne({ dbUser: fetchKey });
        if (existingUser) {
            res.status(200).json({existingUser})
        }
    } catch (error) {
        console.log('Error while fetching User: ', error);
    }
})

export default playerroute;