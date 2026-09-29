"use client";

import { useEffect, useState } from "react";

const PICKUP_FLOW = [
  { key: "received", label: "Order received", detail: "Sent to the kitchen" },
  { key: "preparing", label: "On the fire", detail: "Grill is working" },
  { key: "ready", label: "Ready", detail: "Packed and waiting" },
  { key: "completed", label: "Completed", detail: "Enjoyed, hopefully" },
];

const DELIVERY_FLOW = [
  { key: "received", label: "Order received", detail: "Sent to the kitchen" },
  { key: "preparing", label: "On the fire", detail: "Grill is working" },
  { key: "ready", label: "Packed", detail: "Boxed for the ride" },
  { key: "out_for_delivery", label: "On the way", detail: "Rider en route" },
  { key: "completed", label: "Delivered", detail: "Handed over" },
];

export default function OrderStatusTracker({
  code,
  fulfillment,
  initialStatus,
}: {
  code: string;
  fulfillment: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const flow = fulfillment === "delivery" ? DELIVERY_FLOW : PICKUP_FLOW;

  useEffect(() => {
    if (status === "completed" || status === "cancelled") return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/status/${code}`);
        if (!res.ok) return;
        const data = (await res.json()) as { order: { status: string } };
        if (data.order?.status) setStatus(data.order.status);
      } catch {
        /* keep the last known status */
      }
    }, 12000);
    return () => clearInterval(timer);
  }, [code, status]);

  const activeIndex =
    status === "cancelled"
      ? -1
      : flow.findIndex((step) => step.key === status);

  return (
    <div className="rounded-3xl border border-white/10 bg-ink-2 p-8">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.24em] text-cream/50">
          Live status
        </p>
        <span className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ember">
          <span className="h-2 w-2 animate-pulse rounded-full bg-ember" />
          {status.replace(/_/g, " ")}
        </span>
      </div>

      {status === "cancelled" ? (
        <p className="mt-6 text-sm text-red-300">
          This order was cancelled. Give us a call at 0704 166 3145 if that
          surprises you.
        </p>
      ) : (
        <ol className="mt-8 space-y-6">
          {flow.map((step, index) => {
            const done = index <= activeIndex;
            const current = index === activeIndex;
            return (
              <li key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`h-4 w-4 rounded-full border transition ${
                      done
                        ? "border-ember bg-ember"
                        : "border-white/25 bg-transparent"
                    } ${current ? "ring-4 ring-ember/20" : ""}`}
                  />
                  {index < flow.length - 1 ? (
                    <span
                      className={`mt-1 h-10 w-px ${
                        index < activeIndex ? "bg-ember" : "bg-white/15"
                      }`}
                    />
                  ) : null}
                </div>
                <div className="-mt-1">
                  <p
                    className={`font-display text-lg ${
                      done ? "text-cream" : "text-cream/40"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-cream/45">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
