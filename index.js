const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// port
const port = process.env.PORT || 5000;

// Init Server
app.get('/', (req, res) => {
    res.send({
        message: 'This is genius car server.',
    });
});

// Listen
app.listen(port, () => {
    console.log('Listening to port: ', port);
});
