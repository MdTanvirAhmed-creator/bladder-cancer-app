import React from "react";

export function Button({ children, onClick, className = "", variant = "default" }) {
  const baseStyle = "px-4 py-2 rounded text-sm font-medium transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || ""} ${className}`}
    >
      {children}
    </button>
  );
}
