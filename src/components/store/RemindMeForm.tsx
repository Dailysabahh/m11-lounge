"use client";

import { FormEvent, useState } from "react";

export function RemindMeForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/remind", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setMessage(data.error || "Could not save your reminder.");
      return;
    }
    setStatus("done");
    setMessage("You're on the list. We'll remind you before opening night.");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="card-lux mx-auto w-full max-w-xl space-y-4 p-6 md:p-8">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" placeholder="Your name" className="w-full px-3 py-3 text-sm" />
        <input
          name="phone"
          type="tel"
          placeholder="WhatsApp / phone"
          className="w-full px-3 py-3 text-sm"
        />
      </div>
      <input
        name="email"
        type="email"
        required
        placeholder="Email address"
        className="w-full px-3 py-3 text-sm"
      />
      <button disabled={status === "saving"} className="btn-gold w-full py-3.5 text-xs">
        {status === "saving" ? "Saving…" : "Remind me"}
      </button>
      {message && (
        <p className={`text-center text-sm ${status === "error" ? "text-red-400" : "text-gold-light"}`}>
          {message}
        </p>
      )}
      <p className="text-center text-[11px] leading-5 text-muted">
        We will only message you about the M11 opening. No spam.
      </p>
    </form>
  );
}
