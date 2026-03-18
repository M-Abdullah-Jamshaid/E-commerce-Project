import React, { useState, useEffect } from "react";
import { showSuccess, showError } from "./ToastNotification";
import API_URL from "../config";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    countInStock: 0,
  });
  const [loading, setLoading] = useState(false);

  // --- 1. FETCH PRODUCTS ---
  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/api/products`);
    const data = await res.json();
    setProducts(data.products || data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 2. ADD PRODUCT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Admin Token needed
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add product");

      showSuccess("Product Added Successfully!");
      setFormData({ name: "", price: "", description: "", category: "", image: "", countInStock: 0 }); // Reset Form
      fetchProducts(); // Refresh List
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. DELETE PRODUCT ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");

      showSuccess("Product Deleted!");
      fetchProducts();
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div style={{ padding: "100px 20px", minHeight: "100vh", background: "#f4f4f4" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontWeight: "800", marginBottom: "30px" }}>Admin Dashboard</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px" }}>
          
          {/* --- LEFT: ADD PRODUCT FORM --- */}
          <div style={{ background: "white", padding: "30px", borderRadius: "15px", height: "fit-content", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "20px" }}>Add New Product</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
              <input placeholder="Price" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={inputStyle} required />
              <input placeholder="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={inputStyle} required />
              <input placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} style={inputStyle} required />
              <input placeholder="Stock Count" type="number" value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} style={inputStyle} required />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: "100px"}} required />
              
              <button disabled={loading} style={btnStyle}>
                {loading ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>

          {/* --- RIGHT: PRODUCT LIST --- */}
          <div>
            <h3 style={{ marginBottom: "20px" }}>Inventory ({products.length})</h3>
            <div style={{ display: "grid", gap: "15px" }}>
              {products.map((p) => (
                <div key={p._id} style={itemStyle}>
                  <img src={p.image} alt={p.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "1rem", margin: 0 }}>{p.name}</h4>
                    <p style={{ margin: 0, color: "#777", fontSize: "0.9rem" }}>${p.price} - {p.countInStock} in stock</p>
                  </div>
                  <button onClick={() => handleDelete(p._id)} style={deleteBtnStyle}>
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const inputStyle = { padding: "12px", border: "1px solid #ddd", borderRadius: "8px", outline: "none" };
const btnStyle = { padding: "12px", background: "#ff8c00", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const itemStyle = { display: "flex", alignItems: "center", gap: "15px", background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" };
const deleteBtnStyle = { background: "#ffecec", color: "red", border: "none", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center" };