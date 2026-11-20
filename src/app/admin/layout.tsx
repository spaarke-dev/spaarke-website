import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/market/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Sections arrive with later tasks; until then they show as plain text.
const NAV: { label: string; href: string; ready: boolean }[] = [
  { label: "Home", href: "/admin", ready: true },
  { label: "Contacts", href: "/admin/contacts", ready: false },
  { label: "Organizations", href: "/admin/organizations", ready: false },
  { label: "Campaigns", href: "/admin/campaigns", ready: false },
  { label: "Triage", href: "/admin/triage", ready: false },
  { label: "Mailboxes", href: "/admin/mailboxes", ready: false },
  { label: "Import", href: "/admin/import", ready: false },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const access = await requireAdmin();

  if (access.status === "forbidden") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="mt-4 text-neutral-600">
          You are signed in, but your account does not have the admin role.
        </p>
        <a className="mt-6 inline-block underline" href="/.auth/logout?post_logout_redirect_uri=/">
          Sign out
        </a>
      </main>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav
        aria-label="Admin"
        className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-neutral-200 pb-4 text-sm"
      >
        {NAV.map((item) =>
          item.ready ? (
            <Link key={item.href} href={item.href} className="font-medium hover:underline">
              {item.label}
            </Link>
          ) : (
            <span key={item.href} className="text-neutral-400" title="Coming in a later release">
              {item.label}
            </span>
          ),
        )}
        <a className="ml-auto hover:underline" href="/.auth/logout?post_logout_redirect_uri=/">
          Sign out
        </a>
      </nav>
      <div className="pt-8">{children}</div>
    </div>
  );
}
