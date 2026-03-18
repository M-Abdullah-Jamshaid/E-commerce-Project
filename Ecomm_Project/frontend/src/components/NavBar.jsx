import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Uncomment agar router setup hai

export default function Signup() {
  // const navigate = useNavigate();
  
  // 1. Teen cheezein chahiye: Name, Email, Password
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 2. Register API Call (Backend Route confirm karein)
      const response = await fetch(`${API_URL}/api/users`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration Failed");
      }

      // 3. Success!
      setSuccess(true);
      setFormData({ name: "", email: "", password: "" }); // Form clear karein

      // Thori der baad Login page par bhej dein
      setTimeout(() => {
        // navigate("/login");
        window.location.href = "/login"; 
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .signup-container {
          min-height: 100vh;
          background-color: #111;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Montserrat', sans-serif; padding: 1rem;
        }
        .signup-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 3rem 2.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%; max-width: 450px; text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .signup-title { color: white; font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; text-transform: uppercase; }
        .signup-subtitle { color: #888; font-size: 0.9rem; margin-bottom: 2rem; }
        
        .input-group { margin-bottom: 1.2rem; text-align: left; }
        .input-label { display: block; color: #ccc; font-size: 0.9rem; margin-bottom: 0.5rem; margin-left: 5px; }
        .custom-input {
          width: 100%; padding: 1rem; background: #222; border: 2px solid #333;
          border-radius: 10px; color: white; font-size: 1rem; outline: none; transition: 0.3s;
        }
        .custom-input:focus { border-color: #ff8c00; background: #1a1a1a; }

        .signup-btn {
          width: 100%; padding: 1rem; background: #ff8c00; color: white;
          font-weight: 700; border: none; border-radius: 50px; cursor: pointer;
          font-size: 1rem; margin-top: 1rem; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px;
        }
        .signup-btn:hover { background: #e67e00; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255, 140, 0, 0.3); }
        
        .error-msg { background: rgba(255, 0, 0, 0.1); color: #ff4d4d; padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #ff4d4d; }
        .success-msg { background: rgba(0, 255, 0, 0.1); color: #4ade80; padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #4ade80; }
        
        .footer-text { margin-top: 1.5rem; color: #888; font-size: 0.9rem; }
        .footer-link { color: #ff8c00; text-decoration: none; font-weight: 600; }
        .footer-link:hover { text-decoration: underline; }
      `}} />

      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>
        <p className="signup-subtitle">Join us for a premium experience</p>

        {error && <div className="error-msg"><i className="ri-error-warning-fill"></i> {error}</div>}
        {success && <div className="success-msg"><i className="ri-checkbox-circle-fill"></i> Account Created! Redirecting...</div>}

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input 
              type="text" name="name" placeholder="John Doe" 
              className="custom-input" value={formData.name} onChange={handleChange} required 
            />
          </div>

          {/* Email Field */}
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input 
              type="email" name="email" placeholder="name@example.com" 
              className="custom-input" value={formData.email} onChange={handleChange} required 
            />
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" name="password" placeholder="••••••••" 
              className="custom-input" value={formData.password} onChange={handleChange} required 
            />
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <a href="/login" className="footer-link">Login</a>
        </p>
      </div>
    </div>
  );
}