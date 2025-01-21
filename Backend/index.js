import express, {json} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import playerroute from './Routes/playerroute.js'

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(json());
app.use('/', playerroute)

const port = 5000;

app.listen(port, () => {
    console.log(`Server is listening to ${port}`);
})