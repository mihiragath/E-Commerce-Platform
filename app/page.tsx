import Image from "next/image";
import Herosection from "../components/HeroSection";
import ProductSection from "../components/ProductsSection";
export default function Home() {
  return (
    <div>
      <Herosection />
      <ProductSection />
    </div>
  );
}
