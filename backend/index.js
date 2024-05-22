const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors())

app.listen(8080, () => {
    console.log('listening on port 8080')
})

app.get('/', (req, res) => {
    res.send('server is alive!')
})