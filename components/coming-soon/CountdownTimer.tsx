"use client";

import { useEffect, useState } from "react";
import FlipUnit from "./FlipUnit";

const COUNTDOWN_DAYS = 15;
const STORAGE_KEY = "quadsyntax-launch-target";

function getTargetTime() {
  if (typeof window === "undefined") {
    return Date.now() + COUNTDOWN_DAYS * 24 * 60 * 60 * 1000;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = Number(stored);
    if (!Number.isNaN(parsed) && parsed > Date.now()) {
      return parsed;
    }
  }
  const target = Date.now() + COUNTDOWN_DAYS * 24 * 60 * 60 * 1000;
  window.localStorage.setItem(STORAGE_KEY, String(target));
  return target;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function computeTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const [target, setTarget] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const t = getTargetTime();

    function tick() {
      setTarget(t);
      setTimeLeft(computeTimeLeft(t));
    }

    const interval = setInterval(tick, 1000);
    const timeout = setTimeout(tick, 0);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (target === null) {
    return (
      <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-2 xs:gap-3 sm:gap-6">
        {["DAYS", "HRS", "MINS", "SECS"].map((label) => (
          <div key={label} className="flex flex-col items-center gap-1 xs:gap-2 sm:gap-3">
            <div className="flex gap-0.5 xs:gap-1 sm:gap-1.5">
              <div className="w-7 h-10 xs:w-9 xs:h-12 sm:w-14 sm:h-20 rounded-lg bg-[#12131f] border border-white/5 shrink-0" />
              <div className="w-7 h-10 xs:w-9 xs:h-12 sm:w-14 sm:h-20 rounded-lg bg-[#12131f] border border-white/5 shrink-0" />
            </div>
            <span className="text-[8px] xs:text-[10px] sm:text-xs tracking-[0.15em] xs:tracking-[0.25em] uppercase text-white/50 font-medium">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-2 xs:gap-3 sm:gap-6">
      <FlipUnit value={timeLeft.days} label="Days" />
      <FlipUnit value={timeLeft.hours} label="Hrs" />
      <FlipUnit value={timeLeft.minutes} label="Mins" />
      <FlipUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}
