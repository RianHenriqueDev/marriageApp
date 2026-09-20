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

        {/* Letra 'J' Serifada Nobre e Nítida (sem barra central que confunde com F) */}
        <text
          x="42"
          y="65"
          fontFamily="var(--font-serif), 'Playfair Display', serif"
          fontSize="36"
          fontStyle="normal"
          fontWeight="500"
          fill="#2C3328"
          textAnchor="middle"
        >
          J
        </text>

        {/* Coração Central Dourado Refinado (ao invés de &) */}
        <path
          d="M59 52 C59 49.5 56.5 48 54 48 C51.5 48 49.5 50 49.5 52.5 C49.5 56.5 54 60 59 63.5 C64 60 68.5 56.5 68.5 52.5 C68.5 50 66.5 48 64 48 C61.5 48 59 49.5 59 52 Z"
          fill="#C5A880"
          className="opacity-90"
        />

        {/* Letra 'R' Serifada Clássica com Traço Elegante */}
        <text
          x="76"
          y="65"
          fontFamily="var(--font-serif), 'Playfair Display', serif"
          fontSize="36"
          fontStyle="normal"
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
