import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageUsers } from "@/lib/site";
import { deleteUser, saveUser } from "../actions";

export default async function UsersPage() {
  const session = await auth();
  if (!canManageUsers(session?.user.role)) redirect("/admin");
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl text-gold-light">Staff</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {users.map((u) => (
          <form key={u.id} action={saveUser} className="card-lux space-y-2 p-4">
            <input type="hidden" name="id" value={u.id} />
            <input name="name" defaultValue={u.name} className="w-full px-2 py-1" />
            <input name="email" defaultValue={u.email} className="w-full px-2 py-1" />
            <select name="role" defaultValue={u.role} className="w-full px-2 py-1">
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
            <input name="password" type="password" placeholder="New password (optional)" className="w-full px-2 py-1" />
            <div className="flex gap-3">
              <button className="btn-gold px-3 py-1 text-xs">Save</button>
              {u.email !== session?.user.email && (
                <button formAction={deleteUser.bind(null, u.id)} className="text-xs text-muted">
                  Delete
                </button>
              )}
            </div>
          </form>
        ))}
        <form action={saveUser} className="card-lux space-y-2 p-4">
          <p className="text-xs uppercase tracking-widest text-gold">Invite staff</p>
          <input name="name" placeholder="Name" required className="w-full px-2 py-1" />
          <input name="email" type="email" placeholder="Email" required className="w-full px-2 py-1" />
          <select name="role" className="w-full px-2 py-1">
            <option value="STAFF">STAFF</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
          <input name="password" type="password" placeholder="Password" required className="w-full px-2 py-1" />
          <button className="btn-gold px-3 py-1 text-xs">Create</button>
        </form>
      </div>
    </div>
  );
}
