/** Set PREOPENING=false on Vercel when the lounge is ready to take public orders. */
export function isPreopening() {
  return process.env.PREOPENING !== "false";
}

export function instagramHref(handle: string) {
  return `https://www.instagram.com/${handle.replace(/^@/, "")}/`;
}

export function tiktokHref(handle: string) {
  return `https://www.tiktok.com/@${handle.replace(/^@/, "")}`;
}
