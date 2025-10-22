import Image from "next/image";
import Herosection from "../components/HeroSection";
import ProductSection from "../components/ProductsSection";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <div>
      <Herosection />
      <ProductSection />
      <Footer />
    </div>
  );
}
