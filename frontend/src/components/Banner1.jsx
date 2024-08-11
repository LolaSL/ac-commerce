import React from "react";
import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <div style={{ paddingLeft: 0 }} className="py-4">
      <div
        className="p-5 text-center responsive banner"
        style={{
          backgroundImage: `url("/images/banner1.jpg")`,
          height: 700,
          backgroundSize: "cover",
          objectFit: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="banner">
          <h1 className="mb-3 banner-title">
            More reasons to stay with Cool-Commwerce
          </h1>
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-white">
              <p className="banner-paragraph mb-2">
                Desing and project your own air conditioning at your property
              </p>
             
              <Link
                to="/design"
                className="btn btn-outline-light btn-md me-2"
                role="button"
              >
                Design now
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
