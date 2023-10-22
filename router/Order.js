const express = require("express");
const {
    createOrder,
    fetchOrdersByUser,
    updateOrder,
    deleteOrder,
    fetchAllOrders,
} = require("../controller/Order");
const router = express.Router();

router
    .post("/", createOrder)
    .get("/user", fetchOrdersByUser)
    .patch("/:id", updateOrder)
    .delete("/:id", deleteOrder)
    .get("/", fetchAllOrders);

module.exports = router;