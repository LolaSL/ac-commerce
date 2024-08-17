import React from "react";
import { Helmet } from "react-helmet-async";
import BTUCalculator from "../components/BtuCalculator.jsx";

const AcSizeCalculation = () => {
  return (
    <div className="site-container mt-3 pt-3">
      <Helmet>
        <title>Air Conditioner Size Calculation</title>
      </Helmet>
      <h1 className="mb-3 text-center pb-3">
        Air Conditioner Size Calculation
      </h1>
      <h2 className="mb-3 text-center pb-3">What is BTU?</h2>
      <article>
        <p className="ac-calculation">
         The BTU is the amount of heat required to raise the temperature of one
          pound of liquid water by one degree from 60° to 61° Fahrenheit at a
          constant pressure of one atmosphere. 
        </p>{" "}
        <div className="mb-4 text-center pb-4 ac-image h-50">
          <img
            src="/images/btu3.jpg"
            alt="Air Conditioners BTU"
            className="img"
          />{" "}
        </div>
        <p className="ac-calculation">
          Air conditioners come in a range of sizes, designed to cool different
          volumes of air. The rating of an air conditioner is measured in BTUs,
          and you need to know how many BTUs will be required to cool your room.
          Below is a chart which will tell you the BTUs required for different
          sizes of rooms. Simply work out how big your room is (measure the
          length of your room and multiply it by the width) and then you will
          know roughly how many BTUs your air conditioner requires.
        </p>
        <h3 className="mb-3 text-center pt-4">Air Conditioner BTU Calculator</h3>
        <BTUCalculator/>
        {/* <div className="mb-4 text-center pb-4 ac-image ">
          <img
            src="/images/btu1.jpg"
            alt="AC BTU Calculation"
            className="responsive"
          />{" "}
        </div>
        <p className="ac-calculation">
          Technical Heat Load Calculation to determine the right air conditioner
          for your needs A more technical way to calculate the required air
          conditioner, is to take the m2 x 550 (assuming a 2.4 metre ceiling
          height); or take the (btu / 550) x 2.4 (2.4 metres is a standard
          ceiling height; please note that this could be bigger number). This
          method will tell you if a specific air conditioner will work in a room
          in standard or normal conditions.
        </p> */}
      </article>
    </div>
  );
};

export default AcSizeCalculation;
