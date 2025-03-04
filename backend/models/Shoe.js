const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String, 
});

const Shoe = mongoose.model("Shoe", shoeSchema);

module.exports = Shoe;
