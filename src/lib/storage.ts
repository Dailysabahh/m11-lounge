import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

function filename(original: string, folder: string) {
  const ext = path.extname(original) || "";
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  return `${folder}/${id}`;
}

export type SavedFile =
  | { kind: "url"; url: string }
  | { kind: "bytes"; data: Uint8Array };

export async function saveUpload(file: File, folder: string): Promise<SavedFile> {
  const key = filename(file.name, folder);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(key, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { kind: "url", url: blob.url };
  }

  // Vercel serverless disk is not persistent — keep the file in the database.
  if (process.env.VERCEL) {
    return { kind: "bytes", data: new Uint8Array(await file.arrayBuffer()) };
  }

  const rel = key.replace(/^\//, "");
  const dest = path.join(process.cwd(), "public/uploads", rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await file.arrayBuffer()));
  return { kind: "url", url: `/uploads/${rel}` };
}
