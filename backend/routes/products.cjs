const express = require("express");
const db = require("../database/db.cjs");

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const products = db
      .prepare("SELECT * FROM products ORDER BY created_at DESC")
      .all();

    res.json(products);
  } catch (error) {
    console.error("Unable to retrieve products:", error);
    res.status(500).json({
      message: "Unable to retrieve products.",
    });
  }
});

router.get("/featured", (req, res) => {
  try {
    const products = db
      .prepare(
        "SELECT * FROM products WHERE featured = 1 ORDER BY created_at DESC"
      )
      .all();

    res.json(products);
  } catch (error) {
    console.error("Unable to retrieve featured products:", error);
    res.status(500).json({
      message: "Unable to retrieve featured products.",
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Unable to retrieve product:", error);
    res.status(500).json({
      message: "Unable to retrieve the product.",
    });
  }
});

module.exports = router;
