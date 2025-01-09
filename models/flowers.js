import mongoose from "mongoose";

// create a schema (consistent format) for my destination collection
const flowerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  scientific_name: { type: String, required: false },
  colors: [{ type: String, required: true }],
  season: {
    type: String,
    enum: [
      "Spring",
      "spring",
      "Summer",
      "summer",
      "Year-round",
      "year-round",
      "Autumn",
      "autumn",
      "Winter",
      "winter",
    ],
  },
  symbolism: { type: String },
});

// export the schema as a model
// ! The first argument to the model method MUST be a string pascalcase (uppercase words), singular
export default mongoose.model("Flower", flowerSchema);
