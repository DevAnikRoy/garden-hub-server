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

        // main cluster
        const db = client.db('greenhubproject');
        console.log(client)
        const usersCollection = db.collection('gardeners')
        
        // tips collection
        const tipsCollection = db.collection('trendingTips')
        
        
        app.get('/gardeners', async (req, res) => {
            // console.log('is this showing', req.body)
            const gardeners = await usersCollection.find({status:"active"}).toArray()
            res.json({data:gardeners, item:gardeners.length})
        })
        app.get('/explore-gardeners', async (req, res) => {
            // console.log('is this showing', req.body)
            const gardeners = await usersCollection.find({}).toArray()
            res.json({data:gardeners, item:gardeners.length})
        })
        
        app.get('/gardeners/tips', async (req, res) => {
            const tips = await tipsCollection.find().toArray()
            res.json(tips)
        })
        
        // post method
        app.post('/addtip',async(req,res) =>{
            try{
                const addtips = await req.body
                await tipsCollection.insertOne(addtips)
            res.send('data is saved')
            }
            catch{
                res.send('find a error');
                
            }
            
        })
        
        // *********for like*********
        app.patch('/like/:id', async (req, res) => {
            const id = Number(req.params.id)
            const like = await tipsCollection.findOneAndUpdate(
                {id:id},{$inc:{totalLiked:1}},{ returnDocument: "after" }
            )
            // console.log(like)
            res.json(like.value)
        })





        // Send a ping to confirm a successful connection
        await client.db("greenhubproject").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World! this is from green hub')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
