const express = require("express");
const router = express.Router();
const Shoe = require("../models/Shoe");

router.get("/", async (req, res) => {
  try {
    const shoes = await Shoe.find();
    res.json(shoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).json({ error: "Shoe not found" });
    res.json(shoe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, price, description, image, adminPassword } = req.body;

  if (adminPassword !== "admin123") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const newShoe = new Shoe({ name, price, description, image });
    await newShoe.save();
    res.status(201).json(newShoe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  const { adminPassword } = req.body;

  if (adminPassword !== "admin123") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const deletedShoe = await Shoe.findByIdAndDelete(req.params.id);
    if (!deletedShoe) return res.status(404).json({ error: "Shoe not found" });
    res.json({ message: "Shoe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
