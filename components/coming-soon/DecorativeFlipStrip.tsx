"use client";

import { useEffect, useState } from "react";
import FlipDigit from "./FlipDigit";

const STRIP_LENGTH = 5;

function randomDigit() {
  return String(Math.floor(Math.random() * 10));
}

export default function DecorativeFlipStrip() {
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: STRIP_LENGTH }, randomDigit)
  );

  useEffect(() => {
    const timers = digits.map((_, index) =>
      setInterval(
        () => {
          setDigits((prev) => {
            const next = [...prev];
            next[index] = randomDigit();
            return next;
          });
        },
        1800 + index * 550
      )
    );
    return () => timers.forEach(clearInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex gap-1.5 sm:gap-2 opacity-70 scale-75 sm:scale-90">
      {digits.map((digit, index) => (
        <FlipDigit key={index} digit={digit} />
      ))}
    </div>
  );
}
