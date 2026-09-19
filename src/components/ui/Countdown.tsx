"use client";

import { useEffect, useState } from "react";
import { WEDDING_DATE } from "@/lib/utils";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = WEDDING_DATE.getTime() - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center gap-4 py-6">
        <div className="w-16 h-16 bg-gold-100/50 rounded-xl animate-pulse" />
        <div className="w-16 h-16 bg-gold-100/50 rounded-xl animate-pulse" />
        <div className="w-16 h-16 bg-gold-100/50 rounded-xl animate-pulse" />
        <div className="w-16 h-16 bg-gold-100/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  const items = [
    { label: "DIAS", value: timeLeft.days },
    { label: "HORAS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEG", value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center items-center gap-3 sm:gap-6 py-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center bg-white/80 border border-gold-200/60 shadow-sm backdrop-blur-sm rounded-2xl px-3 sm:px-5 py-3 min-w-[65px] sm:min-w-[85px] transition-transform hover:scale-105 duration-300"
        >
          <span className="font-serif text-2xl sm:text-4xl font-bold text-emeraldDeep tracking-tight">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-gold-700 mt-1 uppercase">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
