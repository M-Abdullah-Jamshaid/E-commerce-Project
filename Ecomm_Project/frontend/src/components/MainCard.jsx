import React, { useRef } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import API_URL from "../config";

// Context Import
import { useCart } from "./CartContext";

export default function MainCard() {
  const sliderRef = useRef(null);

  // Context se functions
  const { addToCart, openCart } = useCart();

  // --- BUY NOW LOGIC ---
  const handleBuyNow = (product) => {
    addToCart(product);
    openCart();
  };

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: false,
    dots: true,
    arrows: false,
  };

  // --- STATIC DATA WITH REAL IDs ---
  // ⚠️ IMPORTANT: "Your_MongoDB_Product_ID_Here" ko hata kar apni asli Product ID likhein
  // Jo aapke Products page par console mein aa rahi thi.
  const data = [
    {
      _id: "65d8a123b456c789d012e345", // <--- YAHAN ASLI ID DALEIN (Product 1)
      name: "Neural Pro Headphones",
      price: 299.99,
      category: "Audio",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500",
      description: "Adaptive noise canceling with spatial audio support.",
    },
    {
      _id: "65d8a123b456c789d012e346", // <--- YAHAN ASLI ID DALEIN (Product 2)
      name: "E-Hub Smart Watch",
      price: 199.5,
      category: "Wearables",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500",
      description: "Track your vitals with medical-grade precision sensors.",
    },
    {
      _id: "65d8a123b456c789d012e347", // <--- YAHAN ASLI ID DALEIN (Product 3)
      name: "Cyber Mechanical Keyboard",
      price: 150.0,
      category: "Peripherals",
      image:
        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=500",
      description: "Ultra-low latency with customizable RGB backlighting.",
    },
    {
      _id: "65d8a123b456c789d012e348", // <--- YAHAN ASLI ID DALEIN (Product 4)
      name: "Neural Link Tablet",
      price: 899.0,
      category: "Mobiles",
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=500",
      description: "The ultimate canvas for digital artists and developers.",
    },
  ];

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .responsive-img { height: 40vh !important; margin-bottom: 1px; }
          .main-slider-wrapper { padding: 40px 0; }
        }
      `}</style>

      <div
        className="main-slider-wrapper"
        style={{ overflow: "hidden", marginBottom: "" }}
      >
        <Slider ref={sliderRef} {...settings}>
          {data.map((item) => (
            <div key={item._id}>
              <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center px-4 px-md-5">
                <div className="row w-100 align-items-center py-5 py-md-0">
                  <div className="col-12 col-md-6 d-flex justify-content-center order-1">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => sliderRef.current.slickPause()}
                      onMouseLeave={() => sliderRef.current.slickPlay()}
                      className="responsive-img"
                      style={{
                        height: "70vh",
                        width: "100%",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  <div className="col-12 col-md-6 d-flex flex-column justify-content-center text-center text-md-start ps-md-5 order-2">
                    <h3
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "clamp(32px, 10vw, 80px)",
                        lineHeight: "1.1",
                      }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-muted fw-bold mb-2">{item.category}</p>
                    <p
                      className="lead mb-3"
                      style={{ fontSize: "clamp(14px, 4vw, 18px)" }}
                    >
                      {item.description}
                    </p>
                    <h4 className="fw-bold mb-4">${item.price}</h4>

                    <div className="d-flex justify-content-center justify-content-md-start">
                      <motion.button
                        onClick={() => handleBuyNow(item)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onMouseEnter={() => sliderRef.current.slickPause()}
                        onMouseLeave={() => sliderRef.current.slickPlay()}
                        style={{
                          backgroundColor: "orange",
                          border: "none",
                          width: "fit-content",
                        }}
                        className="btn text-white px-5 py-3 rounded-pill shadow"
                      >
                        Shop Now
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}
