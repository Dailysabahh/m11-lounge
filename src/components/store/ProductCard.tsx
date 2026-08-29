import Link from "next/link";
import { formatNaira } from "@/lib/format";

export function ProductCard({
  name,
  slug,
  price,
  image,
  description,
  available,
}: {
  name: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  available: boolean;
}) {
  return (
    <Link
      href={`/menu/${slug}`}
      className="card-lux group flex flex-col overflow-hidden rounded-sm"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {!available && (
          <span className="absolute right-3 top-3 bg-ink/80 px-2 py-1 text-[10px] uppercase tracking-widest text-gold">
            Unavailable
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg tracking-wide text-gold-light">{name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{description}</p>
        <p className="mt-auto pt-4 text-sm tracking-wide text-gold">{formatNaira(price)}</p>
      </div>
    </Link>
  );
}
