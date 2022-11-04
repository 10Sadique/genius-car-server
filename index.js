const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
        const serviceCollection = client.db('geniusCar').collection('services');
        const orderCollection = client.db('geniusCar').collection('orders');

        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h',
            });

            res.send({ token });
        });

        // Services Api
        // GET all services at '/services' path
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();

            res.send(services);
        });

        // GET one service at '/services/:id' path
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);

            res.send(service);
        });

        // Orders Api
        app.get('/orders', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email,
                };
            }

            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();

            res.send(orders);
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;

            const result = await orderCollection.insertOne(order);

            res.send(result);
        });

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) };

            const updateDoc = {
                $set: {
                    status: status,
                },
            };

            const result = await orderCollection.updateOne(query, updateDoc);
            res.send(result);
        });

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);

            res.send(result);
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
