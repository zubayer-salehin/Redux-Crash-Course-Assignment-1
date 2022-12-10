require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.5pmu7.mongodb.net/tutorial-point?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect the client to the server (optional starting in v4.7)
client.connect()
  .then((result) => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB not connected");
  });

const run = async () => {
  try {
    const db = client.db("tutorial-point");
    const courseCollection = db.collection("course");

    app.get("/courses", async (req, res) => {
      const cursor = courseCollection.find({});
      const course = await cursor.toArray();
      res.send({ status: true, data: course });
    });

    app.post("/course", async (req, res) => {
      const course = req.body;
      const result = await courseCollection.insertOne(course);
      res.send(result);
    });

    app.put("/course/:id", async (req, res) => {
      const id = req.params.id;
      const updateCourse = req.body;
      const result = await courseCollection.updateOne({ _id: ObjectId(id) }, { $set: updateCourse });
      res.send(result);
    });

    app.delete("/course/:id", async (req, res) => {
      const id = req.params.id;
      const result = await courseCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome To Tutorial Point");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
