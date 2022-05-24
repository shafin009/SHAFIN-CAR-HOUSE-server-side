const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const app = express();
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const port = process.env.PORT || 5000;

//----Middleware---
app.use(cors());
app.use(express.json());


var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@assignment-12-shard-00-00.sva2y.mongodb.net:27017,assignment-12-shard-00-01.sva2y.mongodb.net:27017,assignment-12-shard-00-02.sva2y.mongodb.net:27017/?ssl=true&replicaSet=atlas-65b2xi-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri);


async function run() {

    try {

        await client.connect();
        const toolsCollection = client.db("shafin-car").collection("tools");
        const reviewsCollection = client.db("shafin-car").collection("review");
        const userCollection = client.db("shafin-car").collection("users");
        const orderCollection = client.db("shafin-car").collection("order");


        app.get("/tools", async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        });

        app.get("/tools/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tools = await toolsCollection.findOne(query);
            res.send(tools);

        });

        app.put("/user/:email", async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);


        })

        app.post("/order", async (req, res) => {
            const newItems = req.body;
            const result = await orderCollection.insertOne(newItems);
            res.send(result);
        });

        app.get("/order/:id", async (req, res) => {
            const id = req.params.id;
            const query = { pid:id };
            console.log(query);

            const tools = await orderCollection.findOne(query);
            res.send(tools);

        });

        app.get("/review", async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);


        });

        app.post("/review", async (req, res) => {
            const newReview = req.body;
            const result = await reviewsCollection.insertOne(newReview);
            res.send(result);
        });





    } finally { }

}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('sss car site')
})

app.listen(port, () => {
    console.log('running port', port)
})





