const Brand = require("../model/Brand");

exports.fetchBrands = async(req, res) => {
    try {
        const brands = await Brand.find({});
        res.status(201).json(brands);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

exports.createBrand = async(req, res) => {
    try {
        const brand = await Brand.create(req.body);
        res.status(201).json(brand);
    } catch (err) {
        res.status(400).json(err.message);
    }
};