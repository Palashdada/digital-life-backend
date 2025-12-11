require("dotenv").config();
const express = require("express");

const cors = require("cors");
const admin = require("firebase-admin");
const Stripe = require("stripe");

const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://<db_username>:<db_password>@cluster0.hgrlmye.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get("/lessons", async (req, res) => {
      const list = await lessons.find({}).toArray();
      res.send(list);
    });
    app.get("/lessons/:id", async (req, res) => {
      const lesson = await lessons.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(lesson);
    });
    app.post("/lessons", verifyToken, isAdmin, async (req, res) => {
      const data = req.body;
      data.createdAt = new Date();
      const result = await lessons.insertOne(data);
      res.send(result);
    });
    app.put("/lessons/:id", verifyToken, isAdmin, async (req, res) => {
      const result = await lessons.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      res.send(result);
    });
    app.delete("/lessons/:id", verifyToken, isAdmin, async (req, res) => {
      const result = await lessons.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });
    app.post("/lessons/:id/like", verifyToken, async (req, res) => {
      const userEmail = req.user.email;
      const lessonId = req.params.id;

      await lessons.updateOne(
        { _id: new ObjectId(lessonId) },
        { $addToSet: { likes: userEmail } }
      );

      res.send({ message: "Liked" });
    });
    app.post("/lessons/:id/favorite", verifyToken, async (req, res) => {
      const userEmail = req.user.email;
      const lessonId = req.params.id;

      await lessons.updateOne(
        { _id: new ObjectId(lessonId) },
        { $addToSet: { favorites: userEmail } }
      );

      res.send({ message: "Favorited" });
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
