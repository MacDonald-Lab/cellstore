import express from 'express';

const app = express();
const port = 5001

app.all('/', (req, res) => {
    console.log('Request received')
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})