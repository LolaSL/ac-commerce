import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";

export default function Banner2() {
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate("/signin?redirect=/ac-installation");
  };
  return (
    <div style={{ paddingLeft: 0 }} className="py-4">
      <div className="banner">
        <h1 className="mb-3 banner1-title text-center">
          Proper Installation for Your Air Conditioner
        </h1>{" "}
        <Image
          className="p-2 text-center responsive  mb-4"
          src="/images/banner2.jpg"
          alt="Header"
        />
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text">
            <h3 className="banner1-paragraph mb-2">
              Where is the best location for your split system air conditioner
              installation?
            </h3>
            <div className="d-flex justify-content-center">
              <Button
                to="/upload-pdf"
                className="btn btn-secondary btn-md"
                role="button"
                onClick={checkoutHandler}
              >
                Check Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
