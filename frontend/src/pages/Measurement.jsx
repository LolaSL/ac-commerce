import React from "react";
import BtuCalculator from "../components/BtuCalculator";
import UploadFile from "../components/UploadFile";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Measurement = () => {
  return (
    <div>
      <Container>
        <UploadFile />
        <BtuCalculator />
        <div className=" mt-4 mb-4">
        <Link to="/" className="btn btn-secondary">
          Back to Home
        </Link>
      </div>
      </Container>
    </div>
  );
};

export default Measurement;
