import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";

export default function Banner() {
  const navigate = useNavigate();

  const checkoutHandler = (e) => {
    e.preventDefault();
    navigate("/signin?redirect=/uploadfile");
  };
  return (
    <div style={{ paddingLeft: 0 }} className="py-4">
      <div className="banner">
        <h1 className="mb-3 banner1-title text-center">
          Stay with AC Commerce
        </h1>{" "}
        <Image
          className="p-2 text-center responsive  mb-4"
          src="/images/banner1.jpg"
          alt="Header"
        />
        <div className="d-flex justify-content-center align-items-center h-80">
          <div className="text">
            <h3 className="banner1-paragraph mb-2">
              Design and project your own air conditioning at your property
            </h3>
            <div className="d-flex justify-content-center">
              <Button
                to="/uploadfile"
                className="btn btn-secondary btn-md"
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
