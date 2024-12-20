import React from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import NewArrivals from "../components/NewArrivals";
import PopularProducts from "../components/PopularProducts";

const Home = () => {
  return (
    <>
      <Hero />
      <NewArrivals />
      <PopularProducts />
      <Footer />
    </>
  );
};

export default Home;
