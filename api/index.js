import dotenv from 'dotenv';
dotenv.config()

import express from 'express';

const app = express();
const port = process.env.BACKEND_PORT

app.all('/', (req, res) => {
    console.log('Request received')
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})