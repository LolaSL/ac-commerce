import React from "react";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";


export default function Header() {
  return (
    <header style={{ paddingLeft: 0 }}>
      <div className="mask">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text">
            <h1 className="mb-3 hero-title text-center">Featured Products</h1>
            <Image
              className="p-2 text-center responsive  mb-4"
              src="/images/hero.jpg"
              alt="Hero"
            />
            <p className="mb-2 featured-products">
              {" "}
              engineered to provide unparalleled cooling perfomance, energy
              efficiency. Designed for your comfort. Maximize the comfort of
              your dwelling, office, condominium, or villa with our advanced air
              systems.
            </p>
            <div className="d-flex justify-content-center">
              <Link
                to="/products"
                className="btn btn-secondary btn-md me-2"
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
