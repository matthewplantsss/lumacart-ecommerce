import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onCheckout,
}) {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 75 ? 0 : 8.99;
  const tax = subtotal * 0.0725;
  const total = subtotal + shipping + tax;

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "cart-overlay-open" : ""}`}
        onClick={onClose}
      />

      <aside className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""}`}>
        <div className="cart-header">
          <div>
            <p className="cart-eyebrow">YOUR CART</p>
            <h2>Shopping cart</h2>
          </div>

          <button
            className="cart-close-button"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={30} />
            </div>

            <h3>Your cart is empty</h3>
            <p>Add something from the collection to get started.</p>

            <button className="continue-shopping-button" onClick={onClose}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-details">
                    <div className="cart-item-heading">
                      <div>
                        <p>{item.category}</p>
                        <h3>{item.name}</h3>
                      </div>

                      <button
                        className="cart-remove-button"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="quantity-control">
                        <button
                          onClick={() => onDecrease(item.id)}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={15} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() => onIncrease(item.id)}
                          disabled={item.quantity >= item.inventory}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <strong>
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>

              <div>
                <span>Shipping</span>
                <strong>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </strong>
              </div>

              <div>
                <span>Estimated tax</span>
                <strong>${tax.toFixed(2)}</strong>
              </div>

              <div className="cart-total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              {subtotal < 75 && (
                <p className="shipping-message">
                  Add ${(75 - subtotal).toFixed(2)} more for free shipping.
                </p>
              )}

              <button
                className="checkout-button"
                onClick={onCheckout}
              >
                Proceed to checkout
              </button>

              <button className="clear-cart-button" onClick={onClear}>
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
