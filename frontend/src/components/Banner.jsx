import React from "react";
import { Link } from "react-router-dom";


export default function Banner() {
  

  return (
    <div style={{ paddingLeft: 0 }} className="py-4">
      <div
        className="p-5 text-center responsive banner"
      style={{
      backgroundImage: `url("/images/banner.jpg")`,
          height: 700,
          backgroundSize: "cover",
          objectFit: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="banner">
          <h1 className="mb-3 banner-title">Desired Products</h1>
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-white">
              <p className="banner-paragraph mb-2">
                Elevate your comfort wherever you are:
              </p>
              <p className="banner-paragraph mb-2">
                Explore desired innovative air{" "}
              </p>
              <p className="banner-paragraph mb-2">
                Conditioning systems tailored to{" "}
              </p>
              <p className="banner-paragraph mb-2">
                Enchance your living space
              </p>
              <p className="banner-paragraph mb-2">
                Discover the perfect fit for your needs
              </p>
              <Link
                to="/products"
                className="btn btn-outline-light btn-md me-4"
                role="button"
              >
                Shop Now
              </Link>
              <Link
                to="/air-conditioning"
                className="btn btn-outline-light btn-md me-2"
                role="button"
              >
                Learn More
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
