import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import PopularBrands from "@/components/home/PopularBrands";
import TrendingProducts from "@/components/home/TrendingProducts";
import WhyLuxuryMarket from "@/components/home/WhyLuxuryMarket";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />

      <FeaturedCategories />

      <PopularBrands />

      <TrendingProducts />

      <WhyLuxuryMarket />

      <Testimonials />
    </>
  );
}
