const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// port
const port = process.env.PORT || 5000;

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.onfc57d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

// CRUD Operations
async function run() {
    try {
        const servicesCollection = client
            .db('geniusCar')
            .collection('services');

        // GET all services at '/services' path
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();

            res.send(services);
        });

        // GET one service at '/services/:id' path
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);

            res.send(service);
        });
    } finally {
    }
}

run().catch((err) => console.error(err));

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
