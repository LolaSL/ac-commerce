import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

function BtuCalculator() {
  const [measurementSystem, setMeasurementSystem] = useState("meters");
  const [rooms, setRooms] = useState([{ name: "Bedroom 1", size: "", btu: 0 }]);
  const [ceilingHeight, setCeilingHeight] = useState("");
  const [numPeople, setNumPeople] = useState(2);
  const [insulation, setInsulation] = useState({
    Average: false,
    Good: false,
    Poor: false,
  });
  const [sunExposure, setSunExposure] = useState({
    Average: false,
    FullSunlight: false,
    HeavilyShaded: false,
  });
  const [climate, setClimate] = useState({
    Average: false,
    Hot: false,
    Cold: false,
  });
  const [btuResults, setBtuResults] = useState([]);
  const [product, setProduct] = useState([]);

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const addRoom = () => {
    setRooms([...rooms, { name: "", size: "", btu: 0 }]);
  };

  const removeRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };

  const handleInsulationChange = (e) => {
    setInsulation({ ...insulation, [e.target.name]: e.target.checked });
  };

  const handleSunExposureChange = (e) => {
    setSunExposure({ ...sunExposure, [e.target.name]: e.target.checked });
  };

  const handleClimateChange = (e) => {
    setClimate({ ...climate, [e.target.name]: e.target.checked });
  };

  const handleCalculate = async () => {
    const results = [];
    const fetchedProducts = [];

    for (const room of rooms) {
      let area = parseFloat(room.size);
      let height = parseFloat(ceilingHeight);

      if (isNaN(area) || isNaN(height)) {
        alert("Please enter valid numbers for room size and ceiling height.");
        return;
      }

      if (measurementSystem === "feet") {
        area *= 0.092903;
        height *= 0.3048;
      }

      let baseBTU = area * 500;

      if (height > 2.44) {
        baseBTU += 1000 * Math.ceil((height - 2.44) / 0.305);
      }

      if (numPeople > 1) {
        baseBTU += 600 * (numPeople - 1);
      }
      if (
        rooms.name === "Kitchen" ||
        rooms.name === "Entire Second Floor And Above"
      ) {
        baseBTU += 4000;
      }
      if (insulation.Poor) {
        baseBTU *= 1.3;
      } else if (insulation.Good) {
        baseBTU *= 1.1;
      } else if (insulation.Average) {
        baseBTU *= 1.2;
      }

      if (sunExposure.FullSunlight) {
        baseBTU *= 1.65;
      } else if (sunExposure.HeavilyShaded) {
        baseBTU *= 1.0;
      }

      if (climate.Hot) {
        baseBTU *= 1.65;
      } else if (climate.Cold) {
        baseBTU *= 1.0;
      } else if (climate.Average) {
        baseBTU *= 1.2;
      }

      const roundedBTU = Math.round(baseBTU);
      results.push(roundedBTU);

      try {
        const { data } = await axios.get(`/api/products/btu/${roundedBTU}`, {
          params: {
            insulation: Object.keys(insulation).filter(
              (key) => insulation[key]
            ),
            sunExposure: Object.keys(sunExposure).filter(
              (key) => sunExposure[key]
            ),
            climate: Object.keys(climate).filter((key) => climate[key]),
          },
        });
        fetchedProducts.push(data);
      } catch (error) {
        console.error("Product not found for room:", error);
        fetchedProducts.push(null);
      }
    }

    setBtuResults(results);
    setProduct(fetchedProducts);
  };

  const handleClear = () => {
    setRooms([{ name: "Bedroom", size: "", btu: 0 }]);
    setCeilingHeight("");
    setNumPeople(2);
    setInsulation({ Average: false, Good: false, Poor: false });
    setSunExposure({
      Average: false,
      FullSunlight: false,
      HeavilyShaded: false,
    });
    setClimate({ Average: false, Hot: false, Cold: false });
    setBtuResults([]);
    setProduct([]);
  };

  return (
    <Container className="btu-container mt-4 mb-4 rounded">
      <h2>BTU Calculator</h2>
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
      </Row>
      <Row>
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
      </Row>
      {rooms.map((room, index) => (
        <Row key={index} className="my-4">
          <Col xs={12} md={6} lg={4}>
            <Form.Group controlId={`roomType-${index}`}>
              <Form.Label>Room Type {index + 1}:</Form.Label>
              <Form.Control
                as="select"
                value={room.name}
                onChange={(e) =>
                  handleRoomChange(index, "name", e.target.value)
                }
              >
                <option>Bedroom 1</option>
                <option>Bedroom 2</option>
                <option>Bedroom 3</option>
                <option>Bedroom 4</option>
                <option>Bedroom 5</option>
                <option>Living Room</option>
                <option>Kitchen</option>
                <option>Bathroom</option>
                <option>Terracce</option>
                <option>Entire House</option>
                <option>Entire First Floor</option>
                <option>Entire Second Floor And Above</option>
                <option>Open Office Area</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Form.Group controlId={`roomSize-${index}`}>
              <Form.Label>Room Size ({measurementSystem}²):</Form.Label>
              <Form.Control
                type="number"
                placeholder={`Enter room size in ${
                  measurementSystem === "meters" ? "m²" : "ft²"
                }`}
                value={room.size}
                onChange={(e) =>
                  handleRoomChange(index, "size", e.target.value)
                }
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Button
              variant="danger"
              onClick={() => removeRoom(index)}
              className="mt-4"
            >
              Delete
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="primary" onClick={addRoom} className="mb-3 mt-4">
        Add Desired Room
      </Button>
      <h4>Insulation Condition</h4>
      <Form.Check
        type="checkbox"
        label="Average"
        name="Average"
        checked={insulation.Average}
        onChange={handleInsulationChange}
      />
      <Form.Check
        type="checkbox"
        label="Good (few leakages or windows)"
        name="Good"
        checked={insulation.Good}
        onChange={handleInsulationChange}
      />
      <Form.Check
        type="checkbox"
        label="Poor (many leakages or windows)"
        name="Poor"
        checked={insulation.Poor}
        onChange={handleInsulationChange}
      />

      <h4>Sun Exposure</h4>
      <Form.Check
        type="checkbox"
        label="Average"
        name="Average"
        checked={sunExposure.Average}
        onChange={handleSunExposureChange}
      />
      <Form.Check
        type="checkbox"
        label="Full sunlight"
        name="FullSunlight"
        checked={sunExposure.FullSunlight}
        onChange={handleSunExposureChange}
      />
      <Form.Check
        type="checkbox"
        label="Heavily shaded"
        name="HeavilyShaded"
        checked={sunExposure.HeavilyShaded}
        onChange={handleSunExposureChange}
      />

      <h4>Climate</h4>
      <Form.Check
        type="checkbox"
        label="Average"
        name="Average"
        checked={climate.Average}
        onChange={handleClimateChange}
      />
      <Form.Check
        type="checkbox"
        label="Hot"
        name="Hot"
        checked={climate.Hot}
        onChange={handleClimateChange}
      />
      <Form.Check
        type="checkbox"
        label="Cold"
        name="Cold"
        checked={climate.Cold}
        onChange={handleClimateChange}
      />

      <Row className="my-4">
        <Col xs={12} md={6} lg={4}>
          <Button variant="success" onClick={handleCalculate}>
            Calculate BTU
          </Button>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Button variant="danger" onClick={handleClear}>
            Clear
          </Button>
        </Col>
      </Row>

      {btuResults.length > 0 && (
        <div>
          <h3>Total BTU Required per Room:</h3>
          {btuResults.map((btu, index) => (
            <div key={index}>
              <h4>
                {rooms[index].name} BTU: {btu}
              </h4>
              {product[index] ? (
                <div>
                  <h4>Recommended Air Conditioner:</h4>
                  <p>{product[index].name}</p>
                  <p>BTU Rating: {product[index].btu}</p>
                  <Image
                    src={product[index].image}
                    alt={product[index].name}
                    style={{ width: "100px", height: "auto" }}
                  />
                  <Link
                    to={`/product/${product[index].slug}`}
                    className="link-product-details"
                  >
                    View Details
                  </Link>
                </div>
              ) : (
                <p>
                  No suitable air conditioner found for {rooms[index].name}.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default BtuCalculator;
