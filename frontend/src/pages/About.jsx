import Footer from "../components/Footer";
import ImageTextSectionsPage from "../components/sectionAboutOnePage"
import AboutSection from "../components/aboutSection"
import ServicesSection from "../components/serviceSection"
import AboutBannerSection from "../components/AboutBanner"
import CertificationSection from "../components/certificationSection"
import ScrollToTopButton from "../components/ScrollTopButton"
const About = () => {

  return (
    <>
      
      <AboutSection/>
      <ImageTextSectionsPage />
      <ServicesSection />
      <AboutBannerSection />
      <CertificationSection />
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default About;
