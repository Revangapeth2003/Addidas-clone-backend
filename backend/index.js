const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3030;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri =
  "mongodb+srv://revangapeth2003:FUMDmiBW0PhDCUba@cluster0.itoxfdp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("The DB is connected!");

    const form = client.db("formCollection").collection("formData");

    // API Routes
    app.post("/form", async (req, res) => {
      try {
        const data = req.body;
        const result = await form.insertOne(data);
        res
          .status(201)
          .json({ message: "Form submitted successfully!", data: result });
      } catch (error) {
        res
          .status(500)
          .json({ error: "Error submitting form", details: error });
      }
    });

    app.get("/form", async (req, res) => {
      try {
        const result = await form.find().toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Error fetching data", details: error });
      }
    });

    app.get("/form/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await form.findOne({ _id: new ObjectId(id) });
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Error fetching data", details: error });
      }
    });

    app.patch("/form/:id", async (req, res) => {
      try {
        console.log("Incoming update data:", req.body); // Add this
        const id = req.params.id;
        const updateData = req.body;

        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: { ...updateData } };
        const option = { upsert: true };

        const result = await form.updateOne(filter, updateDoc, option);
        console.log("Update result:", result); // Add this

        const updatedDoc = await form.findOne(filter);
        console.log("Updated document:", updatedDoc); // Add this

        res.status(200).send(updatedDoc);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Update failed" });
      }
    });

    app.delete("/form/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await form.deleteOne({ _id: new ObjectId(id) });
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Error deleting data", details: error });
      }
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// FUMDmiBW0PhDCUba;
