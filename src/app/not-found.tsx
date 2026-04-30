import { Button, PageHeader, Shell, Slab } from "@/components/primitives";

export default function NotFound() {
  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="404"
          title="We couldn't find that page."
          lede="The link may be broken, or the page may have moved. Head back home or get in touch and we'll point you the right way."
        />

        <div className="mt-12 flex flex-wrap gap-4">
          <Button variant="primary" href="/">
            Back home
          </Button>
          <Button variant="text" href="/contact" arrow>
            Contact us
          </Button>
        </div>
      </Shell>
    </Slab>
  );
}
