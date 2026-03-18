import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../config";

export const ToastConfig = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* CUSTOM ORANGE THEME CSS */}
      <style>{`
        :root {
          --orange: #ff8c00;
          --dark-card: #1e1e1e;
        }
        .Toastify__toast {
          background-color: var(--dark-card) !important;
          border-left: 5px solid var(--orange) !important;
          border-radius: 8px !important;
          color: white !important;
          font-family: 'Montserrat', sans-serif !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
        }
        .Toastify__progress-bar--success {
          background: var(--orange) !important;
        }
        .Toastify__progress-bar--error {
          background: #ff4d4d !important;
        }
        .Toastify__close-button {
          color: white !important;
        }
      `}</style>
    </>
  );
};


export const showSuccess = (message) => {
  toast.success(message, {
    icon: "🚀", 
  });
};

export const showError = (message) => {
  toast.error(message, {
    icon: "❌", // Custom Icon
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    icon: "ℹ️",
  });
};
