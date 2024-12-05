const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vyhfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const movieCollectionDB = client.db("movieDB").collection("movie");

        //Read data / send all data to the localhost (API) from DB
        app.get('/movies', async (req, res) => {
            const cursor = movieCollectionDB.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // create 
        app.post('/movies', async (req, res) => {
            const newMovies = req.body;
            console.log(newMovies);
            const result = await movieCollectionDB.insertOne(newMovies);
            res.send(result);
        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send(`Movie server is running`);
})
app.listen(port, () => {
    console.log(`Movie server is running on port ${port}`);
})