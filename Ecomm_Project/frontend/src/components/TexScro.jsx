import React from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import API_URL from "../config";

export default function TexScro() {
  const { scrollY } = useScroll();

  // Scroll logic: Jab scroll 0 se 2000px ho, toh text move kare
  // Forward movement (Left to Right)
  const xLeft = useTransform(scrollY, [0, 2000], [0, -500]);
  // Reverse movement (Right to Left)
  const xRight = useTransform(scrollY, [0, 2000], [-500, 0]);

  const lines = [
    { text: "Creative", reverse: false },
    { text: "Design", reverse: true },
    { text: "Products", reverse: false },
    { text: "Amazing", reverse: true },
  ];

  return (
    <div className="ticker-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        .ticker-wrapper {
          overflow: hidden;
          padding-block: 4rem;
          background: #111; /* Dark Background */
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .ticker-line {
          display: flex;
          white-space: nowrap;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 5vw, 4rem);
          text-transform: uppercase;
          line-height: 1;
        }
        .text-item {
          display: flex;
          gap: 2rem;
          padding-right: 2rem;
        }
        .text-solid { color: #ff8c00; } /* Orange Solid */
        .text-outline {
          color: transparent;
          -webkit-text-stroke: 2px #fff; /* White Outline */
        }
      `}} />

      {lines.map((line, index) => (
        <motion.div
          key={index}
          className="ticker-line"
          style={{ x: line.reverse ? xRight : xLeft }}
        >
          {/* Text ko repeat kar rahe hain taake screen khali na lage */}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="text-item">
              <span className="text-solid">{line.text}</span>
              <span className="text-outline">{line.text}</span>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}