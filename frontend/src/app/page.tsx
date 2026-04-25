import FeaturesSection from "@/components/layout/Banner";
import HeroSection from "@/components/layout/Herosection";
import TestimonialSection from "@/components/layout/Testimonial";
import PlansPage from "./plans/page";

export default function Home(){
  return(
    <div>
      <HeroSection/>
      <FeaturesSection/>
      <TestimonialSection/>
      <PlansPage/>
    </div>
  )
}