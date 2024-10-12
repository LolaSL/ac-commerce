import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

function SquareCalculator() {
  const [height, setHeight] = useState(0);  
  const [width, setWidth] = useState(0);    
  const [areaFeet, setAreaFeet] = useState(0);  
  const [areaMeters, setAreaMeters] = useState(0);  

  function calculateArea(e) {
    e.preventDefault();

   
    const heightValue = parseFloat(height);
    const widthValue = parseFloat(width);

   
    const areaInFeet = heightValue * widthValue;
    setAreaFeet(areaInFeet);

  
    const areaInMeters = areaInFeet * 0.092903;
    setAreaMeters(areaInMeters);
  }

  return (
    <Container className="square-container">
      <h2 className="mt-4 mb-4">Square Feet & Square Meters Calculator</h2>

      <Form onSubmit={calculateArea} className="mt-4 mb-4">
        <Form.Group controlId="height">
          <Form.Label>Height</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="width">
          <Form.Label>Width</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="btn mt-2">
          Calculate Area
        </Button>
      </Form>

      {areaFeet > 0 && (
        <div className="result">
          <h3>Results:</h3>
          <p>Area in Square Feet: {areaFeet.toFixed(2)} sq ft</p>
          <p>Area in Square Meters: {areaMeters.toFixed(2)} sq m</p>
        </div>
      )}
    </Container>
  );
}

export default SquareCalculator;
