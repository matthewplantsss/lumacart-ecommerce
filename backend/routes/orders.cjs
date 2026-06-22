const express = require("express");
const db = require("../database/db.cjs");

const router = express.Router();

router.post("/", (req, res) => {
  const {
    customerName,
    customerEmail,
    address,
    city,
    state,
    zipCode,
    items,
  } = req.body;

  if (
    !customerName ||
    !customerEmail ||
    !address ||
    !city ||
    !state ||
    !zipCode
  ) {
    return res.status(400).json({
      message: "Please complete all required checkout fields.",
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Your cart is empty.",
    });
  }

  try {
    const createOrder = db.transaction(() => {
      let subtotal = 0;

      const verifiedItems = items.map((item) => {
        const product = db
          .prepare("SELECT * FROM products WHERE id = ?")
          .get(item.id);

        if (!product) {
          throw new Error(`Product ${item.id} was not found.`);
        }

        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new Error(`Invalid quantity for ${product.name}.`);
        }

        if (product.inventory < quantity) {
          throw new Error(
            `${product.name} only has ${product.inventory} item(s) available.`
          );
        }

        subtotal += product.price * quantity;

        return {
          product,
          quantity,
        };
      });

      subtotal = Number(subtotal.toFixed(2));
      const shipping = subtotal >= 75 ? 0 : 8.99;
      const tax = Number((subtotal * 0.0725).toFixed(2));
      const total = Number((subtotal + shipping + tax).toFixed(2));

      const orderResult = db
        .prepare(`
          INSERT INTO orders (
            user_id,
            customer_name,
            customer_email,
            total,
            status
          )
          VALUES (?, ?, ?, ?, ?)
        `)
        .run(
          null,
          customerName,
          customerEmail,
          total,
          "Processing"
        );

      const orderId = orderResult.lastInsertRowid;

      const insertOrderItem = db.prepare(`
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          price
        )
        VALUES (?, ?, ?, ?)
      `);

      const reduceInventory = db.prepare(`
        UPDATE products
        SET inventory = inventory - ?
        WHERE id = ?
      `);

      for (const item of verifiedItems) {
        insertOrderItem.run(
          orderId,
          item.product.id,
          item.quantity,
          item.product.price
        );

        reduceInventory.run(item.quantity, item.product.id);
      }

      return {
        orderId,
        subtotal,
        shipping,
        tax,
        total,
      };
    });

    const order = createOrder();

    res.status(201).json({
      message: "Your order was placed successfully.",
      order: {
        id: Number(order.orderId),
        customerName,
        customerEmail,
        shippingAddress: {
          address,
          city,
          state,
          zipCode,
        },
        subtotal: Number(order.subtotal.toFixed(2)),
        shipping: Number(order.shipping.toFixed(2)),
        tax: Number(order.tax.toFixed(2)),
        total: Number(order.total.toFixed(2)),
        status: "Processing",
      },
    });
  } catch (error) {
    console.error("Unable to create order:", error);

    res.status(400).json({
      message: error.message || "Unable to place the order.",
    });
  }
});

router.get("/", (req, res) => {
  try {
    const orders = db
      .prepare(`
        SELECT
          id,
          customer_name,
          customer_email,
          total,
          status,
          created_at
        FROM orders
        ORDER BY created_at DESC
      `)
      .all();

    res.json(orders);
  } catch (error) {
    console.error("Unable to retrieve orders:", error);

    res.status(500).json({
      message: "Unable to retrieve orders.",
    });
  }
});


router.patch("/:id/status", (req, res) => {
  const { status } = req.body;

  const allowedStatuses = [
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status.",
    });
  }

  try {
    const existingOrder = db
      .prepare("SELECT id FROM orders WHERE id = ?")
      .get(req.params.id);

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    db.prepare(`
      UPDATE orders
      SET status = ?
      WHERE id = ?
    `).run(status, req.params.id);

    const updatedOrder = db
      .prepare(`
        SELECT
          id,
          customer_name,
          customer_email,
          total,
          status,
          created_at
        FROM orders
        WHERE id = ?
      `)
      .get(req.params.id);

    res.json({
      message: "Order status updated.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Unable to update order:", error);

    res.status(500).json({
      message: "Unable to update the order status.",
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const order = db
      .prepare(`
        SELECT
          id,
          customer_name,
          customer_email,
          total,
          status,
          created_at
        FROM orders
        WHERE id = ?
      `)
      .get(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const items = db
      .prepare(`
        SELECT
          order_items.product_id,
          order_items.quantity,
          order_items.price,
          products.name,
          products.image
        FROM order_items
        JOIN products
          ON products.id = order_items.product_id
        WHERE order_items.order_id = ?
      `)
      .all(req.params.id);

    res.json({
      ...order,
      items,
    });
  } catch (error) {
    console.error("Unable to retrieve order:", error);

    res.status(500).json({
      message: "Unable to retrieve the order.",
    });
  }
});

module.exports = router;
