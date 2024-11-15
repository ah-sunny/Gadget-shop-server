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
const dbConnect = async () => {
  try {
    client.connect();
    console.log("mongodb connected successfully");

    //jwt
    app.post("/jwt", async (req, res) => {
      const userEmail = req.body
      console.log(userEmail)
      const token = jwt.sign(userEmail, process.env.ACCESS_TOKEN, {
        expiresIn: '10d'
      })
      res.send({ token })
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
