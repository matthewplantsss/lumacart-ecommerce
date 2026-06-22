const db = require("./db.cjs");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    inventory INTEGER NOT NULL DEFAULT 0,
    featured INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Processing',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

const existingProducts = db
  .prepare("SELECT COUNT(*) AS count FROM products")
  .get();

if (existingProducts.count === 0) {
  const products = [
    {
      name: "Aurora Wireless Headphones",
      description:
        "Premium over-ear headphones with active noise cancellation and up to 30 hours of battery life.",
      price: 129.99,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      inventory: 18,
      featured: 1,
    },
    {
      name: "Minimalist Smartwatch",
      description:
        "A clean, modern smartwatch with fitness tracking, notifications, and heart-rate monitoring.",
      price: 179.99,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      inventory: 12,
      featured: 1,
    },
    {
      name: "Urban Canvas Backpack",
      description:
        "A durable everyday backpack with a padded laptop compartment and water-resistant canvas.",
      price: 74.99,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
      inventory: 25,
      featured: 1,
    },
    {
      name: "Ceramic Pour-Over Set",
      description:
        "A handcrafted ceramic coffee set designed for a smooth and balanced brewing experience.",
      price: 49.99,
      category: "Home",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
      inventory: 20,
      featured: 0,
    },
    {
      name: "Modern Desk Lamp",
      description:
        "An adjustable LED desk lamp with three brightness settings and a minimalist aluminum frame.",
      price: 59.99,
      category: "Home",
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
      inventory: 14,
      featured: 1,
    },
    {
      name: "Classic Leather Wallet",
      description:
        "A slim genuine-leather wallet with RFID protection and six card slots.",
      price: 39.99,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
      inventory: 30,
      featured: 0,
    },
    {
      name: "Performance Running Shoes",
      description:
        "Lightweight running shoes with responsive cushioning and breathable mesh construction.",
      price: 109.99,
      category: "Fashion",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      inventory: 16,
      featured: 1,
    },
    {
      name: "Essential Cotton Hoodie",
      description:
        "A soft heavyweight cotton hoodie with a relaxed fit for comfortable everyday wear.",
      price: 64.99,
      category: "Fashion",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
      inventory: 22,
      featured: 0,
    },
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (
      name,
      description,
      price,
      category,
      image,
      inventory,
      featured
    )
    VALUES (
      @name,
      @description,
      @price,
      @category,
      @image,
      @inventory,
      @featured
    )
  `);

  const insertAllProducts = db.transaction((items) => {
    for (const product of items) {
      insertProduct.run(product);
    }
  });

  insertAllProducts(products);

  console.log("Starter products added to the database.");
} else {
  console.log("Products already exist. No new seed data was added.");
}

console.log("Database setup completed.");
