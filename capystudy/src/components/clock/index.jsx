import React, { useState, useEffect } from "react";

const CircularTimer = ({ duration, size, width, color, children }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const radius = size / 2.2;
    const strokeWidth = width;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        setTimeLeft(duration);
      }, [duration]);
    
      useEffect(() => {
        const interval = setInterval(() => {
          setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);
    
      const progress = duration === 0 ? 0 : (timeLeft / duration) * circumference;

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
            <svg width={size*1.1} height={size*1.1} style={{ rotate: "-90deg" }}>
                <circle
                    cx={size / 1.8}
                    cy={size / 1.82}
                    r={radius}
                    stroke="#ddd"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <circle
                    cx={size / 1.8}
                    cy={size / 1.82}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                />
            </svg>
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
            }}>
                {children}
            </div>
        </div>
    );
};

export default CircularTimer;
