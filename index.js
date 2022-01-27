const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleaware
app.use(cors());
app.use(express.json());
app.use(fileUpload())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.orb6q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {
        await client.connect();

        const database = client.db("tsunami-tour");
        const blogCollection = database.collection("blogs");
        const usersCollection = database.collection("users");


        //POST API- New Blog
        app.post('/blogs', async (req, res) => {
            const name = req.body.name;
            const address = req.body.address;
            const location = req.body.location;
            const expense = req.body.expense;
            const email = req.body.email;
            const date = req.body.date;
            const time = req.body.time;
            const status = req.body.status;
            const rating = req.body.rating;
            const pic = req.files.image;

            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imgBuffer = Buffer.from(encodedPic, 'base64');
            const brand = {
                name,
                address,
                location,
                expense,
                email,
                date,
                time,
                rating,
                status,
                image: imgBuffer
            };
            const result = await blogCollection.insertOne(brand);
            console.log(result);
            res.json(result);
        });


        //save users
        app.post('/users', async (req, res) => {
            const user = await usersCollection.insertOne(req.body);
            console.log(user);
            res.json(user);
        });

        // UPDATE API - users

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateUser = { $set: user }
            const result = await usersCollection.updateOne(filter, updateUser, options);
            res.json(result);

        });

        console.log('database connected successfully');

    } finally {
        //await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send(' server is running');
});

app.listen(port, () => {
    console.log('server running at port', port);
});