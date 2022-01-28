const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;
;

//middelware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.orb6q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
      await client.connect();
      //console.log('connected to the database')
      const database = client.db("tsunami-tour");
      const blogsCollection = database.collection("blogs");
      const experienceCollection = database.collection("experience");
      const reviewCollection = database.collection("review");
      
      //get api
      app.get('/blogs', async(req, res)=>{
        const cursor = blogsCollection.find({});
        const blogs = await cursor.toArray();
        res.send(blogs);
      })
      app.get('/experience', async(req, res)=>{
        const cursor = experienceCollection.find({});
        const experience = await cursor.toArray();
        res.send(experience);
      })
      app.get('/review', async(req, res)=>{
        const cursor = reviewCollection.find({});
        const review = await cursor.toArray();
        res.send(review);
      })

      //get single service
      app.get('/blogs/:id', async(req, res) =>{
        const id = req.params.id;
        console.log('getting specific service', id)
        const query = {_id: ObjectId(id)};
        const service = await blogsCollection.findOne(query);
        res.json(service);
      })

      //Post api
      app.post('/blogs', async(req, res)=>{
        const service = req.body;
         console.log('hit the post api', service);

         const result = await blogsCollection.insertOne(service);
         console.log(result);
         res.json(result)
      
        }) ;

        app.post('/experience', async(req, res)=>{
          const user = req.body;
           console.log('hit the post api', user);
  
           const result = await experienceCollection.insertOne(user);
           console.log(result);
           res.json(result)
        
          }) ;
          app.post('/review', async(req, res)=>{
            const review = req.body;
             console.log('hit the post api', review);
    
             const result = await reviewCollection.insertOne(review);
             console.log(result);
             res.json(result)
          
            }) ;


        // delete api
        app.delete('/experience/:id',async(req, res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId}
          const result = await experienceCollection.deleteOne(query);
          res.json(result);
        })

    } 
    
    finally {
      //await client.close();
    }
  }

  run().catch(console.dir);

      

app.get('/', (req, res) => {
  res.send('Tsunami Tour');
});

app.listen(port, () => {
  console.log('Running tsunami tour on port',port)
})