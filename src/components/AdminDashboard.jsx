import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  DollarSign,
  LoaderCircle,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  X,
} from "lucide-react";
import {
  getOrders,
  getProducts,
  updateOrderStatus,
} from "../services/api";

const statuses = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminDashboard({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [ordersData, productsData] = await Promise.all([
        getOrders(),
        getProducts(),
      ]);

      setOrders(ordersData);
      setProducts(productsData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadDashboard();
    }
  }, [isOpen]);

  async function handleStatusChange(orderId, status) {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const response = await updateOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? response.order : order
        )
      );
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingOrderId(null);
    }
  }

  const metrics = useMemo(() => {
    const revenue = orders
      .filter((order) => order.status !== "Cancelled")
      .reduce((total, order) => total + Number(order.total), 0);

    const inventory = products.reduce(
      (total, product) => total + product.inventory,
      0
    );

    const delivered = orders.filter(
      (order) => order.status === "Delivered"
    ).length;

    return {
      revenue,
      inventory,
      delivered,
      orders: orders.length,
    };
  }, [orders, products]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="admin-backdrop">
      <section className="admin-dashboard">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">LUMACART MANAGEMENT</p>
            <h2>Admin dashboard</h2>
          </div>

          <div className="admin-header-actions">
            <button
              className="admin-refresh-button"
              onClick={loadDashboard}
              disabled={loading}
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              className="admin-close-button"
              onClick={onClose}
              aria-label="Close admin dashboard"
            >
              <X size={22} />
            </button>
          </div>
        </header>

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-loading">
            <LoaderCircle size={30} />
            <span>Loading dashboard...</span>
          </div>
        ) : (
          <div className="admin-content">
            <div className="admin-metrics">
              <article>
                <div className="admin-metric-icon">
                  <ReceiptText size={22} />
                </div>

                <div>
                  <span>Total orders</span>
                  <strong>{metrics.orders}</strong>
                </div>
              </article>

              <article>
                <div className="admin-metric-icon">
                  <DollarSign size={22} />
                </div>

                <div>
                  <span>Total revenue</span>
                  <strong>${metrics.revenue.toFixed(2)}</strong>
                </div>
              </article>

              <article>
                <div className="admin-metric-icon">
                  <Boxes size={22} />
                </div>

                <div>
                  <span>Inventory units</span>
                  <strong>{metrics.inventory}</strong>
                </div>
              </article>

              <article>
                <div className="admin-metric-icon">
                  <PackageCheck size={22} />
                </div>

                <div>
                  <span>Delivered orders</span>
                  <strong>{metrics.delivered}</strong>
                </div>
              </article>
            </div>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="admin-eyebrow">RECENT ACTIVITY</p>
                  <h3>Orders</h3>
                </div>

                <span>{orders.length} total</span>
              </div>

              {orders.length === 0 ? (
                <div className="admin-empty">
                  No orders have been placed yet.
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <strong>#{order.id}</strong>
                          </td>

                          <td>
                            <strong>{order.customer_name}</strong>
                            <span>{order.customer_email}</span>
                          </td>

                          <td>
                            {new Date(
                              `${order.created_at.replace(" ", "T")}Z`
                            ).toLocaleString()}
                          </td>

                          <td>
                            <strong>
                              ${Number(order.total).toFixed(2)}
                            </strong>
                          </td>

                          <td>
                            <select
                              className={`admin-status admin-status-${order.status.toLowerCase()}`}
                              value={order.status}
                              disabled={updatingOrderId === order.id}
                              onChange={(event) =>
                                handleStatusChange(
                                  order.id,
                                  event.target.value
                                )
                              }
                            >
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="admin-eyebrow">STOCK MANAGEMENT</p>
                  <h3>Inventory</h3>
                </div>

                <span>{products.length} products</span>
              </div>

              <div className="admin-inventory-grid">
                {products.map((product) => (
                  <article key={product.id}>
                    <img src={product.image} alt={product.name} />

                    <div>
                      <span>{product.category}</span>
                      <strong>{product.name}</strong>
                    </div>

                    <p
                      className={
                        product.inventory <= 5
                          ? "admin-low-inventory"
                          : ""
                      }
                    >
                      {product.inventory} units
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
