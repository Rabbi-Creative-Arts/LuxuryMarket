export default function HomePage() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        backgroundColor: "#0f172a",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        LuxuryMarket
      </h1>

      <p style={{ fontSize: "1.2rem" }}>
        The Future AI-Powered Marketplace
      </p>
    </main>
  );
}