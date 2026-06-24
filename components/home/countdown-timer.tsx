"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  className?: string;
}

function getTimeLeft() {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const diff = end.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-2xl font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] uppercase tracking-wider mt-1 text-white/70">{label}</span>
    </div>
  );
}

export function CountdownTimer({ className }: CountdownTimerProps) {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const display = time ?? { hours: 0, minutes: 0, seconds: 0 };

  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-wider text-white/70 mb-2">Ends in</p>
      <div className="flex gap-2">
        <TimeBlock value={display.hours} label="Hrs" />
        <span className="text-2xl font-bold self-start mt-3 text-white/50">:</span>
        <TimeBlock value={display.minutes} label="Min" />
        <span className="text-2xl font-bold self-start mt-3 text-white/50">:</span>
        <TimeBlock value={display.seconds} label="Sec" />
      </div>
    </div>
  );
}
