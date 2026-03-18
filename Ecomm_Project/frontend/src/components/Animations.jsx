import React from "react";
import { motion } from "framer-motion";

// 1. HERO ANIMATION (Soft Slide Down & Fade)
export const HeroReveal = ({ children }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
};

// 2. MIDCARDS ANIMATION (3D Rotate/Flip from Bottom)
export const TiltReveal = ({ children }) => {
  return (
    <motion.div
      initial={{ rotateX: 90, opacity: 0 }}
      whileInView={{ rotateX: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.4}}
      transition={{ duration:1,type: "spring", bounce: 0.7}}
      style={{ width: "100%", perspective: "1000px" }} // Perspective zaroori hai 3D ke liye
    >
      {children}
    </motion.div>
  );
};

// 3. TEXT SCROLL ANIMATION (Curtain Open Effect - Width Expand)
export const CurtainReveal = ({ children }) => {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 50% 0 50%)", opacity: 0 }} // Beech mein band hai
      whileInView={{ clipPath: "inset(0 0% 0 0%)", opacity: 1 }} // Poora khul gaya
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
};

// 4. PRODUCTS ANIMATION (Scale Up / Pop Up)
export const ZoomReveal = ({ children }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      whileInView={{ scale: 1, opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "backOut" }} // backOut se thora bounce aayega
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
};

// 5. FOOTER ANIMATION (Slide Up from Ground)
export const FooterReveal = ({ children }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
};
