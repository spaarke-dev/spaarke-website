import type { Metadata } from "next";
import { Button, PageHeader, Shell, Slab } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Spaarke.",
};

export default function SignIn() {
  return (
    <Slab tone="dark" className="flex-1">
      <Shell>
        <PageHeader
          eyebrow="Sign in"
          title="Welcome back."
          lede="Sign-in is rolling out to early access partners. If you're an early access partner, your IT team will receive instructions ahead of your kickoff."
        />

        <div className="mt-12 flex flex-wrap gap-4">
          <Button variant="primary" href="/access-request">
            Get access
          </Button>
          <Button variant="text" href="/contact" arrow>
            Contact us
          </Button>
        </div>
      </Shell>
    </Slab>
  );
}
