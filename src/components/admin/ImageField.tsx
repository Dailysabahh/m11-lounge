"use client";

import { useState } from "react";

export function ImageField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);

  async function onFile(file: File) {
    setBusy(true);
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setBusy(false);
    if (data.url) setUrl(data.url);
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      {url && <img src={url} alt="" className="mb-2 h-28 w-28 object-cover" />}
      <input
        type="file"
        accept="image/*"
        className="text-sm"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      {busy && <p className="text-xs text-gold">Uploading…</p>}
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="or paste image URL"
        className="mt-2 w-full px-3 py-2 text-sm"
      />
    </div>
  );
}
