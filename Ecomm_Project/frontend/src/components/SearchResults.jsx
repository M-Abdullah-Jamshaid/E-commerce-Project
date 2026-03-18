import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import API_URL from "../config";
import { useCart } from "./CartContext"; // Import Cart Context
import { showSuccess } from "./ToastNotification"; // Import Toast

export default function SearchResults() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState(null); // State for Modal

  const { addToCart, openCart } = useCart(); // Cart Functions

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products?keyword=${keyword}`);
        const data = await res.json();

        const results = data.products || data;

        if (Array.isArray(results)) {
          setProducts(results);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchSearchResults();
    }
  }, [keyword]);

  // --- Cart & Buy Handlers ---
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

  return (
    // --- LIGHT THEME CONTAINER ---
    <div
      style={{
        paddingTop: "100px",
        paddingBottom: "50px",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9", // Light Background
        color: "#333", // Dark Text
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "800",
              color: "#222",
            }}
          >
            Results for: <span style={{ color: "#ff8c00" }}>"{keyword}"</span>
          </h2>
          <Link
            to="/"
            style={{
              color: "#555",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            &larr; Back to Home
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <h3 style={{ textAlign: "center", color: "#777" }}>
            Searching Inventory...
          </h3>
        ) : (
          <>
            {/* Empty State */}
            {products.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: "80px" }}>
                <i
                  className="ri-emotion-unhappy-line"
                  style={{ fontSize: "4rem", color: "#ccc" }}
                ></i>
                <p
                  style={{
                    color: "#666",
                    marginTop: "10px",
                    fontSize: "1.2rem",
                  }}
                >
                  No products found matching "{keyword}".
                </p>
                <Link
                  to="/"
                  style={{
                    color: "#ff8c00",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Browse all products
                </Link>
              </div>
            ) : (
              /* Product Grid */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "25px",
                }}
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => setActiveProduct(product)} // Open Modal on Click
                    style={{
                      background: "white", // White Card
                      borderRadius: "15px",
                      overflow: "hidden",
                      border: "1px solid #eee", // Light Border
                      boxShadow: "0 5px 15px rgba(0,0,0,0.05)", // Soft Shadow
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-5px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <img
                      src={product.image || product.img}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        backgroundColor: "#f4f4f4",
                      }}
                    />
                    <div style={{ padding: "20px" }}>
                      <h4
                        style={{
                          fontSize: "1.1rem",
                          marginBottom: "10px",
                          fontWeight: "700",
                          color: "#000",
                        }}
                      >
                        {product.name}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          marginBottom: "15px",
                          height: "40px",
                          overflow: "hidden",
                        }}
                      >
                        {product.description
                          ? product.description.substring(0, 50) + "..."
                          : "No description"}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "#ff8c00",
                            fontWeight: "900",
                            fontSize: "1.2rem",
                          }}
                        >
                          ${product.price}
                        </span>
                        <button
                          style={{
                            background: "#ff8c00",
                            color: "white",
                            border: "none",
                            padding: "8px 20px",
                            borderRadius: "25px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            boxShadow: "0 4px 10px rgba(255, 140, 0, 0.3)",
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* --- PRODUCT MODAL (Added Logic) --- */}
      {activeProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(5px)",
            display: "grid",
            placeItems: "center",
            zIndex: 2000,
          }}
          onClick={() => setActiveProduct(null)}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              maxWidth: "500px",
              width: "90%",
              borderRadius: "20px",
              textAlign: "center",
              border: "4px solid #ff8c00",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "20px",
                fontSize: "2rem",
                cursor: "pointer",
                color: "#333",
              }}
              onClick={() => setActiveProduct(null)}
            >
              &times;
            </span>
            <img
              src={activeProduct.image || activeProduct.img}
              alt={activeProduct.name}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />
            <h2 style={{ color: "#222", marginBottom: "10px" }}>
              {activeProduct.name}
            </h2>
            <p style={{ color: "#666", marginBottom: "15px" }}>
              {activeProduct.description}
            </p>
            <h3
              style={{
                color: "#ff8c00",
                fontSize: "1.5rem",
                fontWeight: "900",
                marginBottom: "20px",
              }}
            >
              ${activeProduct.price}
            </h3>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleAddToCart(activeProduct)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "50px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  background: "transparent",
                  border: "2px solid #222",
                  color: "#222",
                  transition: "0.3s",
                }}
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow(activeProduct)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "50px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  background: "#ff8c00",
                  border: "none",
                  color: "white",
                  transition: "0.3s",
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
