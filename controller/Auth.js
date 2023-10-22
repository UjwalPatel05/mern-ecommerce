const User = require("../model/User");
var bcrypt = require('bcryptjs');
const { sanitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");

exports.createUser = async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        const user = await User.create(req.body);

        req.login(sanitizeUser(user), (err) => {
            if (err) {
                res.status(400).json(err.message);
            } else {
                const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
                res.cookie("jwt", token, { maxAge: 360000, httpOnly: true }).status(201).json({ id: user.id, role: user.role });
            }
        });

    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.loginUser = async(req, res) => {
    console.log("user in login", req.user);
    res.cookie("jwt", req.user.token, { maxAge: 360000, httpOnly: true }).status(201).json({ id: req.user.id, role: req.user.role });
};

exports.checkAuth = async(req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.sendStatus(401);
    }
};