const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000



// *************middleware************************
app.use(cors());
app.use(express.json())




// *********************mongodb is here************************

const uri = `mongodb+srv://${process.env.GREEN_HUB_USER}:${process.env.GREEN_HUB_PASS}@cluster0.ngwkmsl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// **************curd operation start from here***********************

app.get('/', (req, res) => {
  res.send('Hello World! this is from green hub')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
