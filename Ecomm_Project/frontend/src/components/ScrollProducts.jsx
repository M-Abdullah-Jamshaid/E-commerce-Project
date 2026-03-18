import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext"; 

export default function ScrollProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Get Cart Functions
  // Ensure your CartContext actually exports 'setIsCartOpen'
  const { addToCart, setIsCartOpen } = useCart();

  // --- API FETCHING ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching popup products:", error);
        setProducts([
          { _id: 1, name: "Neural Headphones", price: 299, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400" },
          { _id: 2, name: "Smart Watch Elite", price: 199, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400" },
          { _id: 3, name: "Cyber Keyboard", price: 150, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- BUY HANDLER (FIXED) ---
  const handleBuy = (item) => {
    // 1. Add Item
    addToCart(item);

    // 2. Try to Open Cart
    if (typeof setIsCartOpen === "function") {
        setIsCartOpen(true);
    } else {
        console.warn("⚠️ ERROR: 'setIsCartOpen' is not found in CartContext!");
        console.log("Available functions in Context:", useCart());
    }

    // 3. Close Popup
    setIsOpen(false);
  };

  return (
    <>
      {/* --- FLOATING BUTTON --- */}
      <motion.button
        style={floatingBtnStyle}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <span style={{ fontSize: "28px" }}>🔥</span>
        <span style={badgeStyle}>HOT</span>
      </motion.button>

      {/* --- POPUP MODAL --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={overlayStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              style={modalContentStyle}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div style={headerStyle}>
                <h2>Trending Now</h2>
                <p>Top Picks For You</p>
              </div>

              {/* Scrollable Area */}
              <div style={scrollAreaStyle}>
                {loading ? (
                  <p>Loading...</p>
                ) : Array.isArray(products) && products.length > 0 ? (
                  products.slice(0, 5).map((item, i) => (
                    <Card
                      key={item._id || i}
                      i={i}
                      item={item}
                      onBuy={() => handleBuy(item)}
                    />
                  ))
                ) : (
                  <p>No products available.</p>
                )}
                <div style={{ height: "50px" }}></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- CARD COMPONENT ---
function Card({ item, i, onBuy }) {
  const hueA = (i * 40) % 360;
  const hueB = (i * 40 + 50) % 360;
  const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`;

  return (
    <motion.div
      className={`card-wrapper-${i}`}
      style={cardContainer}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.3, once: false }}
    >
      <div style={{ ...splash, background }} />
      <motion.div style={card} variants={cardVariants} className="product-card">
        <div style={imageContainer}>
          <img
            src={item.image}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        <div style={infoContainer}>
          <h3 style={titleStyle}>{item.name}</h3>
          <span style={priceStyle}>${item.price}</span>
          
          <button 
            onClick={(e) => {
                e.stopPropagation();
                onBuy();
            }} 
            style={btnStyle}
          >
            Buy Now
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * ==============   STYLES   ================
 */

const floatingBtnStyle = {
  position: "fixed", bottom: "30px", left: "30px",
  width: "70px", height: "70px", borderRadius: "50%",
  background: "linear-gradient(135deg, #ff8c00, #ff0080)",
  border: "4px solid white", color: "white", cursor: "pointer",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)", zIndex: 9999,
  display: "flex", justifyContent: "center", alignItems: "center", outline: "none",
};

const badgeStyle = {
  position: "absolute", top: "-5px", right: "-10px",
  background: "#fff", color: "#ff0080", fontSize: "10px", fontWeight: "900",
  padding: "2px 6px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
};

const overlayStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
  zIndex: 10000, display: "flex", justifyContent: "center", alignItems: "center",
};

const modalContentStyle = {
  width: "90%", maxWidth: "450px",
  height: "85vh", 
  background: "#fdfdfd", borderRadius: "30px",
  position: "relative", display: "flex", flexDirection: "column",
  overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
};

const closeBtnStyle = {
  position: "absolute", top: "20px", right: "20px",
  background: "rgba(0,0,0,0.05)", border: "none",
  width: "40px", height: "40px", borderRadius: "50%",
  display: "flex", justifyContent: "center", alignItems: "center",
  cursor: "pointer", zIndex: 10, color: "#333",
};

const scrollAreaStyle = {
  flex: 1, overflowY: "auto", paddingTop: "20px",
  display: "flex", flexDirection: "column", alignItems: "center", width: "100%",
};

const card = {
  width: "320px", 
  height: "500px", 
  display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center",
  borderRadius: "30px", background: "#ffffff",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)", padding: "20px",
  pointerEvents: "auto", cursor: "default",
};

const cardContainer = {
  overflow: "visible", display: "flex", justifyContent: "center", alignItems: "center",
  position: "relative", 
  marginBottom: "30px", 
  width: "100%", pointerEvents: "none",
};

const splash = {
  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
  clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
  transform: "scale(0.9)", opacity: 0.8, zIndex: -1,
};

const imageContainer = { height: "55%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" };
const infoContainer = { height: "40%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around" };

const titleStyle = { fontSize: "1.4rem", margin: 0, fontFamily: "'Montserrat', sans-serif", textAlign: "center", color: "#333" };
const priceStyle = { fontSize: "1.3rem", color: "#ff8c00", fontWeight: "bold" };

const btnStyle = {
  background: "#111", color: "#fff", border: "none",
  padding: "12px 40px", 
  borderRadius: "30px", cursor: "pointer", fontSize: "1rem",
  textTransform: "uppercase", fontWeight: "bold",
  transition: "0.3s", boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
};

const headerStyle = { textAlign: "center", marginTop: "30px", marginBottom: "10px", fontFamily: "'Montserrat', sans-serif" };
headerStyle.h2 = { color: "#ff8c00", textTransform: "uppercase", fontSize: "1.5rem", margin: 0 };

const cardVariants = {
  offscreen: { y: 150, opacity: 0, scale: 0.9 },
  onscreen: { y: 0, opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } },
};
const hue = (h) => `hsl(${h}, 100%, 50%)`;