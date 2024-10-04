import React from "react";
import { Helmet } from "react-helmet-async";
import Image from "react-bootstrap/Image";

const AcInstallation = () => {
  return (
    <div className="site-container mt-3 pt-3">
      <Helmet>
        <title>Air Conditioning Installation</title>
      </Helmet>
      <h1 className="mb-3 text-center pb-3">
        Where is the best location for your split system air conditioner
        installation?
      </h1>
      <div className="mb-4 text-center pb-4 ac-image">
          <Image
            src="/images/ac-installation1.jpg"
            alt="Air Conditioner"
            className="responsive"
          />
        </div>
      <article>
        <h4>
          The Importance of Proper Installation for Your Split System Air
          Conditioner
        </h4>
        <p className="ac-calculation">
          The placement and installation of your split system air conditioner
          can significantly influence its efficiency and performance. If
          installed in an unsuitable location, it may struggle to adequately
          heat or cool your space.
        </p>
        <p className="ac-calculation">
          To ensure you remain comfortable during the summer and warm in the
          winter, we’ve addressed the crucial question: where is the best
          location for your split system air conditioner?
        </p>
        <p className="ac-calculation">
          Optimal Installation Locations for Your Split System Air Conditioner
          When selecting a site for your split system air conditioner, keep
          these straightforward guidelines in mind: Install Where It’s Most
          Needed Consider where you spend the most time at home. For many, this
          is the lounge area, making a central position in this room an
          excellent choice for installation. If you work from home or have
          trouble sleeping on warm nights, your home office or bedroom might
          also be suitable options.
        </p>
        <p className="ac-calculation">
          Choose a Central Spot in the Room It’s generally beneficial to install
          your split system air conditioner centrally within the room for
          effective heating and cooling of the entire space. Positioning it
          above where you typically sit, like your couch in the lounge or your
          office chair, can enhance its efficiency.
        </p>
        <p className="ac-calculation">
          Install High on the Wall (2+ Meters) Since hot air rises and cool air
          sinks, installing your air conditioner at a height of over 2 meters
          can significantly improve air distribution throughout the room.
        </p>
        <p className="ac-calculation">
          Ensure Adequate Clearance of 15 cm Around the Unit Proper airflow
          around the air conditioner is essential, so make sure there’s at least
          15 cm of clearance on each side.
        </p>
      </article>
      <article>
        <h4 className="mb-4">Whole House vs. Room Heating & Cooling</h4>
        <p className="ac-conditioning">
          Consider whether you intend to heat just one room or your entire home
          when deciding where to install your split system air conditioner. If
          heating a single room, follow the guideline to install it where it’s
          most needed. However, for whole-home heating, opt for a central
          location within the property.
        </p>
        <p className="ac-conditioning">
          Ensure that you select a split system air conditioner with sufficient
          power to effectively heat and cool your entire home. Refer to our
          guide on choosing the right size air conditioner for more information.
        </p>
        <p>
          Installing a Split System Air Conditioner in Your Bedroom If you're
          placing a split air conditioner in your bedroom, avoid positioning it
          too close to your bed, as this could disrupt your sleep by directing
          cold or hot air at you. Alternatively, if it's not centrally located,
          its efficiency may be compromised.
        </p>
        <p>
          To resolve this issue, consider purchasing a unit with adjustable
          louvres, such as those from Carrier’s range of split system air
          conditioners. This allows you to install it centrally—above, to the
          side, or at the foot of your bed—and adjust the airflow direction so
          that it doesn’t blow air directly onto you.{" "}
        </p>
      </article>
      <article>
        <h4 className="mb-3 pb-3">
          Positioning the Outdoor Unit of Your Split System Air Conditioner
        </h4>
        <div className="mb-4 text-center pb-4 ac-image">
          <Image
            src="/images/ac-installation.jpg"
            alt="Air Conditioner"
            className="responsive"
          />
        </div>
        <h5>
          When selecting a location for your split AC’s outdoor unit, consider
          the following:
        </h5>
        <p className="ac-calculation">
          Position it away from direct sunlight whenever possible; the southeast
          or south side of your home, shielded from the afternoon sun, is often
          ideal. Ensure it is located in an open area for proper airflow around
          the unit. The outdoor unit should be easily accessible for maintenance
          and repairs. If feasible, install it on a flat, sturdy surface to
          minimize vibration. Place it as close to the indoor unit as possible
          to maximize efficiency. Deciding where to install your split AC unit
          should be your first consideration when purchasing a new system.
          Taking the time to evaluate the best location and seeking professional
          installation help will enhance your air conditioner's performance and
          reduce operational costs.
        </p>
      </article>
    </div>
  );
};

export default AcInstallation;
