const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const userRoutes = require("./routes/user");
const app = express();
const ObjectId = require("mongodb").ObjectID;
const port = process.env.PORT || 9000;

// middleware

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/public", express.static("public"));
app.use(express.json());
app.use("/api", userRoutes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

MongoClient.connect(process.env.MONGODB_URI)
  .then((client) => {
    const db = client.db("myFirstDatabase");
    const usersCollection = db.collection("users");
    // CREAR USUARIOS
    app.post("/users", (req, res) => {
      usersCollection
        .insertOne(req.body)
        .then((result) => {
          console.log(req.body);
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });
    app.post("/delete", (req, res) => {
      usersCollection
        .deleteOne({ _id: mongoose.Types.ObjectId(req.body.id) })
        .then((result) => {
          console.log(result);
          console.log(req.body);
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });
    // OBTENER TODOS LOS USUARIOS

    app.get("/", (req, res) => {
      db.collection("users")
        .find()
        .toArray()
        .then((results) => {
          res.render("index", { users: results });
        })
        .catch(/* ... */);
    });
  })
  .catch(console.error);

// CONEXIÓN API
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to Mongo"))
  .catch((error) => console.error(error));

app.listen(port, () => console.log("server listening on port", port));
