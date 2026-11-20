import { canSeeInvestor, requireAdmin } from "@/lib/market/auth";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const access = await requireAdmin("/admin");
  if (access.status !== "ok") return null;
  const { principal } = access;

  return (
    <section>
      <h1 className="text-2xl font-semibold">Market access</h1>
      <p className="mt-4 text-neutral-600">Signed in as {principal.userDetails}.</p>
      <p className="mt-2 text-sm text-neutral-500">
        Roles: {principal.roles.filter((r) => r !== "authenticated").join(", ") || "none"}.
        {canSeeInvestor(principal) ? " Investor records are visible." : " Investor records are hidden."}
      </p>
    </section>
  );
}
