import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 1. Toast Notification Import
import { ToastConfig } from "./components/ToastNotification";

// Components
import Nav2nd from "./components/Nav2nd";
import MainCard from "./components/MainCard";
import Midcards from "./components/Midcards";
import Products from "./components/Products";
import TexScro from "./components/TexScro";
import FooterF from "./components/FooterF";
import AuthPage from "./components/AuthPage";
import { CartProvider } from "./components/CartContext";
import SearchResults from "./components/SearchResults";
import ChatBot from "./components/ChatBot";
import AdminDashboard from "./components/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

import {
  HeroReveal,
  TiltReveal,
  ZoomReveal,
  FooterReveal,
} from "./components/Animations";

import ScrollProducts from "./components/ScrollProducts";

export default function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  const userInfo = localStorage.getItem("userInfo");
  const user = userInfo ? JSON.parse(userInfo) : null;

  return (
    <CartProvider>
      <BrowserRouter>
        <ToastConfig />

        {isAuthenticated && <Nav2nd />}
        {isAuthenticated && <ChatBot />}

        {/* Floating Button (Optional - Agar lagana ho to uncomment karein) */}
        {/* {isAuthenticated && <ScrollProducts />} */}

        <Routes>
          {!isAuthenticated ? (
            <Route path="*" element={<AuthPage />} />
          ) : (
            <Route
              path="/"
              element={
                user && user.isAdmin ? (
                  <Navigate to="/admin" />
                ) : (
                  <>
                    {/* 1. MainCard -> Smooth Slide Down */}
                    <HeroReveal>
                      <MainCard />
                    </HeroReveal>
                    {/* 2. Midcards -> 3D Flip Effect */}
                    <TiltReveal>
                      <Midcards />
                    </TiltReveal>
                    {/* 3. TexScro -> Curtain Opening Effect */}
                    <HeroReveal>
                      <TexScro />
                    </HeroReveal>
                    {/* 4. Products -> Pop Up / Zoom Effect */}
                    <HeroReveal>
                      <Products />
                    </HeroReveal>
                  </>
                )
              }
            />
          )}

          {/* Redirect Logic */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />}
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/search" element={<SearchResults />} />
        </Routes>

        {/* 5. Footer -> Slide Up Animation */}
        {isAuthenticated && (
          <FooterReveal>
            <FooterF />
          </FooterReveal>
        )}
      </BrowserRouter>
    </CartProvider>
  );
}
