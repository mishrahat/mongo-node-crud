const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mydbuser-998:llMMPCw9q6A7pmSx@cluster0.31jti.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//user: mydbuser-998
//password: llMMPCw9q6A7pmSx

async function run() {
    try {
        await client.connect();
        const database = client.db('foodMaster');
        const usersCollection = database.collection('users');

        //GET APi
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('load user with id', id);
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            res.send(user);
        })

        //POST API
        app.post('/users', async (req, res) => {
            // console.log('hitting the post', req.body);
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            // console.log('added user', result);
            res.json(result);
        })

        //UPDATE API
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        //DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            console.log('Deleting USER with ID', result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running my CRUD server');
})

app.listen(port, () => {
    console.log('Running server on port', port);
})