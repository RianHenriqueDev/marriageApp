"use client";

import React from "react";

interface WeddingMonogramProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}

export function WeddingMonogram({
  size = "md",
  className = "",
  animate = true,
}: WeddingMonogramProps) {
  const dimensions = {
    sm: { width: 56, height: 56, radius: 25 },
    md: { width: 84, height: 84, radius: 38 },
    lg: { width: 112, height: 112, radius: 51 },
    xl: { width: 136, height: 136, radius: 62 },
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        animate ? "animate-scale-in" : ""
      } ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Círculo Externo Dourado Fino */}
        <circle
          cx="60"
          cy="60"
          r="56"
          stroke="#C5A880"
          strokeWidth="1.25"
          strokeDasharray="1 0"
          className="opacity-90"
        />

        {/* Círculo Interno Delicado */}
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke="#C5A880"
          strokeWidth="0.6"
          strokeDasharray="3 3"
          className="opacity-60"
        />

        {/* Letra 'J' em Itálico Nobre */}
        <text
          x="44"
          y="62"
          fontFamily="var(--font-serif), 'Playfair Display', serif"
          fontSize="36"
          fontStyle="italic"
          fontWeight="400"
          fill="#2C3328"
          textAnchor="middle"
        >
          J
        </text>

        {/* Ampersand '&' Central Dourado Refinado */}
        <text
          x="58"
          y="56"
          fontFamily="var(--font-serif), 'Playfair Display', serif"
          fontSize="18"
          fontStyle="italic"
          fontWeight="300"
          fill="#C5A880"
          textAnchor="middle"
        >
          &
        </text>

        {/* Letra 'R' Serifada Clássica com Traço Elegante */}
        <text
          x="75"
          y="66"
          fontFamily="var(--font-serif), 'Playfair Display', serif"
          fontSize="34"
          fontWeight="500"
          fill="#2C3328"
          textAnchor="middle"
        >
          R
        </text>

        {/* Linha Divisória de Base */}
        <line
          x1="38"
          y1="80"
          x2="82"
          y2="80"
          stroke="#C5A880"
          strokeWidth="0.75"
          opacity="0.7"
        />

        {/* Data '12 • 12 • 2026' na Base do Selo */}
        <text
          x="60"
          y="93"
          fontFamily="var(--font-sans), 'Plus Jakarta Sans', sans-serif"
          fontSize="7.5"
          fontWeight="500"
          letterSpacing="0.22em"
          fill="#7C7C74"
          textAnchor="middle"
        >
          12 • 12 • 2026
        </text>
      </svg>
    </div>
  );
}
