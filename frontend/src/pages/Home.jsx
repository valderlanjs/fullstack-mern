import React from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import NewArrivals from "../components/NewArrivals";
import PopularProducts from "../components/PopularProducts";
import Features from "../components/Features";
import HomeSection from "../components/HomeSection";
import CardsSection from "../components/CardsSection";

const Home = () => {
  return (
    <>
      <Hero />
      <HomeSection />
      <PopularProducts />
      <Features />
     {/**  <NewArrivals /> Card no final da pagina */}
      <CardsSection />
      <Footer />
    </>
  );
};

export default Home;
