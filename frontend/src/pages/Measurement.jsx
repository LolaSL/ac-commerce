import React from "react";
import { Helmet } from "react-helmet-async";
import BtuCalculator from "../components/BtuCalculator";
import UploadFile from "../components/UploadFile";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Measurement = () => {
  return (
    <div>
      <Helmet>
        <title>Measurement Service System</title>
      </Helmet>
      <Container>
        <UploadFile />
        <BtuCalculator />
        <div>
        <Link to="/" className="link-blogs">
          Back to Home
        </Link>
      </div>
      </Container>
    </div>
  );
};

export default Measurement;
