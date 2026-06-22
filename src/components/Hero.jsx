import { ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">DESIGNED FOR MODERN LIVING</p>

        <h1>
          Everyday products.
          <span> Thoughtfully selected.</span>
        </h1>

        <p className="hero-description">
          Discover modern essentials for work, home, travel, and everyday life.
          Carefully curated for quality, function, and timeless style.
        </p>

        <a className="primary-button" href="#products">
          Shop the collection
          <ArrowRight size={18} />
        </a>

        <div className="hero-benefits">
          <div>
            <Truck size={19} />
            <span>Free shipping over $75</span>
          </div>

          <div>
            <RotateCcw size={19} />
            <span>30-day returns</span>
          </div>

          <div>
            <ShieldCheck size={19} />
            <span>Secure checkout</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-card hero-card-main">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85"
            alt="Minimalist smartwatch"
          />
        </div>

        <div className="floating-label">
          <span>Featured product</span>
          <strong>Minimalist Smartwatch</strong>
        </div>
      </div>
    </section>
  );
}

export default Hero;
