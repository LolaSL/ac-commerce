import React from "react";
import { Helmet } from "react-helmet-async";

const AboutUs = () => {
  return (
    <div className="site-container mt-4 p-4">
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <article className="about mt-4 mb-4">
        <div
          className="p-5 text-center responsive mb-3"
          style={{
            backgroundImage: `url("/images/about-us1.jpg")`,
            height: 450,
            backgroundSize: "cover",
            objectFit: "cover",
            backgroundRepeat: "no-repeat"
          }}
        >
          {" "}
          <h1 className="mb-4  text-white p-4 about-title">
            About Us
          </h1>
        </div>
        <p className="about-paragraph mt-4 pb-2">
          <strong>AC Commerce</strong> is committed to complying with local laws and regulations
          and to applying a strict ethical code of conduct to all employees
        </p>
        <p className="about-paragraph mt-4 pb-2">
          The company believes that ethical management is a tool for responding
          to rapid changes in the global business environment and building trust
          with various stakeholders, including customers,
          shareholders,employees, business partners, and local communities.
        </p>
        <p className="about-paragraph mt-4 pb-4">
          AC Commerce continues to train its employees and use monitoring
          systems while practicing fair and transparent corporate governance.
        </p>
      </article>
      <article className="about mt-4 mb-4">
        <div
          className="p-5 text-center responsive"
          style={{
            backgroundImage: `url("/images/about-us2.jpg")`,
            height: 450,
            backgroundSize: "cover",
            objectFit: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          {" "}
          <h2 className="mb-4 text-center text-white p-4 mission-title">
            Our Mission
          </h2>
        </div>
        <p className="about-paragraph mt-4 pb-4">
         <strong>Our Mission</strong> is to provide innovative and energy-efficient air
          conditioning solutions that enhance comfort and well-being in every
          space we serve. We are committed to delivering exceptional quality,
          unmatched reliability, and superior customer service. By leveraging
          cutting-edge technology and sustainable practices, we aim to create a
          cooler, healthier environment for our clients, while contributing to a
          greener planet.
        </p>
      </article>
      <article className="about mt-4 mb-4">
        <div
          className="p-5 text-center responsive"
          style={{
            backgroundImage: `url("/images/about-us3.jpg")`,
            height: 450,
            backgroundSize: "cover",
            objectFit: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h2 className=" text-center text-white goals-title">Our Goals</h2>
          <p className="goals-paragraph text-white mt-2 pb-4">
          Our goals are to become the trusted partner for all your cooling
            needs, to ensure comfort and satisfaction in every step of your
            journey with us.
          </p>{" "}
        </div>
      </article>
    </div>
  );
};

export default AboutUs;
