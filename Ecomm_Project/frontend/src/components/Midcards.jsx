import React from "react";
// 1. Sabse pehle Lucide icons import karein
import * as LucideIcons from "lucide-react";
import API_URL from "../config";

export default function Midcards() {
  const data = [
    {
      id: 1,
      title: "Free Return",
      description: "30 days money back guarantee!",
      icon: "RotateCcw",
      color: "#FF6B6B",
    },
    {
      id: 2,
      title: "Free Shipping",
      description: "Free shipping on all orders",
      icon: "Truck",
      color: "#4ECDC4",
    },
    {
      id: 3,
      title: "Support 24/7",
      description: "We support online 24 hrs a day",
      icon: "Headset",
      color: "#45B7D1",
    },
    {
      id: 4,
      title: "Receive Gift Card",
      description: "Receive gift on all orders over $50",
      icon: "Gift",
      color: "#F9D56E",
    },
    {
      id: 5,
      title: "Secure Payment",
      description: "We Value Your Security",
      icon: "ShieldCheck",
      color: "#2AB7CA",
    },
    {
      id: 6,
      title: "Online Service",
      description: "Free return products in 30 days",
      icon: "Globe",
      color: "#6C5CE7",
    },
  ];
  // const dataaa=

  return (
    // <div className="container-fluid my-5" style={{backgroundColor:"#F1F1F0",marginBottom:'15px'}}>
    <div className="main-slider-wrapper" style={{ overflow: "hidden",marginBottom:" 50px" }}>
      <div className="row g-4 my-4">

        {data.map((item) => {
          const IconComponent = LucideIcons[item.icon];

          return (
            <div key={item.id} className="col-6 col-lg-2">
              <div
                className="card h-100 shadow-sm border-1 text-center p-4"
                style={{ transition: "0.3s", cursor: "pointer" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div className="mb-3 d-flex justify-content-center">
                  {IconComponent ? (
                    <IconComponent
                      color={item.color}
                      size={35}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <LucideIcons.HelpCircle color="#ccc" size={35} />
                  )}
                </div>

                <h6 className="fw-bold mb-2" style={{ fontSize: "14px" }}>
                  {item.title}
                </h6>
                <p
                  className="text-muted mb-0"
                  style={{ fontSize: "12px", lineHeight: "1.4" }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
