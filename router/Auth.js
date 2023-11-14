const express = require("express");
const passport = require("passport");
const { createUser, loginUser, checkAuth, resetRequestPassword, resetUserPassword, logoutUser } = require("../controller/Auth");
const Product = require("../model/Product");
const router = express.Router();

router
    .post("/signup", createUser)
    .get("/logout", logoutUser)
    .post("/login", passport.authenticate("local"), loginUser)
    .get("/check", passport.authenticate("jwt"), checkAuth)
    .post("/reset-password-request", resetRequestPassword)
    .put("/resetUserPassword/:token", resetUserPassword);


module.exports = router;