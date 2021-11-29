const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const userRoutes = require("./routes/user");
const methodOverride = require("method-override");
const app = express();
const port = process.env.PORT || 9000;

// middleware

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/public", express.static("public"));
app.use(express.json());
app.use("/api", userRoutes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Conexión al cliente de Mongo

MongoClient.connect(process.env.MONGODB_URI)
  .then((client) => {
    const db = client.db("myFirstDatabase");
    const usersCollection = db.collection("users");

    // CREAR CONTACTOS
    app.post("/users", (req, res) => {
      usersCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    // BORRAR CONTACTOS
    app.post("/delete", (req, res) => {
      usersCollection
        .deleteOne({ _id: mongoose.Types.ObjectId(req.body.id) })
        .then((result) => {
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
        .catch((error) => console.error(error));
    });

    // Obtener página edit

    app.post("/edit", (req, res) => {
      usersCollection
        .findOne({ _id: mongoose.Types.ObjectId(req.body.id) })
        .then((results) => {
          res.render("edit", { users: results });
        })
        .catch((error) => console.error(error));
    });

    // Editar el contacto

    app.put("/edit", (req, res) => {
      usersCollection
        .findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(req.body.id) },
          {
            $set: {
              name: req.body.name,
              surname: req.body.surname,
              phone: req.body.phone,
              email: req.body.email,
            },
          },
          { new: true, omitUndefined: true }
        )
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error))
        .catch((error) => console.error(error));
    });
  })
  .catch(console.error);

// CONEXIÓN API
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to Mongo"))
  .catch((error) => console.error(error));

app.listen(port, () => console.log("server listening on port", port));
