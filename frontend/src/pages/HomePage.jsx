import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header.jsx";
import Banner from "../components/Banner.jsx";
import Banner1 from "../components/Banner1.jsx";
import Hero from "../components/Hero.jsx";
import Header1 from "../components/Header1.jsx";
import Hero1 from "../components/Hero1.jsx";
import Header2 from "../components/Header2.jsx";

const HomePage = () => {
  return (
    <div >
        <Helmet>
          <title>AC Commerce</title>
      </Helmet> 
      <Header2 />
      <Header />
       <Header1 />
      <Banner />
      <Banner1 />
      <Hero />
      <Hero1/>
    </div> 
  );
};

export default HomePage;
