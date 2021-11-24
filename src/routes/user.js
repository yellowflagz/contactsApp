const express = require("express");
const router = express.Router();
const userSchema = require("../models/user");

// Create New User
router.post("/users", (req, res) => {
  const user = userSchema(req.body);
  user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get All Users
router.get("/users", (req, res) => {
  userSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get a single user

router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Update User

router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, surname, phone, email } = req.body;
  userSchema
    .updateOne({ _id: id }, { $set: { name, surname, phone, email } })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Delete User

router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .remove({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
