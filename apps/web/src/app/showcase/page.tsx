import {
  Button,
  Card,
} from "@/components/ui";

export default function ShowcasePage() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 p-10">
      <h1 className="text-4xl font-bold">
        LuxuryMarket UI Showcase
      </h1>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          Button
        </h2>

        <Button>
          Primary Button
        </Button>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          Card
        </h2>

        <Card className="p-6">
          This is a Card component.
        </Card>
      </section>
    </main>
  );
}
