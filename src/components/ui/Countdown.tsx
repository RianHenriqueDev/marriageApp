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
      <div className="flex justify-center gap-6 py-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-12 h-16 bg-[#F4EFE6]/60 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const items = [
    { label: "Dias", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center items-center divide-x divide-[#C5A880]/30 py-4 max-w-sm mx-auto">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center px-3 sm:px-5 first:pl-0 last:pr-0"
        >
          <span className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1A19] tracking-tight leading-none">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="font-sans text-[9px] font-medium tracking-[0.25em] text-[#7C7C74] mt-2 uppercase">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
