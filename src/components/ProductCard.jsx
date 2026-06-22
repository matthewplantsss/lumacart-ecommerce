import { Heart, ShoppingBag } from "lucide-react";

function ProductCard({ product, onAddToCart }) {
  const isLowStock = product.inventory > 0 && product.inventory <= 5;

  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
        />

        {product.featured === 1 && (
          <span className="product-badge">Featured</span>
        )}

        <button className="favorite-button" aria-label={`Save ${product.name}`}>
          <Heart size={19} />
        </button>
      </div>

      <div className="product-card-content">
        <p className="product-category">{product.category}</p>

        <h3>{product.name}</h3>

        <p className="product-description">{product.description}</p>

        <div className="product-meta">
          <div>
            <strong>${product.price.toFixed(2)}</strong>

            <span
              className={
                isLowStock ? "stock-text low-stock" : "stock-text"
              }
            >
              {product.inventory > 0
                ? `${product.inventory} in stock`
                : "Out of stock"}
            </span>
          </div>

          <button
            className="add-cart-button"
            onClick={() => onAddToCart(product)}
            disabled={product.inventory === 0}
          >
            <ShoppingBag size={18} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
