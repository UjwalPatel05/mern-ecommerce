const User = require("../model/User");
var bcrypt = require('bcryptjs');
const { sanitizeUser, sendEmail } = require("../services/common");
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

exports.logoutUser = async(req, res) => {
    res.cookie("jwt", null, { httpOnly: true }).sendStatus(200);
};

exports.checkAuth = async(req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.sendStatus(401);
    }
};

exports.resetRequestPassword = async(req, res) => {

    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (user) {

        const data = {
            _id: user._id
        };

        const token = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });

        const Link = `${process.env.FRONT_END_URL}/reset-password/${token}`;

        const subject = "Reset Password";
        const html = `<h1>Reset Password  <a href="${Link}">Link</a></h1> `;

        await sendEmail({
            to: email,
            subject: subject,
            text: "Reset Password",
            html: html
        })

        res.status(200).json({ message: "Email sent successfully" });

    } else {
        res.status(400).json({ message: "Email is not registered" });
    }

};

exports.resetUserPassword = async(req, res) => {
    console.log("req.params", req.params);
    const { password } = req.body
    const { token } = req.params
    console.log("token", token);

    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (verify) {
        const hashPass = await bcrypt.hash(password, 12)
        await User.findByIdAndUpdate(verify._id, { $set: { password: hashPass } })
        res.send({ message: "Password Reset Successfully...!!!", error: 0 })
    } else {
        return res.status(500).send({ error_message: "Internal Server Error...!!!", error: 1 })
    }
};