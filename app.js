require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.listen(3000, function () {
    console.log("Server running on PORT: 3000");
});

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", async function (req, res) {
    const user = new User({
        email: req.body.username,
        password: req.body.password
    })
    try {
        user.save()
            .then(function () {
                res.render("secrets");
            })
            .catch(function (err) {
                console.log(err);
            })
    } catch (err) {
        res.render(err);
    }
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(function (foundUser) {
            if (foundUser.password === password) {
                res.render("secrets");
            }
        })
        .catch(function (err) {
            console.log(err);
        })

})