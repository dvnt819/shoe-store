const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); 

mongoose
  .connect("mongodb://localhost:27017/shoeStore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const ShoeSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String, 
});

const Shoe = mongoose.model("Shoe", ShoeSchema);

const ADMIN_PASSWORD = "admin123";

app.get("/shoes", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const shoes = await Shoe.find({
      name: { $regex: searchQuery, $options: "i" },
    });
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shoes" });
  }
});

app.post("/api/shoes", async (req, res) => {
  try {
    const { name, price, image, adminPassword } = req.body;

    if (adminPassword !== ADMIN_PASSWORD) {
      return res.status(403).json({ error: "Incorrect admin password" });
    }

    const newShoe = new Shoe({ name, price, image });
    await newShoe.save();
    res.status(201).json(newShoe);
  } catch (error) {
    res.status(500).json({ message: "Error adding shoe" });
  }
});

app.delete("/api/shoes/:id", async (req, res) => {
  try {
    await Shoe.findByIdAndDelete(req.params.id);
    res.json({ message: "Shoe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shoe" });
  }
});

app.put("/api/shoes/:id", async (req, res) => {
  try {
    const { name, price, image, adminPassword } = req.body;

    if (adminPassword !== ADMIN_PASSWORD) {
      return res.status(403).json({ error: "Incorrect admin password" });
    }

    const updatedShoe = await Shoe.findByIdAndUpdate(
      req.params.id,
      { name, price, image },
      { new: true }
    );

    if (!updatedShoe) {
      return res.status(404).json({ error: "Shoe not found" });
    }

    res.json(updatedShoe);
  } catch (error) {
    res.status(500).json({ message: "Error updating shoe" });
  }
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
