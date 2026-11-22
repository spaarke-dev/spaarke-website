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
  { label: "Contacts", href: "/admin/contacts", ready: true },
  { label: "Organizations", href: "/admin/organizations", ready: false },
  { label: "Campaigns", href: "/admin/campaigns", ready: true },
  { label: "Triage", href: "/admin/triage", ready: false },
  { label: "Mailboxes", href: "/admin/mailboxes", ready: false },
  { label: "Import", href: "/admin/import", ready: true },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await requireAdmin();

  if (access.status === "forbidden") {
    return (
      <div data-tone="light" className="flex-1 bg-bg text-fg">
        <main className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-2xl font-semibold">Access denied</h1>
          <p className="mt-4 text-fg-mid">
            You are signed in, but your account does not have the admin role.
          </p>
          <a
            className="mt-6 inline-block underline"
            href="/.auth/logout?post_logout_redirect_uri=/"
          >
            Sign out
          </a>
        </main>
      </div>
    );
  }

  return (
    <div data-tone="light" className="flex-1 bg-bg text-fg">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav
          aria-label="Admin"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line-strong pb-4 text-sm"
        >
          {NAV.map((item) =>
            item.ready ? (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.href}
                className="text-fg-low"
                title="Coming in a later release"
              >
                {item.label}
              </span>
            ),
          )}
          <span className="ml-auto flex items-center gap-4">
            <span
              className="hidden text-fg-mid sm:inline"
              title={access.principal.roles.join(", ")}
            >
              {access.principal.userDetails}
            </span>
            <a
              className="hover:underline"
              href="/.auth/logout?post_logout_redirect_uri=/"
            >
              Sign out
            </a>
          </span>
        </nav>
        <div className="pt-8">{children}</div>
      </div>
    </div>
  );
}
