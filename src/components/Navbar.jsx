import {
  Search,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";

function Navbar({
  cartCount = 0,
  onOpenCart,
  onOpenAdmin,
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a className="brand" href="/">
          <span className="brand-mark">L</span>
          <span>LumaCart</span>
        </a>

        <nav className="nav-links">
          <a href="#products">Shop</a>
          <a href="#featured">Featured</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          <button className="icon-button" aria-label="Search">
            <Search size={20} />
          </button>

          <button
            className="icon-button"
            aria-label="Open admin dashboard"
            onClick={onOpenAdmin}
          >
            <Settings size={20} />
          </button>

          <button className="icon-button" aria-label="Account">
            <User size={20} />
          </button>

          <button
            className="cart-button"
            aria-label="Open shopping cart"
            onClick={onOpenCart}
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
