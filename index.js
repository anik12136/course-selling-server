const express = require ('express');
const app = express();
const cors = require ('cors');
require('dotenv').config()
const port = process.env.PORT || 9000 ;

//middleware

app.use (cors());
app.use (express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.00oqpy6.mongodb.net/?retryWrites=true&w=majority`;


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

    const demoCourses = client.db("sadLab").collection("demoCourses");
    const formCourses = client.db("sadLab").collection("formCourses");
    const users = client.db("sadLab").collection("users");
    // console.log(demoCourses)

    // Demo course .....api
    app.get('/demoCourses' , async (req,res) => {
        const result = await demoCourses.find().toArray();
        res.send(result);
    })

    // formCourses courses that are posted by instructors ....api
    app.get('/formCourses' , async (req,res) => {
        const result = await formCourses.find().toArray();
        res.send(result);
    })

    // insert courses to database from instructor
    // app.post('/formCourses', async(req,res) =>{
    //     const newFormCourses = req.body;
    //     // console.log(newFormCourses);
    //     const result = await formCourses.insertOne(newFormCourses);
    //     res.send(result);
    // })

    // insert users to database from instructor
    app.post('/users', async(req,res) =>{
        const newUser = req.body;
        // console.log(newFormCourses);
        const result = await users.insertOne(newUser);
        res.send(result);
    })

    // only one instructor class
    app.get('/formCourses/:email', async (req, res) => {
      const email = req.params.email;
      const result = await formCourses.find({ email: email }).toArray();
      res.send(result);
      });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// --------------------------------


app.get( '/', (req,res) => {
    res.send('course selling server  is running')
})

// formCourses courses that are posted by instructors ....api
app.get('/formCourses' , async (req,res) => {
  const result = await formCourses.find().toArray();
  res.send(result);
})

app.listen (port, () =>{
    console.log(`course selling server is running on port ${port}`)
})
