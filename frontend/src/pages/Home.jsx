import React from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import NewArrivals from "../components/NewArrivals";
import PopularProducts from "../components/PopularProducts";
import Features from "../components/Features";
import HomeSection from "../components/HomeSection";

const Home = () => {
  return (
    <>
      <Hero />
      <HomeSection />
      <PopularProducts />
      <Features />
      <NewArrivals />
      <Footer />
    </>
  );
};

export default Home;
