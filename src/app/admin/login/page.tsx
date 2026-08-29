"use client";

import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(params.get("callbackUrl") || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card-lux w-full max-w-md space-y-4 p-8">
      <img src="/brand/logo.png" alt="" className="mx-auto h-20 w-20 rounded-full" />
      <h1 className="text-center font-display text-2xl text-gold-light">M11 Admin</h1>
      <p className="text-center text-xs uppercase tracking-[0.25em] text-muted">
        Staff only
      </p>
      <input name="email" type="email" required placeholder="Email" className="w-full px-3 py-2" />
      <input
        name="password"
        type="password"
        required
        placeholder="Password"
        className="w-full px-3 py-2"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={loading} className="btn-gold w-full py-3 text-xs">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
