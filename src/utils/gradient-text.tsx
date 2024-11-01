import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ children, className }) => {
  return (
    <span
      className={`bg-gradient-to-r from-primary via-rose-400 to-primary bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
};

export default GradientText;
