import ProductCard from "./ProductCard";

function ProductGrid({
  products,
  loading,
  error,
  onAddToCart,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
}) {
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  if (loading) {
    return (
      <section className="products-section">
        <div className="loading-state">Loading products...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section">
        <div className="error-state">
          <h2>We could not load the products.</h2>
          <p>{error}</p>
          <p>Make sure the backend server is running on port 5050.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section" id="products">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE COLLECTION</p>
          <h2>Shop all products</h2>
        </div>

        <p>
          {products.length} carefully selected products for modern everyday
          living.
        </p>
      </div>

      <div className="product-toolbar">
        <input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "All" ? "All categories" : category}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
        >
          <option value="featured">Featured first</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try changing your search or category selection.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
