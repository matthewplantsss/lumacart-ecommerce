const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

require("./database/seed.cjs");

const productsRouter = require("./routes/products.cjs");
const ordersRouter = require("./routes/orders.cjs");

const app = express();

const PORT = process.env.PORT || 5050;

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin ${origin} is not allowed by CORS.`)
      );
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "LumaCart backend is running.",
  });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found.",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    message: "An unexpected server error occurred.",
  });
});

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(
    `LumaCart backend running at http://127.0.0.1:${PORT}`
  );
});

server.on("error", (error) => {
  console.error("LumaCart backend server error:", error);
  process.exitCode = 1;
});

process.on("SIGTERM", () => {
  console.log("LumaCart backend shutting down.");

  server.close(() => {
    process.exit(0);
  });
});
