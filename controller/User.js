const User = require("../model/User");

exports.fetchUserById = async(req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id, "-password");
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err.message);
    }
};