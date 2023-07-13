const express = require("express");

const router = express.Router();
let Plant = require("../model/plantModel");
let User = require("../model/model");

// Get all plants by a user id
router.get("/plants", async function (req, res) {
  try {
    const plants = await Plant.find({
      userId: req.headers.userid,
    });
    if (plants) {
      res.send(plants);
    }
  } catch (err) {
    res.status(err?.status || 404).send(err?.message || "No plants found");
  }
});

// Get all plants and all users for some statistics
router.get("/overview", async function (req, res) {
  try {
    const plants = await Plant.find({});
    const users = await User.find({});
    if (plants && users) {
      res.send({ plants, users });
    } else {
      res.send({});
    }
  } catch (err) {
    res.status(err?.status || 404).send(err?.message || "No plants found");
  }
});

// Get one plant by id (legacy)
router.get("/plant", function (req, res) {
  Plant.findById(req.headers.id, function (err, plant) {
    if (err) {
      res.status(err?.status || 404).send(err?.message || "No plant found");
    } else {
      res.json(plant);
    }
  });
});

// Add a plant to the db
router.post("/plants/add", function (req, res) {
  let plant = new Plant({
    ...req.body,
    userId: req.headers.userid,
  });
  plant
    .save()
    .then((plant) => {
      res.status(200).send({ plant: "Plant added successfully" });
    })
    .catch((err) => {
      res
        .status(err?.status || 404)
        .send(err?.message || "Could not add plant");
    });
});

//Delete a plant by id
router.delete("/plants/delete", async (req, res) => {
  const { _id } = req.body;
  try {
    let deleted = await Plant.deleteOne({ _id });
    if (!(deleted.deletedCount > 0)) {
      throw new Error("Cannot find plant with that id");
    }
    res.status(200).send({ plant: "Plant Deleted" });
  } catch (error) {
    res.status(err?.status || 401).send(err?.message || "Error Deleting");
  }
});

//Water a plant
router.post("/plants/water", async (req, res) => {
  const plant = await Plant.findByIdAndUpdate(
    { _id: req.body._id },
    { dateWatered: req.body.dateWatered }
  );
  if (plant) {
    res.status(200).send({ plant: "Plant Updated" });
  } else {
    res.status(401).send({ plant: "Error Updating Plant" });
  }
});

//Edit a plants details
router.post("/plants/update", async function (req, res) {
  try {
    const plant = await Plant.updateOne({ _id: req.body._id }, req.body);
    if (!plant.acknowledged) {
      throw new Error("Cannot find plant with that id");
    }
    if (!(plant.modifiedCount > 0)) {
      return res.status(304).send({ message: "No changes made" });
    }
    return res.status(200).send({ plant: "Plant Updated" });
  } catch (err) {
    res.status(err?.status || 401).send(err?.message || "Error Deleting");
  }
});

module.exports = router;
