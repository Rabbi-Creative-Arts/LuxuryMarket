import { Card } from "@/components/ui";

const categories = [
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👕" },
  { name: "Home & Living", icon: "🏠" },
  { name: "Automotive", icon: "🚗" },
  { name: "Gaming", icon: "🎮" },
  { name: "Health & Beauty", icon: "💄" },
];

export default function FeaturedCategories() {
  return (
    <section
      style={{
        padding: "80px 40px",
        background: "#ffffff",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          marginBottom: "50px",
          color: "#111827",
        }}
      >
        Shop by Category
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
        }}
      >
        {categories.map((category) => (
          <Card key={category.name}>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "10px",
                }}
              >
                {category.icon}
              </div>

              <h3>{category.name}</h3>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}