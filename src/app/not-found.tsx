export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-[11px] uppercase tracking-[0.4em] text-gold">404</p>
      <h1 className="mt-3 font-display text-4xl text-gold-light">Lost in the lounge</h1>
      <p className="mt-3 text-muted">That page isn’t on the floor plan.</p>
      <a href="/" className="btn-gold mt-8 px-8 py-3 text-xs">
        Back home
      </a>
    </div>
  );
}
