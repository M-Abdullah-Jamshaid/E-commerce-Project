import React, { useState } from "react";
import API_URL from "../config";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // 1. Mail Function (Mock Subscription)
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true); // Show success message
      setEmail(""); // Clear input
      setTimeout(() => setSubscribed(false), 3000); // Hide message after 3s
    }
  };

  // 2. Smooth Scroll to Top Function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // The magic word for smooth scrolling
    });
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
        :root {
          --orange-accent: #ff8c00;
          --dark-black: #111;
          --light-text: #b3b3b3;
          --white: #fff;
        }
        
        /* GLOBAL SMOOTH SCROLL ENFORCER */
        html { scroll-behavior: smooth !important; }

        .footer {
          background-color: var(--dark-black);
          color: var(--white);
          padding-block: 5rem 2rem;
          font-family: 'Montserrat', sans-serif;
          border-top: 5px solid var(--orange-accent);
          position: relative;
        }

        .footer__container {
          max-width: 1200px;
          margin: 0 auto;
          padding-inline: 1.5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }

        @media screen and (min-width: 1024px) {
          .footer__container {
            grid-template-columns: 1.2fr 0.8fr 0.8fr 1.2fr; /* Optimized columns */
          }
        }

        /* BRAND & SOCIALS */
        .footer__logo {
          display: flex; align-items: center; gap: 10px;
          font-size: 1.5rem; font-weight: 700; color: var(--white);
          margin-bottom: 1rem; text-decoration: none;
        }
        .footer__logo i { color: var(--orange-accent); font-size: 1.8rem; }
        .footer__desc { color: var(--light-text); font-size: 0.9rem; line-height: 1.6; margin-bottom: 2rem; }

        .footer__social { display: flex; gap: 1rem; }
        .social-link {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.1); display: grid; place-items: center;
          color: var(--white); text-decoration: none; transition: 0.3s;
        }
        .social-link:hover { background: var(--orange-accent); transform: translateY(-5px); }

        /* LINKS */
        .footer__title { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; }
        .footer__links { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.8rem; }
        .footer__link { color: var(--light-text); text-decoration: none; font-size: 0.95rem; transition: 0.3s; }
        .footer__link:hover { color: var(--orange-accent); padding-left: 5px; }

        /* NEWSLETTER FORM */
        .newsletter__form {
          display: flex; flex-direction: column; gap: 1rem;
        }
        .newsletter__input {
          padding: 1rem; border-radius: 5px; border: none; outline: none;
          background: rgba(255,255,255,0.1); color: white; font-family: inherit;
        }
        .newsletter__input:focus { border: 1px solid var(--orange-accent); }
        
        .newsletter__btn {
          padding: 1rem; border-radius: 5px; border: none; cursor: pointer;
          background: var(--orange-accent); color: white; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: 0.3s;
        }
        .newsletter__btn:hover { background: #e67e00; transform: translateY(-3px); }

        .success-msg { color: #4ade80; font-size: 0.9rem; display: flex; align-items: center; gap: 5px; }

        /* SCROLL TO TOP BUTTON */
        .scroll-up {
          position: absolute; right: 2rem; top: -25px;
          background: var(--orange-accent); color: white;
          width: 50px; height: 50px; border-radius: 50%;
          display: grid; place-items: center; font-size: 1.5rem;
          cursor: pointer; border: 4px solid var(--dark-black); /* Border matches bg to look floating */
          transition: 0.4s;
        }
        .scroll-up:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(255,140,0,0.4); }

        /* COPYRIGHT */
        .footer__bottom {
          margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);
          text-align: center; color: var(--light-text); font-size: 0.85rem;
        }
      `,
        }}
      />

      <footer className="footer">
        <div className="scroll-up" onClick={scrollToTop}>
          <i className="ri-arrow-up-line"></i>
        </div>

        <div className="footer__container">
          <div>
            <a href="#" className="footer__logo">
              <i className="ri-shopping-bag-3-fill"></i> E-Store
            </a>
            <p className="footer__desc">
              Premium products designed for the modern professional. Quality and
              style in every detail.
            </p>
            <div className="footer__social">
              <a href="#" className="social-link">
                <i className="ri-facebook-fill"></i>
              </a>
              <a href="#" className="social-link">
                <i className="ri-instagram-fill"></i>
              </a>
              <a href="#" className="social-link">
                <i className="ri-twitter-x-fill"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer__title">Company</h3>
            <ul className="footer__links">
              <li>
                <a href="#" className="footer__link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#products-section" className="footer__link">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Career
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer__title">Contact</h3>
            <ul className="footer__links">
              <li>
                <i
                  className="ri-map-pin-line"
                  style={{ color: "var(--orange-accent)" }}
                ></i>{" "}
                Lahore, PK
              </li>
              <li>
                <i
                  className="ri-mail-line"
                  style={{ color: "var(--orange-accent)" }}
                ></i>{" "}
                help@estore.com
              </li>
              <li>
                <i
                  className="ri-phone-line"
                  style={{ color: "var(--orange-accent)" }}
                ></i>{" "}
                +92 300 1234567
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer__title">Newsletter</h3>
            <p className="footer__desc">
              Subscribe to get 10% off your first order.
            </p>

            <form className="newsletter__form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit" className="newsletter__btn">
                Subscribe <i className="ri-send-plane-fill"></i>
              </button>

              {subscribed && (
                <span className="success-msg">
                  <i className="ri-checkbox-circle-fill"></i> Subscribed
                  Successfully!
                </span>
              )}
            </form>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            &copy; {new Date().getFullYear()} E-Store. Designed by Abdullah.
          </p>
        </div>
      </footer>
    </>
  );
}
