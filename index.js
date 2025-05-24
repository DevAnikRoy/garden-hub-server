require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        // await client.connect();

        // main cluster
        const db = client.db('greenhubproject')

        const usersCollection = db.collection('gardeners')

        // tips collection
        const tipsCollection = db.collection('trendingTips')


        app.get('/gardeners', async (req, res) => {
            // console.log('is this showing', req.body)
            const gardeners = await usersCollection.find({ status: "active" }).toArray()
            res.json({ data: gardeners, item: gardeners.length })
        })
        app.get('/explore-gardeners', async (req, res) => {
            // console.log('is this showing', req.body)
            const gardeners = await usersCollection.find({}).toArray()
            res.json({ data: gardeners, item: gardeners.length })
        })

        app.get('/gardeners/tips', async (req, res) => {
            const tips = await tipsCollection.find().limit(6).toArray()
            res.json(tips)
        })

        app.get('/browse-tips', async (req, res) => {
            const tips = await tipsCollection.find().toArray()
            res.json(tips)
        })
        app.get('/browse-tips/:id', async (req, res) => {
            const { id } = req.params;
            console.log(id)
            try {
                const tip = await tipsCollection.findOne({ id: Number(id) });
                console.log(tipsCollection)
                if (!tip) {
                    return res.status(404).json({ error: 'Tip not found' });
                }
                res.json(tip);
            } catch (error) {
                console.error('Error fetching tip:', error);
                res.status(500).json({ error: 'Failed to fetch tip' });
            }
        });

        // post method
        app.post('/share-tip', async (req, res) => {
            try {
                const newTip = req.body;
                const lastTip = await tipsCollection.find().sort({ id: -1 }).limit(1).toArray();
                const lastId = lastTip.length > 0 ? lastTip[0].id : 0;
                const newId = lastId + 1;
                newTip.id = newId;
                await tipsCollection.insertOne(newTip);
                res.status(201).send({ message: 'Tip added successfully', id: newId });
            } catch (error) {
                console.error('Error adding tip:', error);
                res.status(500).send('An error occurred while saving the tip');
            }
        });
        
        app.get('/my-tips', async (req, res) => {
            const tips = await tipsCollection.find().toArray()
            res.json(tips)
        })
        
        app.get('/my-tips/:id', async (req, res) => {
            const tips = await tipsCollection.find().toArray()
            res.json(tips)
        })
        
        // for delete
        app.delete('/my-tips/:id', async(req, res) => {
            const {id} = req.params;
            const query = {id: Number(id)}
            const result = await tipsCollection.deleteOne(query)
            res.send(result)
        })
        // for update my tips
        app.put('/update-tip/:id', async (req, res) => {
            const {id} = req.params;
            const filter = {id: Number(id)}
            const options = { upsert: true };
            const updatedTips = req.body;
            const updatedDoc = {
                $set: updatedTips
            }
            
            const result = await tipsCollection.updateOne(filter, updatedDoc, options);
            
            res.send(result)
        })

        // *********for like*********
        app.patch('/like/:id', async (req, res) => {
            const id = Number(req.params.id)
            const like = await tipsCollection.findOneAndUpdate(
                { id: id }, { $inc: { totalLiked: 1 } }, { returnDocument: "after" }
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
