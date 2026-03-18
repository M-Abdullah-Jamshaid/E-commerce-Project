import React, { useEffect, useState } from "react";
import API_URL from "../config";

export default function OrdersPopup({ onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setOrders(data);
        } else {
          setError(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Network Error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-modal-overlay">
      <div className="order-modal-content">
        <div className="modal-header">
          <h2>My Orders</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <p className="loading-text">Loading orders...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : orders.length === 0 ? (
            <p className="empty-text">No orders found.</p>
          ) : (
            <div className="table-responsive">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    {/* --- 1. NEW HEADER ADDED HERE --- */}
                    <th style={{width: '30%'}}>Items</th> 
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="id-col">#{order._id.substring(0, 10)}...</td>
                      
                      <td>
                        {order.orderItems.map((item, index) => (
                          <div key={index} style={{ marginBottom: '4px', fontSize: '0.85rem' }}>
                            <span style={{color: 'white'}}>{item.name}</span>
                            <span style={{color: '#888', marginLeft:'5px', fontSize:'0.75rem'}}>
                                (x{item.qty})
                            </span>
                          </div>
                        ))}
                      </td>

                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="price-col">${order.totalPrice}</td>
                      <td>
                        <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                            {order.isPaid ? (
                            <span className="badge success">Paid</span>
                            ) : (
                            <span className="badge danger">Not Paid</span>
                            )}
                            {order.isDelivered ? (
                            <span className="badge success">Delivered</span>
                            ) : (
                            <span className="badge warning">Pending</span>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .order-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          backdrop-filter: blur(5px); z-index: 3000;
          display: flex; justify-content: center; align-items: center;
        }
        .order-modal-content {
          background: #1a1a1a; color: white; width: 95%; max-width: 900px; /* Width thori barhai hai */
          border-radius: 15px; border: 1px solid #333;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5); overflow: hidden;
          max-height: 85vh; display: flex; flex-direction: column;
        }
        .modal-header {
          padding: 20px; background: #222; display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid #333;
        }
        .modal-header h2 { margin: 0; color: #ff8c00; font-family: 'Montserrat', sans-serif; }
        .close-btn { background: none; border: none; color: white; font-size: 2rem; cursor: pointer; }
        .close-btn:hover { color: #ff8c00; }
        
        .modal-body { padding: 20px; overflow-y: auto; }
        
        .order-table { width: 100%; border-collapse: collapse; text-align: left; }
        .order-table th { color: #aaa; font-size: 0.85rem; padding: 12px; border-bottom: 1px solid #333; text-transform: uppercase; letter-spacing: 1px; }
        .order-table td { padding: 15px 12px; border-bottom: 1px solid #2a2a2a; font-size: 0.9rem; vertical-align: middle; }
        
        .id-col { color: #ff8c00; font-family: monospace; }
        .price-col { font-weight: bold; color: #fff; font-size: 1rem; }
        
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; display: inline-block; text-align: center; width: fit-content; }
        .success { background: rgba(0, 255, 0, 0.1); color: #00ff00; border: 1px solid #00ff00; }
        .danger { background: rgba(255, 0, 0, 0.1); color: #ff4d4d; border: 1px solid #ff4d4d; }
        .warning { background: rgba(255, 165, 0, 0.1); color: orange; border: 1px solid orange; }

        .loading-text, .empty-text, .error-text { text-align: center; padding: 40px; color: #888; }
        .error-text { color: #ff4d4d; }

        /* Responsive Table */
        @media (max-width: 600px) {
            .order-table thead { display: none; }
            .order-table tr { display: flex; flex-direction: column; border-bottom: 1px solid #333; padding: 10px 0; }
            .order-table td { padding: 5px 10px; border: none; }
            .id-col { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
}