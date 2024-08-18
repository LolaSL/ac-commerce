import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function BtuCalculator() {

  const [measurementSystem, setMeasurementSystem] = useState("meters");
  const [roomSize, setRoomSize] = useState("");
  const [ceilingHeight, setCeilingHeight] = useState("");
  const [numPeople, setNumPeople] = useState(2);
  const [roomType, setRoomType] = useState("Bedroom");
  const [insulationCondition, setInsulationCondition] = useState("Average");
  const [sunExposure, setSunExposure] = useState("Average");
  const [climate, setClimate] = useState("Average");
  const [btuResult, setBtuResult] = useState(null);


  const handleCalculate = () => {
    let area = parseFloat(roomSize);
    let height = parseFloat(ceilingHeight);

    if (isNaN(area) || isNaN(height)) {
      alert("Please enter valid numbers for room size and ceiling height.");
      return;
    }

    if (measurementSystem === "feet") {
      // Convert to meters
      area *= 0.092903;
      height *= 0.3048;
    }

    // Base BTU = Area in square meters * 500 (standard multiplier)
    let baseBTU = area * 550;

    // Add 1000 BTU/hr for each foot over 8 feet (2.44 meters)
    if (height > 2.44) {
      baseBTU += 1000 * Math.ceil((height - 2.44) / 0.305);
    }

    // Add 600 BTU/hr for each additional person over 2
    if (numPeople > 2) {
      baseBTU += 600 * (numPeople - 2);
    }

    // Add 4000 BTU/hr if the room is a kitchen
    if ((roomType === "Kitchen") & (roomType ==="Entire Second Floor And Above")) {
      baseBTU += 4000;
    }
    else if (roomType === "Entire Second Floor And Above") {
      baseBTU += 6000; // Decrease by 10%
    }

    // Adjust based on sun exposure
    if (sunExposure === "Full sunlight") {
      baseBTU *= 1.2; // Increase by 20%
    } else if (sunExposure === "Heavily shaded") {
      baseBTU *= 0.9; // Decrease by 10%
    }

    // Adjust based on climate
    if (climate === "Hot") {
      baseBTU *= 1.2; // Increase by 10% for hot climates
    } else if (climate === "Cold") {
      baseBTU *= 0.9; // Decrease by 10% for cold climates
    }
    // Adjust based on climate
    if (insulationCondition === "Average") {
        baseBTU *= 1.1; // Increase by 10% for hot climates
      } else if (insulationCondition === "Poor") {
        baseBTU *= 1.2; // Decrease by 20% for cold climates
      }
    setBtuResult(Math.round(baseBTU));
 
  };

  const handleClear = () => {
    setRoomSize("");
    setCeilingHeight("");
    setNumPeople(2);
    setRoomType("Bedroom");
    setInsulationCondition("Average");
    setSunExposure("Average");
    setClimate("Average");
    setBtuResult(null);
  };

  return (
    <Container className="btu-container pt-2 pb-2 rounded">
      <Row className="my-4">
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="measurementSystem">
            <Form.Label>Measurement System:</Form.Label>
            <Form.Control
              as="select"
              value={measurementSystem}
              onChange={(e) => setMeasurementSystem(e.target.value)}
            >
              <option value="meters">Square Meters (m²)</option>
              <option value="feet">Square Feet (ft²)</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="roomSize">
            <Form.Label>Room Size:</Form.Label>
            <Form.Control
              type="number"
              placeholder={`Enter room size in ${
                measurementSystem === "meters" ? "m²" : "ft²"
              }`}
              value={roomSize}
              onChange={(e) => setRoomSize(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="my-4">
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="ceilingHeight">
            <Form.Label>Ceiling Height (m):</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter ceiling height in meters"
              value={ceilingHeight}
              onChange={(e) => setCeilingHeight(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="numberOfPeople">
            <Form.Label>Number of People:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number of people"
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>{" "}
      <Row className="my-4">
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="roomType">
            <Form.Label>Room Type:</Form.Label>
            <Form.Control
              as="select"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option>Bedroom</option>
              <option>Living Room</option>
              <option>Kitchen</option>
              <option>Entire House</option>
              <option>Entire First Floor</option>
              <option>Entire Second Floor And Above</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="insulationCondition">
            <Form.Label>Insulation Condition:</Form.Label>
            <Form.Control
              as="select"
              value={insulationCondition}
              onChange={(e) => setInsulationCondition(e.target.value)}
            >
              <option>Average</option>
              <option>Good (very few leakage or window)</option>
              <option>Poor (many leakage or window )</option>
            </Form.Control>
          </Form.Group>
        </Col>{" "}
      </Row>{" "}
      <Row className="my-4">
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="sunExposure">
            <Form.Label>Sun Exposure:</Form.Label>
            <Form.Control
              as="select"
              value={sunExposure}
              onChange={(e) => setSunExposure(e.target.value)}
            >
              <option>Average</option>
              <option>Full sunlight</option>
              <option>Heavily shaded</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="climate">
            <Form.Label>Climate:</Form.Label>
            <Form.Control
              as="select"
              value={climate}
              onChange={(e) => setClimate(e.target.value)}
            >
              <option>Average (Warsaw)</option>
              <option>Hot (Tel-Aviv)</option>
              <option>Cold (Stockholm)</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="my-4 mb-2">
        <Col xs={12}>
          <Button
            variant="secondary"
            onClick={handleCalculate}
            className="me-2"
          >
            Calculate BTU
          </Button>
          <Button variant="secondary" onClick={handleClear} className="ml-2">
            Clear
          </Button>
        </Col>
      </Row>
      {btuResult !== null && (
        <Row className="my-4">
          <Col xs={12}>
            <h2>Estimated BTU: {btuResult}</h2>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default BtuCalculator;
