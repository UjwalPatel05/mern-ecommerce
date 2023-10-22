const Category = require("../model/Category");

exports.fetchCategories = async(req, res) => {
    try {
        const categories = await Category.find({});
        res.status(201).json(categories);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.createCategory = async(req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json(err.message);
    }
};