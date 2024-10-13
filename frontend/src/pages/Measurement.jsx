import React from "react";
import { Helmet } from "react-helmet-async";
import BtuCalculator from "../components/BtuCalculator";
import UploadFile from "../components/UploadFile";
import { Container } from "react-bootstrap";

const Measurement = () => {
  return (
    <div>
      <Helmet>
        <title>Measurement Service System</title>
      </Helmet>
      <Container>
        <UploadFile />
        <BtuCalculator />
      </Container>
    </div>
  );
};

export default Measurement;
