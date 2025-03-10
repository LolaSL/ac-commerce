import React from "react";
import { Helmet } from "react-helmet-async";
import { Container } from "react-bootstrap";
const AboutUs = () => {
  return (
    <Container className="site-container-about mt-4 p-4">
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <article className="about mt-4 mb-4">
        <div
          className="p-5 text-center responsive-image-about rounded mb-3"
          style={{
            backgroundImage: `url("/images/about-us1.jpg")`,
            MaxHeight: "100%",
          }}
        ></div>
        <h3 className="about-paragraph p-2">
          <strong>AC Commerce</strong> is committed to complying with local laws
          and regulations and to applying a strict ethical code of conduct to
          all employees
        </h3>
        <h3 className="about-paragraph mt-4 pb-2">
          The company believes that ethical management is a tool for responding
          to rapid changes in the global business environment and building trust
          with various stakeholders, including customers, shareholders,
          employees, business partners, and local communities.
        </h3>
        <h3 className="about-paragraph mt-4 pb-4">
          AC Commerce continues to train its employees and use monitoring
          systems while practicing fair and transparent corporate governance.
        </h3>
      </article>
      <article className="about mt-4 mb-4">
        <div
          className="p-5 text-center responsive-image-about rounded "
          style={{
            backgroundImage: `url("/images/about-us2.jpg")`,
            MaxHeight: "100%",
          }}
        ></div>
        <h3 className="about-paragraph mt-4">
          <strong>Our Mission</strong> is to provide innovative and
          energy-efficient air conditioning solutions that enhance comfort and
          well-being in every space we serve. We are committed to delivering
          exceptional quality, unmatched reliability, and superior customer
          service. By leveraging cutting-edge technology and sustainable
          practices, we aim to create a cooler, healthier environment for our
          clients, while contributing to a greener planet.
        </h3>
      </article>
      <article className="about mt-4 mb-4">
        <div
          className="p-5 text-center responsive-image-about rounded "
          style={{
            backgroundImage: `url("/images/about-us3.jpg")`,
            MaxHeight: "100%",
          }}
        ></div>
        <h3 className="goals-paragraph  mt-2 pb-4">
          <strong>Our Goals</strong> is to make every home and business
          environment more comfortable, with the perfect air conditioning
          solution that suits your specific requirements—whether you're cooling
          a small room or an entire building. We are committed to helping our
          customers find the right product, providing expert recommendations,
          and ensuring energy efficiency to reduce both environmental impact and
          energy bills.
        </h3>
        <h3 className="goals-paragraph  mt-2 pb-4">
          We believe in sustainability, quality, and customer satisfaction, and
          we strive to offer the best in cooling technology to keep you cool all
          year round.
        </h3>{" "}
      </article>
    </Container>
  );
};

export default AboutUs;
