import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function GlassCard({
  hoverEffect = false,
  className = "",
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`glass-kage ${hoverEffect ? "glass-card-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
