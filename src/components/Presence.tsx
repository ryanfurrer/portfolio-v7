import { useEffect, useState } from "react";

/**
 * Presence indicator: my nearest city, live local time (24h), and an
 * online/offline dot derived from my waking hours — e.g. "● NYC 19:45".
 * Computed in the visitor's browser from the fixed config below — no backend
 * and no visitor geolocation; the timezone is mine, so every visitor sees the
 * same value regardless of where they are.
 */
const PRESENCE = {
  /** My IANA timezone. */
  timeZone: "America/New_York",
  /** Nearest major city, shown inline next to the time. */
  location: "NYC",
  /** Local hour I usually wake / sleep (0–23). Wrap past midnight is fine. */
  wakeHour: 7,
  sleepHour: 23,
};

// 24-hour local time, e.g. "19:45".
const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: PRESENCE.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// Hour as 0–23 for the awake check (h23 keeps midnight at 0).
const hourFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: PRESENCE.timeZone,
  hour: "2-digit",
  hourCycle: "h23",
});

/** True when `hour` falls in the waking window, handling windows that wrap midnight. */
function isAwake(hour: number, wake: number, sleep: number) {
  return wake <= sleep ? hour >= wake && hour < sleep : hour >= wake || hour < sleep;
}

export default function Presence() {
  // Stay null until mounted so server HTML and first client paint match
  // (the live time would otherwise differ and trip a hydration warning).
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const online = now
    ? isAwake(Number(hourFormatter.format(now)), PRESENCE.wakeHour, PRESENCE.sleepHour)
    : false;

  return (
    <div className="inline-flex items-center gap-2 text-sm text-foreground-muted">
      <span className="relative flex size-2" aria-hidden="true">
        {now && online && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/70 motion-reduce:hidden" />
        )}
        <span
          className={`relative inline-flex size-2 rounded-full ${
            now ? (online ? "bg-emerald-500" : "bg-foreground-subtle") : "bg-foreground-subtle/50"
          }`}
        />
      </span>
      <span className="tabular-nums">
        {PRESENCE.location}
        {now && ` ${timeFormatter.format(now)}`}
      </span>
      <span className="sr-only">
        {now ? (online ? "Online" : "Offline") : ""}
      </span>
    </div>
  );
}
