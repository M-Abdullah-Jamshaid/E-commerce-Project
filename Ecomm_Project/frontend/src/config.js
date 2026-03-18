// Automatically switches between Localhost and Live URL
const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000"  
  : "https://ecomm-project-bowu.onrender.com"; 

export default API_URL;