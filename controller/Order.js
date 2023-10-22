const Order = require("../model/Order");

exports.fetchOrdersByUser = async(req, res) => {
    const { id } = req.user;
    try {
        const orders = await Order.find({ user: id });
        res.status(201).json(orders);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.createOrder = async(req, res) => {
    try {
        const order = await Order.create(req.body);
        // const result = await cart.populate("product");
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.updateOrder = async(req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndUpdate(id, req.body, {
            new: true
        });
        // const result = await cart.populate("product");
        res.status(200).json(order);
    } catch (err) {
        res.status(400).json(err.message);
    }
};



exports.deleteOrder = async(req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        res.status(200).json(order);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.fetchAllOrders = async(req, res) => {
    let query = Order.find({});

    if (req.query._sort && req.query._order) {
        query = query.sort({
            [req.query._sort]: req.query._order
        });
    }

    const totalDocs = await Order.countDocuments(query);


    if (req.query._limit && req.query._page) {
        const page = parseInt(req.query._page);
        const limit = parseInt(req.query._limit);

        query = query.skip((page - 1) * limit).limit(limit);
    }

    try {
        const orders = await query.exec();
        res.set("X-Total-Count", totalDocs);
        res.status(201).json(orders);
    } catch (err) {
        res.status(400).json(err.message);
    }
};