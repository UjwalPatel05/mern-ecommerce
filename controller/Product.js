const Product = require("../model/Product");

exports.createProduct = async(req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.fetchAllProduct = async(req, res) => {
    let condition = {};
    if (req.query.admin) {
        condition = { deleted: { $ne: true } };
    }
    let query = Product.find(condition);
    if (req.query.category) {
        query = query.find({ category: req.query.category });
    }
    if (req.query.brand) {
        query = query.find({ brand: req.query.brand });
    }
    if (req.query._sort && req.query._order) {
        query = query.sort({
            [req.query._sort]: req.query._order
        });
    }

    const totalDocs = await Product.countDocuments(query);


    if (req.query._limit && req.query._page) {
        const page = parseInt(req.query._page);
        const limit = parseInt(req.query._limit);

        query = query.skip((page - 1) * limit).limit(limit);
    }

    try {
        const products = await query.exec();
        res.set("X-Total-Count", totalDocs);
        res.status(201).json(products);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.fetchProductById = async(req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.updateProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json(err.message);
    }
};