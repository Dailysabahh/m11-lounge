const PAYSTACK_BASE = "https://api.paystack.co";

export function paystackEnabled() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_PUBLIC_KEY);
}

export async function initializePaystack(params: {
  email: string;
  amountNgn: number;
  reference: string;
  callbackUrl: string;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountNgn * 100,
      reference: params.reference,
      callback_url: params.callbackUrl,
      currency: "NGN",
    }),
  });
  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || "Paystack initialize failed");
  }
  return data.data as {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function verifyPaystack(reference: string) {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );
  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || "Paystack verify failed");
  }
  return data.data as {
    status: string;
    reference: string;
    amount: number;
    customer: { email: string };
  };
}
