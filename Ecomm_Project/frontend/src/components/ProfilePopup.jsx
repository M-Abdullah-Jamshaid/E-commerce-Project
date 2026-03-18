import React from "react";
import API_URL from "../config";

export default function ProfilePopup({ user, onClose, onLogout, onMyOrders }) {
  if (!user) return null;

  return (
    <>
      {/* 1. Overlay (Background) */}
      <div className="profile-overlay open" onClick={onClose}></div>

      {/* 2. Sidebar Content */}
      <div className="profile-sidebar open">
        <div className="profile-header">
          <span className="profile-title">My Profile</span>
          <i className="ri-close-line profile-close" onClick={onClose}></i>
        </div>

        <div className="profile-body">
          {/* User Avatar Big */}
          <div className="profile-avatar-large">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <h3 className="profile-name">{user.name}</h3>
          <p className="profile-email">{user.email}</p>

          <hr
            style={{ borderColor: "#333", width: "100%", margin: "20px 0" }}
          />

          {/* Action Buttons */}
          <div className="profile-actions">
            <button className="profile-btn" onClick={onMyOrders}>
              <i className="ri-shopping-bag-3-line"></i> My Orders
            </button>

            

            <button className="profile-btn logout" onClick={onLogout}>
              <i className="ri-logout-box-r-line"></i> Sign Out
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .profile-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px); z-index: 2000;
          transition: 0.3s;
        }

        .profile-sidebar {
          position: fixed; top: 0; right: 0;
          width: 100%; max-width: 350px; height: 100vh;
          background: #1a1a1a; color: white; z-index: 2001;
          padding: 2rem; display: flex; flex-direction: column;
          box-shadow: -5px 0 15px rgba(0,0,0,0.5);
          border-left: 5px solid #ff8c00;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }

        .profile-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 2rem; border-bottom: 1px solid #333; padding-bottom: 1rem;
        }

        .profile-title {
          font-size: 1.5rem; font-weight: 800; font-family: 'Montserrat', sans-serif;
          text-transform: uppercase; letter-spacing: 1px;
        }

        .profile-close {
          font-size: 2rem; cursor: pointer; color: #666; transition: 0.3s;
        }
        .profile-close:hover { color: #ff8c00; transform: rotate(90deg); }

        .profile-body {
          display: flex; flex-direction: column; align-items: center;
          flex: 1;
        }

        .profile-avatar-large {
          width: 100px; height: 100px;
          background: #ff8c00; color: white;
          font-size: 3rem; font-weight: bold;
          border-radius: 50%; display: grid; place-items: center;
          border: 4px solid #fff; margin-bottom: 15px;
        }

        .profile-name { margin: 0; font-size: 1.5rem; }
        .profile-email { color: #aaa; margin: 5px 0 0 0; font-size: 0.9rem; }

        .profile-actions { width: 100%; display: flex; flex-direction: column; gap: 10px; }

        .profile-btn {
          width: 100%; padding: 12px;
          background: #2a2a2a; color: white; border: none;
          border-radius: 8px; cursor: pointer; text-align: left;
          display: flex; align-items: center; gap: 15px; font-size: 1rem;
          transition: 0.2s;
        }
        .profile-btn:hover { background: #333; color: #ff8c00; }
        .profile-btn.logout { color: #ff4d4d; background: rgba(255, 77, 77, 0.1); margin-top: auto; }
        .profile-btn.logout:hover { background: #ff4d4d; color: white; }
      `}</style>
    </>
  );
}
