import Hero from "../components/Hero/Hero";
import Navbar from "../components/Navbar/Navbar";
import Features from "../components/Features/Features";
import Workspace from "../components/Workspace/Workspace";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import Testimonials from "../components/Testimonials/Testimonials";
const Landing = () => {
  return (
    <>
      <Navbar />
      <Hero></Hero>
      <Features></Features>
      <HowItWorks></HowItWorks>
      <Workspace></Workspace>
      <Testimonials></Testimonials>
    </>
  );
};

export default Landing;