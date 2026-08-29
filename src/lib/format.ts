export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function generateOrderNumber() {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `M11-${n}`;
}

export const ORDER_FLOW = [
  "PENDING_PAYMENT",
  "PAID",
  "PREPARING",
  "READY",
  "COMPLETED",
] as const;

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING_PAYMENT: "Awaiting payment",
    PAID: "Paid",
    PREPARING: "Preparing",
    READY: "Ready",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return map[status] ?? status;
}
