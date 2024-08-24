import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";


export default function Banner() {
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate("/signin?redirect=/upload-pdf");
  };
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
            More reasons to stay with AC Commwerce
          </h1>
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-white">
              <p className="banner-paragraph mb-2">
                Desing and project your own air conditioning at your property
              </p>
             
              <Button
                to="/quote/:id"
                className="btn btn-outline-light btn-md"
                role="button"
                onClick={checkoutHandler}
              >
               Desing Now
              </Button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
