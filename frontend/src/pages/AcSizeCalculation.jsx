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
          What is a BTU? The British Thermal Unit, or BTU, is an energy unit. It
          is approximately the energy needed to heat one pound of water by 1
          degree Fahrenheit. 1 BTU = 1,055 joules, 252 calories, 0.293
          watt-hours, or the energy released by burning one match. 1 watt is
          approximately 3.412 BTU per hour.
        </p>
        <p>
          BTU is often used as a point of reference for comparing different
          fuels. Even though they're physical commodities and are quantified
          accordingly, such as by volume or barrels, they can be converted to
          BTUs depending on the energy or heat content inherent in each
          quantity. BTU as a unit of measurement is more useful than physical
          quantity because of fuel's intrinsic value as an energy source. This
          allows many different commodities with intrinsic energy properties,
          such as natural gas and oil, to be compared and contrasted.
        </p>
        <p>
          BTU can also be used pragmatically as a point of reference for the
          amount of heat that an appliance generates; the higher the BTU rating
          of an appliance, the greater the heating capacity. As for air
          conditioning in homes, even though ACs are meant to cool homes, BTUs
          on the technical label refer to how much heat the air conditioner can
          remove from their respective surrounding air..
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
          Above is a chart which will tell you the BTUs required for different
          sizes of rooms. Simply work out how big your room is (measure the
          length of your room and multiply it by the width) and then you will
          know roughly how many BTUs your air conditioner requires.
        </p>
        <h3 className="mb-3 text-center pt-4">
          Air Conditioner BTU Calculator
        </h3>
        <BTUCalculator />
      </article>
    </div>
  );
};

export default AcSizeCalculation;
