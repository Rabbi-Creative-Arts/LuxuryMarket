import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <FeaturedVendors />
      <Footer />
    </>
  );
}