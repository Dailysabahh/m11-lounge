import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logoutAction } from "./actions";
import { canManageContent, canManageUsers } from "@/lib/site";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/menu", label: "Menu", content: true },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/promotions", label: "Promotions", content: true },
  { href: "/admin/settings", label: "Website", content: true },
  { href: "/admin/users", label: "Staff", users: true },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // login page uses this layout too — skip chrome there via parallel? 
  // We'll detect by checking children is not enough. Use a nested group instead.
  // Login is under /admin/login; still wrapped. Handle in page... 
  // Better: show chrome only when authenticated.
  if (!session?.user) {
    return <>{children}</>;
  }
  const role = session.user.role;
  const visible = links.filter((l) => {
    if (l.users) return canManageUsers(role);
    if (l.content) return canManageContent(role);
    return true;
  });

  return (
    <div className="flex min-h-screen bg-ink">
      <aside className="hidden w-56 shrink-0 border-r border-gold/20 p-5 md:block">
        <Link href="/admin" className="font-display text-xl tracking-[0.2em] text-gold">
          M11
        </Link>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">{role}</p>
        <nav className="mt-8 flex flex-col gap-2">
          {visible.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-cream hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="mt-10">
          <button className="text-xs uppercase tracking-widest text-muted hover:text-gold">
            Sign out
          </button>
        </form>
        <Link href="/" className="mt-4 block text-xs text-gold">
          View site
        </Link>
      </aside>
      <div className="flex-1">
        <div className="flex gap-3 overflow-x-auto border-b border-gold/20 px-4 py-3 md:hidden">
          {visible.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap text-xs text-gold">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
