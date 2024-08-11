import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ paddingLeft: 0 }}>
      <div
        className="p-5 text-center bg-image banner "
        style={{
          backgroundImage: `url("/images/hero.jpg")`,
          height: 700,
          backgroundSize: "cover",
          objectFit: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="mask">
          <div className="d-flex justify-content-center align-items-center  h-100">
            <div className="text-white">
              <h1 className="mb-3 hero-title">Featured Products</h1>
              <p className="mb-2 featured-products">
                {" "}
                engineered to provide unparalleled cooling perfomance, energy
                efficiency.
              </p>
              <p className="mb-2 featured-products">
                Designed for your comfort.
              </p>
              <p className="mb-2 featured-products">
                Maximize the comfort of your dwelling, office, condominium, or
                villa with our advanced air systems.
              </p>
              <Link
                to="/products"
                className="btn btn-outline-light btn-md me-2"
                role="button"
              >
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
