import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  MapPin,
  X,
} from "lucide-react";

const initialForm = {
  customerName: "",
  customerEmail: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onSubmitOrder,
  completedOrder,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 75 ? 0 : 8.99;
  const tax = subtotal * 0.0725;
  const total = subtotal + shipping + tax;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      await onSubmitOrder({
        ...formData,
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      });

      setFormData(initialForm);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="checkout-modal-backdrop">
      <section
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
      >
        <button
          className="checkout-close-button"
          onClick={onClose}
          aria-label="Close checkout"
        >
          <X size={22} />
        </button>

        {completedOrder ? (
          <div className="order-success">
            <div className="order-success-icon">
              <CheckCircle2 size={42} />
            </div>

            <p className="checkout-eyebrow">ORDER CONFIRMED</p>

            <h2>Thank you for your order.</h2>

            <p>
              Your order has been placed and is now being processed.
            </p>

            <div className="confirmation-card">
              <div>
                <span>Order number</span>
                <strong>#{completedOrder.id}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{completedOrder.status}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{completedOrder.customerEmail}</strong>
              </div>

              <div>
                <span>Total</span>
                <strong>${completedOrder.total.toFixed(2)}</strong>
              </div>
            </div>

            <button
              className="checkout-primary-button"
              onClick={onClose}
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <p className="checkout-eyebrow">SECURE CHECKOUT</p>
              <h2>Complete your order</h2>

              <div className="checkout-section-title">
                <CreditCard size={19} />
                <span>Contact information</span>
              </div>

              <div className="checkout-field">
                <label htmlFor="customerName">Full name</label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Matthew Plants"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="customerEmail">Email address</label>
                <input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="checkout-section-title checkout-address-title">
                <MapPin size={19} />
                <span>Shipping address</span>
              </div>

              <div className="checkout-field">
                <label htmlFor="address">Street address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Eureka"
                  required
                />
              </div>

              <div className="checkout-form-row">
                <div className="checkout-field">
                  <label htmlFor="state">State</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="CA"
                    maxLength="2"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="zipCode">ZIP code</label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="95501"
                    required
                  />
                </div>
              </div>

              <div className="demo-payment-notice">
                <strong>Portfolio demo checkout</strong>
                <p>
                  No real payment is collected. This order is saved locally
                  in the LumaCart SQLite database.
                </p>
              </div>

              {formError && (
                <p className="checkout-error-message">{formError}</p>
              )}

              <button
                className="checkout-primary-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="checkout-spinner" size={18} />
                    Placing order...
                  </>
                ) : (
                  `Place order — $${total.toFixed(2)}`
                )}
              </button>
            </form>

            <aside className="checkout-summary">
              <h3>Order summary</h3>

              <div className="checkout-items">
                {cartItems.map((item) => (
                  <div className="checkout-item" key={item.id}>
                    <div className="checkout-item-image">
                      <img src={item.image} alt={item.name} />
                      <span>{item.quantity}</span>
                    </div>

                    <div>
                      <strong>{item.name}</strong>
                      <p>${item.price.toFixed(2)} each</p>
                    </div>

                    <strong>
                      ${(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="checkout-totals">
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

                <div className="checkout-total-row">
                  <span>Total</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

export default CheckoutModal;
