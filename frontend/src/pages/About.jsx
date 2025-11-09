import React from "react";

import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import { Link } from "react-router-dom";

import madeira3 from "../assets/imgAbout/madeira3.jpg";
import aboutImg from "../assets/about.png";
import dof from "../assets/imgAbout/dof.jpg";
import FSC from "../assets/imgAbout/FSC.jpg";
import Footer from "../components/Footer";
import ImageTextSectionsPage from "../components/sectionAboutOnePage"
import AboutSection from "../components/aboutSection"
import ServicesSection from "../components/serviceSection"
import AboutBannerSection from "../components/AboutBanner"
import CertificationSection from "../components/certificationSection"
const About = () => {
  {
    /*const statistics = [
    { 
        label: "Sua satisfação é nossa prioridade.",
        value: "Atendimento"
    },
    {
        label: "Qualidade incomparável em cada pedaço de madeira.",
        value: "Qualidade"
    },
    {
        label: "Pontualidade e cuidado em cada passo do trajeto.",
        value: "Entrega"
    }
  ];
*/
  }

  return (
    <>
      
      <AboutSection/>
      <ImageTextSectionsPage />
      <ServicesSection />
      <AboutBannerSection />
      <CertificationSection />
      <Footer />
    </>
  );
};

export default About;
