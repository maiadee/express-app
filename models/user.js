import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

// create a schema (consistent format) for my user collection
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(mongooseUniqueValidator);
// export the schema as a model
// ! The first argument to the model method MUST be a string pascalcase (uppercase words), singular
export default mongoose.model("User", userSchema);
