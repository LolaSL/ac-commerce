import React from "react";
import { Helmet } from "react-helmet-async";
import Banner from "../components/Banner.jsx";
import Banner1 from "../components/Banner1.jsx";
import Hero from "../components/Hero.jsx";
import Header1 from "../components/Header1.jsx";
import Header2 from "../components/Header2.jsx";
import Banner2 from "../components/Banner2.jsx";


const HomePage = () => {
  return (
    
    <div className="container">
      <Helmet>
        <title>AC Commerce</title>
      </Helmet>
      <Header2 />
      <Header1 />
      <Banner />
      <Banner1 />
      <Banner2/>
      <Hero />
    </div>
  );
};

export default HomePage;
