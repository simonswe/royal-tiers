import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { logoutAdmin } from "@/app/actions/auth";
import { LogoutButton } from "@/components/logout-button";
import { linkGhostSm } from "@/lib/link-button-classes";

export async function AdminNav() {
  const admin = await isAdmin();
  if (admin) {
    return (
      <form action={logoutAdmin} className="inline">
        <LogoutButton />
      </form>
    );
  }
  return (
    <Link href="/admin/login" className={linkGhostSm}>
      Admin
    </Link>
  );
}
