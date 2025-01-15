import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "You can't post an empty comment!"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

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
  // * Adding a relationship between destinations and users - says user has to be connect to each object
  // ? This is called a reference relationship.
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comments: [commentSchema],
});

// export the schema as a model
// ! The first argument to the model method MUST be a string pascalcase (uppercase words), singular
export default mongoose.model("Flower", flowerSchema);
