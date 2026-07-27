export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#111827",
        color: "white",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>LuxuryMarket</h2>

      <nav
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        <a href="/">Home</a>
        <a href="#">Products</a>
        <a href="#">Vendors</a>
        <a href="#">Dashboard</a>
      </nav>
    </header>
  );
}