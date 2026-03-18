import React, { useState } from "react";
import { FaFacebookF, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { showSuccess, showError } from "./ToastNotification";
import API_URL from "../config";

// 1. STYLES (Fixed for Mobile Centering)
const staticCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap');

  * { box-sizing: border-box; }

  :root {
    --orange: #ff8c00;
    --orange-dark: #e67e00;
    --dark-bg: #121212;
    --card-bg: #1e1e1e;
    --white: #fff;
  }

  .auth-body {
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Montserrat', sans-serif;
    min-height: 100vh; 
    margin: 0;
    padding: 20px;
  }

  .container {
    background-color: var(--card-bg);
    border-radius: 30px;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    position: relative;
    overflow: hidden;
    width: 850px;
    max-width: 100%;
    min-height: 550px;
  }

  .form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
  }

  .sign-in-container { left: 0; width: 50%; z-index: 2; }
  .sign-up-container { left: 0; width: 50%; opacity: 0; z-index: 1; }

  /* ANIMATION LOGIC */
  .container.right-panel-active .sign-in-container { transform: translateX(100%); }
  .container.right-panel-active .sign-up-container { transform: translateX(100%); opacity: 1; z-index: 5; animation: show 0.6s; }

  @keyframes show { 0%, 49.99% { opacity: 0; z-index: 1; } 50%, 100% { opacity: 1; z-index: 5; } }

  .overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
    border-radius: 0 30px 30px 0;
  }

  .container.right-panel-active .overlay-container {
    transform: translateX(-100%);
    border-radius: 30px 0 0 30px;
  }

  .overlay {
    background: var(--orange);
    background: linear-gradient(to right, #ff8c00, #ffaa40);
    color: #ffffff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
  }

  .container.right-panel-active .overlay { transform: translateX(50%); }

  .overlay-panel {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
  }

  .overlay-left { transform: translateX(-20%); }
  .container.right-panel-active .overlay-left { transform: translateX(0); }
  .overlay-right { right: 0; transform: translateX(0); }
  .container.right-panel-active .overlay-right { transform: translateX(20%); }

  form {
    background-color: var(--card-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    text-align: center;
    color: white;
  }

  h1 { margin: 0; margin-bottom: 10px; color: var(--orange); text-transform: uppercase; font-family: 'Montserrat', sans-serif; }
  .overlay-panel h1 { color: white; }

  /* INPUT FIXES */
  input {
    background-color: transparent;
    border: 2px solid #333;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
    color: white;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
    font-family: 'Montserrat', sans-serif; 
  }
  
  input:focus { border-color: var(--orange); background: #252525; }

  /* Autofill Fix */
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px #1e1e1e inset !important;
      -webkit-text-fill-color: white !important;
      transition: background-color 5000s ease-in-out 0s;
      font-family: 'Montserrat', sans-serif !important;
  }

  .social-container { margin: 20px 0; display: flex; justify-content: center; gap: 15px; }
  .social-container a {
    border: 1px solid #ddd;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 45px; width: 45px;
    color: white; text-decoration: none; font-size: 1.2rem;
    transition: 0.3s;
  }
  .social-container a:hover { 
    background: var(--orange); 
    border-color: var(--orange); 
    transform: translateY(-3px); 
  }

  button {
    border-radius: 50px;
    border: 1px solid var(--orange);
    background-color: var(--orange);
    color: #FFFFFF;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    margin-top: 15px;
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;
  }

  button:hover {
    background-color: var(--orange-dark);
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(255, 140, 0, 0.4);
  }

  button:active { transform: scale(0.95); }
  button.ghost { background-color: transparent; border-color: #FFFFFF; }
  button.ghost:hover { background: #fff; color: var(--orange); }

  .mobile-only { display: none; margin-top: 20px; font-size: 14px; }
  .mobile-only span { color: var(--orange); font-weight: bold; cursor: pointer; }

  /* --- MOBILE RESPONSIVE FIXES (UPDATED) --- */
  @media (max-width: 768px) {
    .container { width: 100%; min-height: auto; border-radius: 15px; padding-bottom: 20px; }
    
    .overlay-container { display: none; }
    
    /* Center the form container */
    .form-container { 
        width: 100%; 
        position: relative; 
        height: auto; 
        display: flex;         /* NEW */
        justify-content: center; /* NEW */
    }
    
    /* Ensure the form takes full width and stays centered */
    form { 
        padding: 40px 20px; 
        height: auto; 
        width: 100%;          /* NEW */
        text-align: center;   /* NEW */
        align-items: center;  /* NEW */
    }

    /* Default: Show SignIn, Hide SignUp */
    .sign-in-container { display: flex; width: 100%; opacity: 1; }
    .sign-up-container { display: none; width: 100%; opacity: 0; }
    
    /* When Active: Hide SignIn, Show SignUp */
    .container.right-panel-active .sign-in-container { display: none; }
    .container.right-panel-active .sign-up-container { display: flex; opacity: 1; transform: none; animation: none; z-index: 5; }

    .mobile-only { display: block; margin-top: 15px; }
  }
`;

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- SIGNUP FUNCTION ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        showSuccess("Account Created! Please Login.");
        setIsSignUp(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        showError(data.message || "Signup Failed");
      }
    } catch (error) {
      console.error(error);
      showError("Server Error! Backend check karein.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIN FUNCTION ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        showSuccess("Login Successful! Welcome.");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        showError(data.message || "Invalid Email or Password");
      }
    } catch (error) {
      console.error(error);
      showError("Server Error! Backend check karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-body">
      <style>{staticCSS}</style>

      <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
        {/* SIGN UP FORM */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#">
                <FaFacebookF />
              </a>
              <a href="#">
                <FaGoogle />
              </a>
              <a href="#">
                <FaLinkedinIn />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button disabled={loading}>{loading ? "..." : "Sign Up"}</button>
            <p className="mobile-only">
              Already have an account?{" "}
              <span onClick={() => setIsSignUp(false)}>Sign In</span>
            </p>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#">
                <FaFacebookF />
              </a>
              <a href="#">
                <FaGoogle />
              </a>
              <a href="#">
                <FaLinkedinIn />
              </a>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a
              href="#"
              style={{
                color: "#888",
                textDecoration: "none",
                marginTop: "10px",
                fontSize: "12px",
              }}
            >
              Forgot your password?
            </a>
            <button disabled={loading}>{loading ? "..." : "Sign In"}</button>
            <p className="mobile-only">
              Don't have an account?{" "}
              <span onClick={() => setIsSignUp(true)}>Sign Up</span>
            </p>
          </form>
        </div>

        {/* OVERLAY */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost" onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
