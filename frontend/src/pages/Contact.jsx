import React from "react";
import BannerContact from "../components/BannerContact";
import InfoContact from "../components/InfoContact";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollTopButton"


const Contact = () => {
  return (
    <section className="">
      <BannerContact />
      <InfoContact />
      <Footer />
      <ScrollToTopButton />
    </section>
  );
};

export default Contact;
