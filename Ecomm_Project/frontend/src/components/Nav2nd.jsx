import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "./ToastNotification";
import { useCart } from "./CartContext";
import OrdersPopup from "./OrdersPopup";
import ProfilePopup from "./ProfilePopup";
import API_URL from "../config";

export default function Nav2nd() {
  const [showOrders, setShowOrders] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const {
    cartItems,
    removeFromCart,
    getCartTotal,
    clearCart,
    showCart,
    openCart,
    closeCart,
  } = useCart();

  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const categories = [
    "Electronics",
    "Mobiles",
    "Audio",
    "Laptops",
    "Gaming",
    "Accessories",
  ];

  const handleCategoryClick = (category) => {
    setShowDropdown(false);
    setShowMenu(false);
    navigate(`/search?keyword=${category}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);

    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) setUser(JSON.parse(userInfo));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    setShowProfile(false);
    showSuccess("Logged Out Successfully!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setShowMenu(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${keyword}`);
      setShowMenu(false); // Close menu on mobile search
    } else {
      navigate("/");
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please Login to Place Order");
      return;
    }
    if (cartItems.length === 0) {
      showError("Cart is Empty!");
      return;
    }

    try {
      const formattedOrderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image || item.img,
        price: item.price,
        qty: 1,
      }));

      const totalPrice = getCartTotal();

      const orderPayload = {
        orderItems: formattedOrderItems,
        shippingAddress: {
          address: "Test Address",
          city: "Lahore",
          postalCode: "54000",
          country: "Pakistan",
        },
        paymentMethod: "Cash on Delivery",
        itemsPrice: totalPrice,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: totalPrice,
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess("Order Placed Successfully! 🎉");
        clearCart();
        closeCart();
      } else {
        showError(data.message || "Order Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      showError("Server Error! Check Console.");
    }
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
        rel="stylesheet"
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;900&display=swap");
        :root { --header-height: 4rem; --black-color: #000; --white-color: #fff; --accent-color: #ff8c00; --body-font: "Montserrat", sans-serif; --dark-grey: #1a1a1a; }
        .header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; transition: all 0.5s ease; }
        .header.scrolled { top: 1rem; padding-inline: 1.5rem; }
        .nav { height: var(--header-height); background-color: var(--black-color); display: flex; justify-content: space-between; align-items: center; transition: all 0.4s ease; padding: 0 1.5rem; }
        .header.scrolled .nav { background-color:rgba(0,0,0,0.75);backdrop-filter:blur(15px);max-width: 1120px; margin: 0 auto; border-radius: 4rem; box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
        .nav__brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav__logo-circle { width: 40px; height: 40px; background: white; display: grid; place-items: center; border-radius: 50%; }
        .navbar-brand-text { color: var(--accent-color); font-size: 1.5rem; font-weight: 700; font-family: 'fantasy', sans-serif; }
        .nav__list { display: flex; flex-direction: column; align-items: center; row-gap: 1.5rem; list-style: none; margin: 0; padding: 0; }
        .nav__link { color: var(--white-color); font-weight: 600; text-decoration: none; cursor: pointer; transition: 0.3s; }
        .nav__link:hover { color: var(--accent-color); }
        
        /* DESKTOP SEARCH BAR (Original) */
        .search-bar-container {
          flex: 1; max-width: 350px; 
          display: none; /* Hidden on Mobile */
          align-items: center; justify-content: flex-end; margin-right: 20px;
        }
        
        /* NEW: MOBILE SEARCH BAR STYLE */
        .mobile-search {
            display: none; /* Hidden on Desktop */
            width: 90%;
            margin: 0 auto 1.5rem auto;
        }

        .search-form {
          width: 100%; display: flex; align-items: center;
          background: #1a1a1a; border: 1px solid #333; border-radius: 50px;
          padding: 5px 15px; height: 40px; transition: 0.3s;
        }
        .search-form:focus-within { border-color: var(--accent-color); box-shadow: 0 0 10px rgba(255, 140, 0, 0.1); }
        .search-input { background: transparent; border: none; outline: none; color: white; width: 100%; font-size: 0.9rem; font-family: var(--body-font); }
        .search-btn { background: transparent; border: none; color: #777; cursor: pointer; font-size: 1.1rem; display: grid; place-items: center; }
        .search-btn:hover { color: var(--accent-color); }

        .nav__cart-icon { position: relative; color: white; font-size: 1.5rem; cursor: pointer; margin-right: 1rem; transition: 0.3s; }
        .nav__cart-icon:hover { color: var(--accent-color); transform: scale(1.1); }
        .cart-badge { position: absolute; top: -5px; right: -8px; background-color: var(--accent-color); color: white; font-size: 0.7rem; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; border: 2px solid var(--black-color); }
        .dropdown__menu { list-style: none; padding: 0; margin-top: 1rem; display: none; flex-direction: column; gap: 10px; background: #222; padding: 1rem; border-radius: 1rem; width: 200px; text-align: center; border: 1px solid #333; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        .dropdown__active { display: flex; }
        .dropdown__item { color: #fff; font-size: 0.9rem; text-decoration: none; transition: 0.3s; display: block; padding: 5px; cursor: pointer; }
        .dropdown__item:hover { color: var(--accent-color); background: rgba(255,255,255,0.1); border-radius: 5px; }
        .nav__toggle { display: none; background: var(--accent-color); border: none; padding: 10px; border-radius: 8px; cursor: pointer; z-index: 1100; }
        .hamburger { display: flex; flex-direction: column; gap: 5px; }
        .line { display: block; width: 25px; height: 3px; background: white; border-radius: 2px; transition: 0.4s; }
        .user-container { position: relative; margin-right: 15px; }
        .user-avatar { width: 35px; height: 35px; background: var(--accent-color); color: white; font-weight: bold; border-radius: 50%; display: grid; place-items: center; cursor: pointer; border: 2px solid white; transition: 0.3s; }
        .user-avatar:hover { transform: scale(1.1); box-shadow: 0 0 10px var(--accent-color); }
        .login-btn { color: white; text-decoration: none; border: 1px solid var(--accent-color); padding: 5px 15px; border-radius: 20px; transition: 0.3s; margin-right: 15px; }
        .login-btn:hover { background: var(--accent-color); }

        /* --- MEDIA QUERIES --- */
        @media screen and (max-width: 1000px) {
          .nav__menu { position: fixed; top: -100%; left: 0; right: 0; background: var(--black-color); margin-inline: 1rem; padding-block: 3rem; border-radius: 2rem; transition: 0.4s; opacity: 0; pointer-events: none; }
          .show-menu { top: 5.5rem; opacity: 1; pointer-events: initial; }
          .nav__toggle { display: flex; }
          .search-bar-container { display: none; } /* Ensure desktop search is hidden */
          .mobile-search { display: block; } /* Show mobile search */
        }
        @media screen and (min-width: 1000px) {
          .nav__list { flex-direction: row; column-gap: 2.5rem; }
          .dropdown__menu { position: absolute; top: 2rem; }
          .nav__menu { display: flex; }
          .search-bar-container { display: flex; } /* Show desktop search */
          .mobile-search { display: none; } /* Hide mobile search */
        }

        .cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2000; opacity: 0; visibility: hidden; transition: 0.3s; }
        .cart-overlay.open { opacity: 1; visibility: visible; }
        .cart-sidebar { position: fixed; top: 0; right: 0; width: 100%; max-width: 400px; height: 100vh; background: #1a1a1a; color: white; z-index: 2001; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1); padding: 2rem; display: flex; flex-direction: column; box-shadow: -5px 0 15px rgba(0,0,0,0.5); border-left: 5px solid var(--accent-color); }
        .cart-sidebar.open { transform: translateX(0); }
        .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #333; padding-bottom: 1rem; }
        .cart-title { font-size: 1.5rem; font-weight: 800; font-family: 'Montserrat', sans-serif; text-transform: uppercase; letter-spacing: 1px; }
        .cart-close { font-size: 2rem; cursor: pointer; color: #666; transition: 0.3s; }
        .cart-close:hover { color: var(--accent-color); transform: rotate(90deg); }
        .cart-items-container { flex: 1; overflow-y: auto; }
        .cart-item { display: flex; align-items: center; gap: 15px; margin-bottom: 1.5rem; border-bottom: 1px solid #333; padding-bottom: 15px; }
        .cart-img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; background: #fff; }
        .item-info h4 { font-size: 0.9rem; margin-bottom: 5px; }
        .item-info span { color: var(--accent-color); font-weight: 700; }
        .cart-footer { margin-top: auto; border-top: 1px solid #333; padding-top: 1.5rem; }
        .total-row { display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; }
        .checkout-btn { width: 100%; padding: 1rem; background: var(--accent-color); color: white; border: none; font-weight: 700; border-radius: 50px; cursor: pointer; font-size: 1rem; transition: 0.3s; }
        .checkout-btn:hover { background: #fff; color: var(--black-color); }
      `,
        }}
      />

      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <nav className="nav">
          <a href="/" className="nav__brand">
            <div className="nav__logo-circle">
              <i
                className="fa-solid fa-bag-shopping"
                style={{ color: "orange", fontSize: "20px" }}
              ></i>
            </div>
            <span className="navbar-brand-text">E-Store</span>
          </a>

          <div className={`nav__menu ${showMenu ? "show-menu" : ""}`}>
            {/* --- NEW: MOBILE SEARCH BAR (Inside Menu) --- */}
            <div className="mobile-search">
              <form onSubmit={submitHandler} className="search-form">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <i className="ri-search-line"></i>
                </button>
              </form>
            </div>

            <ul className="nav__list">
              <li>
                <Link
                  to="/"
                  className="nav__link"
                  onClick={() => setShowMenu(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#products-section"
                  className="nav__link"
                  onClick={(e) => scrollToSection(e, "products-section")}
                >
                  Products
                </a>
              </li>
              <li style={{ position: "relative" }}>
                <div
                  className="nav__link d-flex align-items-center gap-2"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Categories{" "}
                  <i
                    className={`ri-arrow-${
                      showDropdown ? "up" : "down"
                    }-s-line`}
                  ></i>
                </div>

                <ul
                  className={`dropdown__menu ${
                    showDropdown ? "dropdown__active" : ""
                  }`}
                >
                  {categories.map((cat) => (
                    <li key={cat}>
                      <span
                        className="dropdown__item"
                        onClick={() => handleCategoryClick(cat)}
                      >
                        {cat}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          {/* --- DESKTOP SEARCH BAR (Outside Menu) --- */}
          <div className="search-bar-container">
            <form onSubmit={submitHandler} className="search-form">
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <i className="ri-search-line"></i>
              </button>
            </form>
          </div>

          <div className="d-flex align-items-center">
            <div className="nav__cart-icon" onClick={openCart}>
              <i className="ri-shopping-cart-2-line"></i>
              <span className="cart-badge">{cartItems.length}</span>
            </div>

            {user ? (
              <div className="user-container">
                <div
                  className="user-avatar"
                  onClick={() => setShowProfile(true)}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                Login
              </Link>
            )}

            <button
              className={`nav__toggle ${showMenu ? "show-icon" : ""}`}
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className="hamburger">
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* --- CART SIDEBAR --- */}
      <div
        className={`cart-overlay ${showCart ? "open" : ""}`}
        onClick={closeCart}
      ></div>
      <div className={`cart-sidebar ${showCart ? "open" : ""}`}>
        <div className="cart-header">
          <span className="cart-title">Your Cart ({cartItems.length})</span>
          <i className="ri-close-line cart-close" onClick={closeCart}></i>
        </div>

        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <p
              style={{ textAlign: "center", marginTop: "50px", color: "#777" }}
            >
              Cart is Empty
            </p>
          ) : (
            cartItems.map((item, index) => (
              <div className="cart-item" key={item._id || index}>
                <img
                  src={
                    item.image || item.img || "https://via.placeholder.com/100"
                  }
                  alt={item.name}
                  className="cart-img"
                />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <span>${item.price}</span>
                </div>
                <i
                  className="ri-delete-bin-line"
                  style={{
                    marginLeft: "auto",
                    cursor: "pointer",
                    color: "#ff4d4d",
                  }}
                  onClick={() => removeFromCart(item._id)}
                ></i>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="total-row">
            <span>Subtotal:</span>
            <span style={{ color: "var(--accent-color)" }}>
              ${getCartTotal()}
            </span>
          </div>
          <button
            className="checkout-btn"
            onClick={handleCheckout}
            style={{
              opacity: cartItems.length === 0 ? 0.5 : 1,
              cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* --- ORDERS POPUP --- */}
      {showOrders && <OrdersPopup onClose={() => setShowOrders(false)} />}

      {/* --- NEW PROFILE POPUP --- */}
      {showProfile && (
        <ProfilePopup
          user={user}
          onClose={() => setShowProfile(false)}
          onLogout={handleLogout}
          onMyOrders={() => {
            setShowProfile(false);
            setShowOrders(true);
          }}
        />
      )}
    </>
  );
}
