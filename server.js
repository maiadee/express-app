import express from "express";
// You can import your own files into each other.
import flowers from "./data.js";

const app = express();

// ! 🚨 We need this line of code for posting JSON to express
app.use(express.json());

// Listen for requests on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.get("/flowers", function (req, res) {
  res.send(flowers);
});

app.post("/flowers", function (req, res) {
  // get new flower from the body of request
  const newFlower = req.body;
  // add to existing flowers
  flowers.push(newFlower);
  // send back flower with appropriate status code
  res.status(201).send(newFlower);
});

app.delete("/flowers/:name", function (req, res) {
  const flowerName = req.params.name;

  // find flower index by name
  const flowerIndex = flowers.findIndex(
    (flower) => flower.name.toLowerCase() === flowerName.toLowerCase()
  );
  if (flowerIndex === -1) {
    return res.status(404).json({ error: "Flower not found." });
  }

  // remove flower and store deleted flower
  const deletedFlower = flowers.splice(flowerIndex, 1);

  res.status(200).send(deletedFlower);
});

app.put("/flowers/:name", function (req, res) {
  const flowerName = req.params.name;
  const updatedFlower = req.body;

  const flowerIndex = flowers.findIndex((currentFlower) => {
    return currentFlower.name.toLowerCase() === flowerName.toLowerCase();
  });
  // overwrite that object in array
  flowers[flowerIndex] = updatedFlower;

  res.status(200).send(updatedFlower);
});
