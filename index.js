const express = require('express');
const cors = require('cors');

const { ObjectId } = require('mongodb');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

//----Middleware---
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@assignment-12.sva2y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {

        await client.connect();
        const toolsCollection = client.db("shafin-car").collection("tools");

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




    } finally { }

}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('sss car site')
})

app.listen(port, () => {
    console.log('running port', port)
})





