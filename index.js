const express = require("express")
const cors = require("cors");
const jwt = require("jsonwebtoken")
const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config()
const app = express()
const port = process.env.port || 4000;

//middleware
app.use(cors())
app.use(express.json())

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sy54hal.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const db = client.db("Gadget-shop");
// const bookParcelCollection = db.collection("bookParcel");
const userCollection = db.collection('users')

const dbConnect = async () => {
  try {
    client.connect();
    console.log("mongodb connected successfully");

    //jwt
    app.post("/jwt", async (req, res) => {
      const userEmail = req.body
      // console.log(userEmail)
      const token = jwt.sign(userEmail, process.env.ACCESS_TOKEN, {
        expiresIn: '10d'
      })
      res.send({ token })
    })

    app.post('/users', async (req, res) => {
      const user = req.body
      // console.log("user:  ",user)
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email)
      const query = { email: email };
      const user = await userCollection.findOne(query);
      // console.log("users by email :  ", user)
      res.send(user)
    })


  } catch (error) {
    console.log(error.name, error.message);
  }


};
dbConnect()

//api
app.get("/", (req, res) => {
  res.send("server is running");


})




app.listen(port, () => {
  console.log(`server is running on port, ${port}`);
})
