const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://ramim12:RvNfDeHYKoB64btd@cluster0.ejor6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("islamiainfo");
      const stuffCollection = database.collection("stuff");
       
      //GET API
      app.get('/employee', async (req, res) => {
         const cursor = stuffCollection.find({});
         const result = await cursor.toArray();
         res.send(result)
      })

      // GET SINGLE EMPLOYEE API
      app.get('/employee/:id', async (req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const employee = await stuffCollection.findOne(query);
          res.send(employee);
      })

      //POST API
      app.post('/employee', async (req, res) => {
          const add = req.body;
          const result = await stuffCollection.insertOne(add);
          res.send(result);
      })

      app.put('/employee/:id', async (req, res) => {
          const id = req.params.id;
          const updateUser = req.body;
          const filter = {_id: ObjectId(id)};
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              name:updateUser.name,
              email:updateUser.email,
              phone:updateUser.phone,
              designation:updateUser.designation,
              branch:updateUser.branch
            },
          };
          const result = await stuffCollection.updateOne(filter, updateDoc, options);
          console.log(result);
          res.json(result);
      })

      //DELETE API
      app.delete('/employee/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await stuffCollection.deleteOne(query);
            res.send(result);
      })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('CRUD SERVER RUNNING........')
})
  

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// username: ramim12
// password: RvNfDeHYKoB64btd

