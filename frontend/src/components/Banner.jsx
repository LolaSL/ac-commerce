import React from "react";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";



export default function Banner() {
  return (
    <div style={{ paddingLeft: 0 }} className="py-4">
        <div className="banner">
        <h1 className="mb-3 banner-title text-center">Elevate your comfort wherever you are:</h1>
        <Image className="p-2 text-center responsive  mb-4" src="/images/banner.jpg" alt="Banner" />
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text">
              <h3 className="banner-paragraph mb-4">
                Discover the perfect fit for your needs
            </h3>
            <div className="d-flex justify-content-center">
                <Link
                  to="/air-conditioning"
                  className="btn btn-secondary btn-md mb-2"
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
