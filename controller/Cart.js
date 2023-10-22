const Cart = require("../model/Cart");

exports.fetchCartByUser = async(req, res) => {
    const { id } = req.user;
    try {
        const cart = await Cart.find({ user: id }).populate("product").populate("user");
        res.status(201).json(cart);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.addToCart = async(req, res) => {
    try {
        const cart = await Cart.create({...req.body, user: req.user.id });
        const result = await cart.populate("product");
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.updateCart = async(req, res) => {
    const { id } = req.params;
    try {
        const cart = await Cart.findByIdAndUpdate(id, req.body, {
            new: true
        });
        const result = await cart.populate("product");
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json(err.message);
    }
};



exports.deleteFromCart = async(req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findByIdAndDelete(id);
        res.status(200).json(cart);
    } catch (err) {
        res.status(400).json(err.message);
    }
};