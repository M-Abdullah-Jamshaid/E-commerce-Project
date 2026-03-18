import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { showSuccess } from "./ToastNotification";

import { motion } from "framer-motion";

import API_URL from "../config";

const fallbackProducts = [
  {
    _id: 1,
    name: "Neural Pro Headphones",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400",
    description: "Experience world-class noise cancellation and spatial audio.",
  },
  {
    _id: 2,
    name: "Monitor Ultra 4K",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400",
    description: "A stunning 4K display designed for professional creators.",
  },
  {
    _id: 3,
    name: "Cyber Keyboard",
    price: 159,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400",
    description: "Tactile mechanical switches with customizable RGB lighting.",
  },
  {
    _id: 4,
    name: "Pro Studio Mic",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400",
    description: "Broadcast-quality condenser microphone for streaming.",
  },
  {
    _id: 5,
    name: "Smart Watch Elite",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400",
    description: "Next-gen health monitoring with blood oxygen tracking.",
  },
  {
    _id: 6,
    name: "GPU Graphics 4090",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400",
    description: "The ultimate GPU for 4K gaming and AI development.",
  },
];

export default function Products() {
  const { addToCart, openCart } = useCart();

  const [activeProduct, setActiveProduct] = useState(null);
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        if (response.ok) {
          if (data.products && Array.isArray(data.products))
            setProducts(data.products);
          else if (Array.isArray(data)) setProducts(data);
        }
      } catch (err) {
        console.error("Using Fallback Data");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    showSuccess(`${product.name} Added to Cart! 🛒`);
    setActiveProduct(null);
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    setActiveProduct(null);
    openCart();
  };

  const handleImageError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400";
  };

  // --- FASTER ANIMATION SETTINGS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Pehle 0.1 tha, ab aadha waqt lagega
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 }, // Distance kam kiya (50 se 30) taake jaldi pohanch jaye
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.2, // Bounce kam kiya taake foran settle ho jaye
        duration: 0.4, // Pehle 0.8 tha, ab 2x tez hai
      },
    },
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "grid",
          placeItems: "center",
          background: "#f4f4f4",
        }}
      >
        <div className="loader"></div>
        <style>{`.loader { border: 8px solid #f3f3f3; border-top: 8px solid #ff8c00; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root { --orange-accent: #ff8c00; --dark-black: #111; }
        .products-section { padding-block: 8rem 5rem; max-width: 1200px; margin: 0 auto; padding-inline: 1.5rem; min-height: 100vh; }
        .section-title { text-align: center; font-size: clamp(2rem, 5vw, 3rem); color: var(--dark-black); margin-bottom: 4rem; font-family: 'Montserrat', sans-serif; font-weight: 900; text-transform: uppercase; letter-spacing: 5px; position: relative; }
        .section-title::after { content: ''; position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); width: 80px; height: 5px; background-color: var(--orange-accent); }
        
        /* --- MOBILE LAYOUT: 1 Card per Row --- */
        .card__container { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        
        /* --- TABLET: 2 Cards per Row --- */
        @media screen and (min-width: 600px) { .card__container { grid-template-columns: repeat(2, 1fr); } }

        /* --- DESKTOP: 3 Cards per Row --- */
        @media screen and (min-width: 1024px) { .card__container { grid-template-columns: repeat(3, 1fr); } }
        
        /* --- CARD STYLE (Fixed Overlap) --- */
        .card__product { 
            background-color: white; 
            border: 2px solid var(--dark-black); 
            border-bottom: 6px solid var(--orange-accent); 
            padding: 2rem 1.5rem; 
            text-align: center; 
            cursor: pointer; 
            transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
            border-radius: 15px; 
            display: flex; 
            flex-direction: column; 
            height: 100%; 
            gap: 15px; /* Added GAP to prevent overlap */
        }
        
        .card__product:hover { border-color: var(--orange-accent); transform: translateY(-10px); }
        
        /* --- CARD IMAGE --- */
        .card__img { 
            width: 100%; 
            height: 220px; /* Thoda bara kiya */
            object-fit: cover; 
            border-radius: 10px; 
            /* Margin hata diya kyunke ab GAP use ho raha hai */
        }
        
        .card__name { font-size: 1.3rem; font-weight: 700; color: var(--dark-black); margin-bottom: 0; line-height: 1.4; }
        .card__description { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 0.9rem; color: #666; flex-grow: 1; line-height: 1.6; }
        .card__price { font-size: 1.4rem; font-weight: 800; color: var(--orange-accent); margin-top: auto; }
        
        /* MODAL STYLES */
        .modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.85); backdrop-filter: blur(15px); display: grid; place-items: center; padding: 1.5rem; opacity: 0; visibility: hidden; z-index: 2000; transition: .4s; }
        .active-modal { opacity: 1; visibility: visible; }
        .modal__card { position: relative; background-color: white; padding: 4rem 2rem 2.5rem; max-width: 500px; width: 100%; border-radius: 25px; text-align: center; border: 4px solid var(--orange-accent); transform: translateY(20px); transition: 0.4s; }
        .active-modal .modal__card { transform: translateY(0); }
        .modal__close { position: absolute; top: 1.25rem; right: 1.5rem; color: var(--dark-black); font-size: 2.2rem; line-height: 1; cursor: pointer; z-index: 10; transition: 0.3s; }
        .modal__close:hover { color: var(--orange-accent); transform: rotate(90deg); }
        .modal__img { width: 100%; height: 250px; object-fit: cover; border-radius: 15px; margin-bottom: 1.5rem; }
        .modal__footer-btns { display: flex; gap: 10px; margin-top: 1.5rem; }
        .btn-cart { flex: 1; background: transparent; border: 2px solid var(--dark-black); padding: 1rem; border-radius: 50px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .btn-buy { flex: 1; background: var(--orange-accent); color: white; border: none; padding: 1rem; border-radius: 50px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .btn-cart:hover { background: var(--dark-black); color: white; }
        .btn-buy:hover { background: #e67e00; }
      `,
        }}
      />

      <section className="products-section" id="products-section">
        <h2 className="section-title">Select Your Product</h2>

        <motion.div
          className="card__container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // Isay 0.1 hi rehne dein, taake halka sa scroll hote hi dikh jaye
        >
          {Array.isArray(products) &&
            products.map((product) => (
              <motion.article
                key={product._id || product.id}
                variants={cardVariants}
              >
                <div
                  className="card__product"
                  onClick={() => setActiveProduct(product)}
                >
                  <img
                    src={product.image || product.img}
                    alt={product.name}
                    className="card__img"
                    onError={handleImageError}
                  />
                  <h3 className="card__name">{product.name}</h3>
                  <p className="card__description">{product.description}</p>
                  <span className="card__price">${product.price}</span>
                </div>
              </motion.article>
            ))}
        </motion.div>

        <div
          className={`modal-overlay ${activeProduct ? "active-modal" : ""}`}
          onClick={() => setActiveProduct(null)}
        >
          {activeProduct && (
            <div className="modal__card" onClick={(e) => e.stopPropagation()}>
              <span
                className="modal__close"
                onClick={() => setActiveProduct(null)}
              >
                &times;
              </span>
              <img
                src={activeProduct.image || activeProduct.img}
                alt={activeProduct.name}
                className="modal__img"
                onError={handleImageError}
              />
              <h3
                className="modal__name"
                style={{
                  fontWeight: "800",
                  fontSize: "1.5rem",
                  marginBottom: "10px",
                }}
              >
                {activeProduct.name}
              </h3>
              <p
                className="text-muted mb-4"
                style={{
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  color: "#555",
                }}
              >
                {activeProduct.description}
              </p>
              <h2 style={{ color: "var(--orange-accent)", fontWeight: "900" }}>
                ${activeProduct.price}
              </h2>

              <div className="modal__footer-btns">
                <button
                  className="btn-cart"
                  onClick={() => handleAddToCart(activeProduct)}
                >
                  Add to Cart
                </button>
                <button
                  className="btn-buy"
                  onClick={() => handleBuyNow(activeProduct)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
