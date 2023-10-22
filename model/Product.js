const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be less than 0"],
    },
    discountPercentage: {
        type: Number,
        min: [0, "Discount percentage cannot be less than 0"],
        max: [100, "Discount percentage cannot be more than 100"],
    },
    rating: {
        type: Number,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot be more than 5"],
        default: 0,
    },
    stock: {
        type: Number,
        min: [0, "Stock cannot be less than 0"],
        default: 0,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

// {
//     "id": 1,
// "title": "iPhone 9x",
// "description": "An apple mobile which is nothing like apple",
// "price": 549,
// "discountPercentage": 12.96,
// "rating": 4.69,
// "stock": 0,
// "brand": "Apple",
// "category": "smartphones",
// "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
// "images": [
//   "https://i.dummyjson.com/data/products/1/1.jpg",
//   "https://i.dummyjson.com/data/products/1/2.jpg",
//   "https://i.dummyjson.com/data/products/1/3.jpg",
//   "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
// ]
//   }

const virtual = productSchema.virtual("id");
virtual.get(function() {
    return this._id;
});

productSchema.set("toJSON", { virtuals: true, versionKey: false, transform: function(doc, ret) { delete ret._id; } });

module.exports = mongoose.model("Product", productSchema);