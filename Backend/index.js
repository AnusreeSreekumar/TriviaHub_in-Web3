import express, { json } from "express";

const app = express();

app.use(json())

const port = 4000;

app.listen(port, () => {
    console.log(`Server connected to port ${port}`)
})