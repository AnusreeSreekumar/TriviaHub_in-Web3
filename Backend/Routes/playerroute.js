import { Router } from "express";
import { Player } from "../Models/playerSet.js";
import mongoose from "mongoose";

const playerroute = Router();
mongoose.connect('mongodb://localhost:27017/TriviaHub_W3')

playerroute.get('/fetchUser', async (req, res) => {
    try {

        const existingUsers = await Player.find();
        if (existingUsers.length > 0) {
            res.status(200).json({existingUsers})
        }
        else{
            res.status(404).json({ message: 'No users found' });
        }
    } catch (error) {
        console.log('Error while fetching User: ', error);
    }
})

playerroute.get('/fetchUser/:user', async (req, res) => {
    try {

        const fetchKey = req.params.user;
        const existingUser = await Player.findOne({dbUser : fetchKey});
        if (existingUser) {
            res.status(200).json({existingUser})
        }
        else{
            res.status(404).json({ message: 'No user found' });
        }
    } catch (error) {
        console.log('Error while fetching User: ', error);
    }
})

export default playerroute;