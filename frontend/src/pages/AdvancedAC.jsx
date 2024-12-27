import React from "react";
import { Helmet } from "react-helmet-async";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";

const AdvancedAC = () => {
  return (
    <div className="site-container mt-3 pt-3">
      <Helmet>
        <title>Advanced Air Conditioning</title>
      </Helmet>
      <article>
        <h1 className="mb-3 p-3">
          Finding The Perfect Commercial HVAC-R System and Indoor Air Quality
          Solution.
        </h1>
        <p className="ac-conditioning">
          Ensuring your Air Conditioning and Indoor Air Quality system is the
          right design, size, and setup for your business is the next step. Here
          at AC Commerce, we’re happy to provide a free quote, and part of this
          is making sure you are investing in the right sized system for your
          business. We also welcome all tender prospects from small commercial
          properties to large multifaceted installations targeting all sectors;
          education (schools, childcare, day care and universities),
          manufacturing, food processing, hospital, health and aged care, and
          government. There are many different variables that go into answering
          this question, and our experienced Estimators, Engineers and Project
          Managers take these into account before making any recommendations, as
          having a well planned design allows you to be cool and comfortable
          whilst running the most cost effective and energy efficient Air
          Conditioning and Indoor Air Quality system.
        </p>

        <div className="mb-4 text-center pb-4">
          <Image
            src="/images/ac5.jpg"
            alt="Air Conditioning"
            className="responsive rounded"
          />
        </div>
      </article>
      <article>
        <h3 className="mb-2 p-4">
          What type of HVAC-R, Indoor Air Quality System is Right for your
          Business?
        </h3>
        <p className="ac-conditioning">
          Naturally, we will guide you on the ideal commercial HVAC-R, Indoor
          Air Quality system setup, one that’s perfect for your business, the
          country climate, and something affordable for your budget. As part of
          our free quote, we will also explain and educate you on the
          differences between Air Conditioning systems, zone management systems,
          Indoor Air Quality solutions and leading brands, such as Daikin, LG,
          Senville, Samsung, and more.
        </p>
      </article>
      <article>
        <h3 className="mb-2 p-4">
          Choosing The Right Commercial Air Conditioning Team
        </h3>
        <div className="mb-4 text-center">
          <Image
            src="/images/ac6.jpg"
            alt="Air Conditioning team"
            className="responsive rounded"
          />
        </div>
        <p className="ac-conditioning">
          Depending on the Air Conditioning system you decide on, commercial Air
          Conditioning can be a significant investment. It is important to have
          the Air Conditioning system designed and installed by a qualified and
          licensed company, this will ensure maximum life span and active
          warranty. The company and tradespeople you choose can make all the
          difference to your Air Conditioning Installation. You’ll want to be
          sure that they’re highly experienced and genuinely care about you, and
          your business. We’ve been installing HVAC-R and Indoor Air Quality
          systems; in businesses throughout Israel.
        </p>
        <p className="ac-conditioning">
          Our team of Engineers, Estimators, Project Managers and Technicians,
          work extensively in Commercial Air Conditioning have the experience,
          expertise and qualifications necessary to work with you, Facilities
          Managers, Project Managers, and Builders to deliver a high-quality
          project on time and as discussed. So it’s imperative that we only hire
          the best technicians who deliver a quality installation on time and as
          discussed.
        </p>
        <p className="ac-conditioning">
          If your air conditioner has problems, start by checking the air filter
          and replacing it if it's dirty. If that doesn't solve the problem,
          check for leaks in the ductwork or refrigerant line. Finally, make
          sure that the thermostat is set correctly. If you're still having
          problems, contact a professional for help.
        </p>
        <h3 className="mb-2 p-4">
          When you work with the commercial team at AC Commerce, you will:
        </h3>
        <ul className="ac-conditioning">
          <li>
            Get a free quote and we will only recommend the perfect Air
            Conditioning system setup for your needs.
          </li>
          <li>
            A hassle free process from initial consultation through to
            completion.{" "}
          </li>
          <li>
            Have a team that works to your schedule, arriving on the day and
            time that suits you.
          </li>
          <li>
            Feel confident in our qualified and licensed experience, highly
            skilled and fully insured technicians.
          </li>
          <li>
            Have peace of mind as we only use high quality brands and materials
            that meet International Standards.
          </li>
          <li>
            Have the opportunity for ongoing preventative maintenance and
            discounted maintenance contracts
          </li>
        </ul>
      </article>
      <div className=" mt-4 mb-4">
        <Link to="/" className="link-blogs">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AdvancedAC;
