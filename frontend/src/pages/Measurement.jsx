import React from "react";
import { Helmet } from "react-helmet-async";
import BtuCalculator from "../components/BtuCalculator";
import UploadFile from "../components/UploadFile";
import SquareCalculator from "../components/SquareCalculator";
import { Container } from "react-bootstrap";

const Measurement = () => {
  return (
    <div>
      <Helmet>
        <title>Measurement service system</title>
      </Helmet>
      <Container>
        <UploadFile />
        <SquareCalculator />
        <BtuCalculator />
      </Container>
    </div>
  );
};

export default Measurement;
