import { Button } from "@/components/ui";

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "#f8fafc",
        padding: "60px 20px",
      }}
    >
      <h1
        style={{
          fontSize: "3.5rem",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "20px",
        }}
      >
        Welcome to LuxuryMarket
      </h1>

      <p
        style={{
          maxWidth: "700px",
          fontSize: "1.25rem",
          color: "#4b5563",
          marginBottom: "32px",
          lineHeight: 1.6,
        }}
      >
        Buy, sell, and discover products through an AI-powered marketplace
        designed for customers, vendors, and businesses.
      </p>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button>Explore Marketplace</Button>

        <Button variant="outline">
          Become a Vendor
        </Button>
      </div>
    </section>
  );
}