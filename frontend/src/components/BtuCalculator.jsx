import React, { useState } from "react";
import {
  Container,
  Image,
  Row,
  Col,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { getError } from "../utils";
import { useContext } from "react";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";

function BtuCalculator() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const {
    cart: { cartItems },
  } = state;

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [areaFeet, setAreaFeet] = useState(0);
  const [areaMeters, setAreaMeters] = useState(0);
  const [measurementSystem, setMeasurementSystem] = useState("meters");
  const [rooms, setRooms] = useState([{ name: "Bedroom 1", size: "", btu: 0 }]);
  const [ceilingHeight, setCeilingHeight] = useState("2.5");
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

  const [typeOfWall, setTypeOfWall] = useState({
    BrickVeneer: false,
    CementBricks: false,
    CementSheet: false,
    CementSlab: false,
    DoubleBrick: false,
    FoarmCladding: false,
  });

  const [typeOfRoof, setTypeOfRoof] = useState({
    MetalFlatRoof: false,
    MetalPitchRoof: false,
    TileRoof: false,
  });

  const [OutdoorUnitLocation, setOutdoorUnitLocation] = useState({
    FlatRoof: false,
    PitchedRoof: false,
    WallBrackets: false,
    HardGround: false,
    SoftGround: false,
  });

  const [btuResults, setBtuResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const [aboveGroundFloor, setAboveGroundFloor] = useState("No");
  const [outdoorSpace, setOutdoorSpace] = useState("Yes");

  const CONVERT_FEET_TO_METERS = 0.092903;
  const CONVERT_METERS_TO_FEET = 1 / CONVERT_FEET_TO_METERS;
  const BASE_BTU_PER_SQ_METER = 600;
  const HEIGHT_ADDITIONAL_BTU = 1000;
  const BTU_PER_ADDITIONAL_PERSON = 600;
  const KITCHEN_BTU_ADDITION = 4000;
  const ABOVE_GROUND_BTU_ADDITION = 500;

  const OUTDOOR_LOCATION_BTU_ADJUSTMENTS = {
    FlatRoof: 1.15,
    PitchedRoof: 1.1,
    WallBrackets: 1.05,
    HardGround: 1.0,
    SoftGround: 1.1,
  };

  function calculateArea(e) {
    e.preventDefault();
    const heightValue = parseFloat(height);
    const widthValue = parseFloat(width);

    if (measurementSystem === "feet") {
      const areaInFeet = heightValue * widthValue;
      setAreaFeet(areaInFeet);
      setAreaMeters(areaInFeet * CONVERT_FEET_TO_METERS);
    } else {
      const areaInMeters = heightValue * widthValue;
      setAreaMeters(areaInMeters);
      setAreaFeet(areaInMeters * CONVERT_METERS_TO_FEET);
    }
  }

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
  const handleWallChange = (e) => {
    const { name, checked } = e.target;
    setTypeOfWall((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleRoofChange = (e) => {
    const { name, checked } = e.target;
    setTypeOfRoof((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleOutdoorUnitLocationChange = (e) => {
    const { name, checked } = e.target;
    setOutdoorUnitLocation((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const calculateBTUForRoom = (room) => {
    let area = parseFloat(room.size);
    let height = parseFloat(ceilingHeight);
    if (isNaN(area) || isNaN(height)) {
      return {
        btu: null,
        error: "Please enter valid numbers for room size and ceiling height.",
      };
    }

    if (measurementSystem === "feet") {
      area *= CONVERT_FEET_TO_METERS;
      height *= 0.3048;
    }

    let baseBTU = area * BASE_BTU_PER_SQ_METER;

    if (height > 2.5) {
      baseBTU += HEIGHT_ADDITIONAL_BTU * ((height - 2.5) / 0.1);
    }

    baseBTU += BTU_PER_ADDITIONAL_PERSON * Math.max(0, numPeople - 1);

    if (room.name === "Kitchen") {
      baseBTU += KITCHEN_BTU_ADDITION;
    }

    if (insulation.Poor) baseBTU *= 1.2;
    if (insulation.Average) baseBTU *= 1.1;
    if (insulation.Good) baseBTU *= 0.9;

    if (sunExposure.FullSunlight) baseBTU *= 1.2;
    if (sunExposure.HeavilyShaded) baseBTU *= 0.9;

    if (climate.Hot) baseBTU *= 1.2;
    if (climate.Cold) baseBTU *= 0.8;
    if (climate.Average) baseBTU *= 1.0;

    if (aboveGroundFloor === "Yes") {
      baseBTU += ABOVE_GROUND_BTU_ADDITION;
    }
    if (typeOfWall.BrickVeneer) {
      baseBTU *= 1.1;
    }
    if (typeOfWall.CementBricks) {
      baseBTU *= 1.2;
    }
    if (typeOfWall.DoubleBrick) {
      baseBTU *= 0.9;
    }
    if (typeOfWall.CementSheet) {
      baseBTU *= 1.15;
    }
    if (typeOfWall.CementSlab) {
      baseBTU *= 1.25;
    }
    if (typeOfWall.FoarmCladding) {
      baseBTU *= 0.8;
    }

    if (typeOfRoof.MetalFlatRoof) {
      baseBTU *= 1.3;
    }
    if (typeOfRoof.MetalPitchRoof) {
      baseBTU *= 1.2;
    }
    if (typeOfRoof.TileRoof) {
      baseBTU *= 0.9;
    }

    Object.keys(OutdoorUnitLocation).forEach((location) => {
      if (OutdoorUnitLocation[location]) {
        baseBTU *= OUTDOOR_LOCATION_BTU_ADJUSTMENTS[location];
      }
    });

    return { btu: Math.round(baseBTU), error: null };
  };

  const handleCalculate = async () => {
    const results = [];
    const fetchedProducts = [];
    let totalBTU = 0;

    for (const room of rooms) {
      const { btu, error } = calculateBTUForRoom(room);
      if (error) {
        setError(error);
        return;
      }
      results.push(btu);
      totalBTU += btu;

      try {
        const { data } = await axios.get(`/api/products/btu/${btu}`, {
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
    setProducts(fetchedProducts);
    setError("");

    if (totalBTU >= 20000) {
      const outdoorCondensers = getOutdoorCondensers();
      fetchedProducts.push(...outdoorCondensers);
    }
  };

  const getOutdoorCondensers = () => {
    return [
      {
        name: "Mini Split Outdoor Condenser",
        slug: "mini-split-outdoor-condensing-unit",
        category: "Outdoor condenser",
        image: "/images/p5.jpg",
        price: 1296.75,
        btu: 36000,
      },
      // Add more outdoor condenser products if needed
    ];
  };

  const saveResultsToCart = () => {
    const addItemToCart = (product) => {
      const existingItem = cartItems.find((item) => item._id === product._id);
      const quantity = existingItem ? existingItem.quantity + 1 : 1;
      if (!existingItem) {
        ctxDispatch({
          type: "CART_ADD_ITEM",
          payload: {
            ...product,
           quantity,
          },
        });
      }
    };

    if (Array.isArray(rooms) && Array.isArray(products)) {
      rooms.forEach((room, index) => {
        const product = products[index];
        if (product) {
          addItemToCart(product);
        }
      });
    } else {
      console.error("Invalid input: 'rooms' and 'products' must be arrays.");
    }
    

    const totalBTU = btuResults.reduce((total, btu) => total + btu, 0);

    const condenserProducts = products.filter(
      (product) => product.category.toLowerCase() === "outdoor condenser"
    );
      if (totalBTU >= 20000 && condenserProducts.length > 0) {
      const product = condenserProducts[0];
      addItemToCart(product);
    }

    navigate("/cart");
  };

  
  

  const handleClear = () => {
    setRooms([{ name: "Bedroom 1", size: "", btu: 0 }]);
    setCeilingHeight("2.5");
    setNumPeople(2);
    setInsulation({ Average: false, Good: false, Poor: false });
    setSunExposure({
      Average: false,
      FullSunlight: false,
      HeavilyShaded: false,
    });
    setClimate({ Average: false, Hot: false, Cold: false });
    setBtuResults([]);
    setProducts([]);
    setError("");
  };

  return (
    <div>
      <Container className="btu-calculator-container mt-4 mb-4 rounded ">
        <Form className="btu-form">
          <h3 className="mt-4 mb-4 text-center title">BTU Calculator</h3>
          <Row className="my-4">
            <Col xs={12} md={6} lg={8}>
              <Form.Group controlId="measurementSystem">
                <Form.Label className="fw-bold">Calculate Area </Form.Label>
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
          <Row className="my-4">
            <Col xs={12} md={6} lg={8}>
              <Form.Group controlId="height">
                <Form.Label>
                  Height ({measurementSystem === "meters" ? "m" : "ft"}):
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder={`Enter height in ${
                    measurementSystem === "meters" ? "meters" : "feet"
                  }`}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="my-4">
            <Col xs={12} md={6} lg={8}>
              <Form.Group controlId="width">
                <Form.Label>
                  Width ({measurementSystem === "meters" ? "m" : "ft"}):
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder={`Enter width in ${
                    measurementSystem === "meters" ? "meters" : "feet"
                  }`}
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Button
            variant="primary"
            onClick={calculateArea}
            className="btn-calculate mt-2 mb-4 w-70"
          >
            Calculate Area
          </Button>
          {areaFeet > 0 && (
            <div className="result mt-4 mb-4">
              <h3 className="mb-3 mt-3">Results:</h3>
              <p>Area in Square Feet: {areaFeet.toFixed(2)} sq ft</p>
              <p>Area in Square Meters: {areaMeters.toFixed(2)} sq m</p>
            </div>
          )}
          <Row>
            <Col xs={12} md={6} lg={4} className="my-4">
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
            <Col xs={12} md={6} lg={4} className="my-4">
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
              <Col xs={12} md={6} lg={4} className="my-4">
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
                    <option>Terrace</option>
                    <option>Loft</option>
                    <option>Single Storey</option>
                    <option>Double Storey</option>
                    <option>Split Level House</option>
                    <option>Entire First Floor</option>
                    <option>Entire Second Floor And Above</option>
                    <option>Open Office Area</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4} className="my-4">
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
              <Button
                variant="primary"
                onClick={() => removeRoom(index)}
                className="btn btn-sm mb-4  my-4"
              >
                <i className="fas fa-trash"></i>
              </Button>
            </Row>
          ))}

          <Button
            variant="primary"
            onClick={addRoom}
            className="btn-add mb-3 mt-4"
          >
            Add Desired Room
          </Button>
          <Form.Group controlId="aboveGroundFloor" className="my-4">
            <Form.Label>
              Are Any Of The Chosen Room(s) Above The Ground Floor?
            </Form.Label>
            <Form.Check
              type="radio"
              name="aboveGroundFloor"
              label="No"
              value="No"
              checked={aboveGroundFloor === "No"}
              onChange={(e) => setAboveGroundFloor(e.target.value)}
            />
            <Form.Check
              type="radio"
              name="aboveGroundFloor"
              label="Yes"
              value="Yes"
              checked={aboveGroundFloor === "Yes"}
              onChange={(e) => setAboveGroundFloor(e.target.value)}
            />
            <p className="text-muted mt-2">
              We may require a scaffold tower for working heights over 1.5m.
            </p>
          </Form.Group>
          <hr className="ms-2 mt-1 mb-5" style={{ width: "66%" }}></hr>
          <Form.Group controlId="outdoorSpace" className="my-4">
            <Form.Label>Do You Have Outdoor Space?</Form.Label>
            <Form.Check
              type="radio"
              name="outdoorSpace"
              label="Yes"
              value="Yes"
              checked={outdoorSpace === "Yes"}
              onChange={(e) => setOutdoorSpace(e.target.value)}
            />
            <Form.Check
              type="radio"
              name="outdoorSpace"
              label="No"
              value="No"
              checked={outdoorSpace === "No"}
              onChange={(e) => setOutdoorSpace(e.target.value)}
            />
          </Form.Group>
          <hr className="ms-2 mt-1 mb-5" style={{ width: "66%" }}></hr>
          <h3 className="mb-3 mt-3 "> Outdoor Unit (Condenser) Location</h3>
          <Form.Check
            type="checkbox"
            label="Flat Roof"
            name="FlatRoof"
            checked={OutdoorUnitLocation.FlatRoof}
            onChange={handleOutdoorUnitLocationChange}
          />
          <Form.Check
            type="checkbox"
            label="Pitched Roof"
            name="PitchedRoof"
            checked={OutdoorUnitLocation.PitchedRoof}
            onChange={handleOutdoorUnitLocationChange}
          />
          <Form.Check
            type="checkbox"
            label="Wall Brackets"
            name="WallBrackets"
            checked={OutdoorUnitLocation.WallBrackets}
            onChange={handleOutdoorUnitLocationChange}
          />
          <Form.Check
            type="checkbox"
            label="Hard Ground"
            name="HardGround"
            checked={OutdoorUnitLocation.HardGround}
            onChange={handleOutdoorUnitLocationChange}
          />
          <Form.Check
            type="checkbox"
            label="Soft Ground"
            name="SoftGround"
            checked={OutdoorUnitLocation.SoftGround}
            onChange={handleOutdoorUnitLocationChange}
          />
          <hr className="ms-2 mt-1 mb-5" style={{ width: "66%" }}></hr>
          <h3 className="mb-3 mt-3">Type of Wall</h3>
          <Form.Check
            type="checkbox"
            label="Brick Veneer"
            name="BrickVeneer"
            checked={typeOfWall.BrickVeneer}
            onChange={handleWallChange}
          />
          <Form.Check
            type="checkbox"
            label="Cement Bricks"
            name="CementBricks"
            checked={typeOfWall.CementBricks}
            onChange={handleWallChange}
          />
          <Form.Check
            type="checkbox"
            label="Cement Sheet"
            name="CementSheet"
            checked={typeOfWall.CementSheet}
            onChange={handleWallChange}
          />
          <Form.Check
            type="checkbox"
            label="Cement Slab"
            name="CementSlab"
            checked={typeOfWall.CementSlab}
            onChange={handleWallChange}
          />
          <Form.Check
            type="checkbox"
            label="Double Brick"
            name="DoubleBrick"
            checked={typeOfWall.DoubleBrick}
            onChange={handleWallChange}
          />
          <Form.Check
            type="checkbox"
            label="Foarm Cladding"
            name="FoarmCladding"
            checked={typeOfWall.FoarmCladding}
            onChange={handleWallChange}
          />
          <hr className="ms-2 mt-1 mb-5" style={{ width: "66%" }}></hr>
          <h3 className="mb-3 mt-3">Type of Roof</h3>
          <Form.Check
            type="checkbox"
            label="Metal Flat Roof"
            name="MetalFlatRoof"
            checked={typeOfRoof.MetalFlatRoof}
            onChange={handleRoofChange}
          />
          <Form.Check
            type="checkbox"
            label="Metal Pitch Roof"
            name="MetalPitchRoof"
            checked={typeOfRoof.MetalPitchRoof}
            onChange={handleRoofChange}
          />
          <Form.Check
            type="checkbox"
            label="Tile Roof"
            name="TileRoof"
            checked={typeOfRoof.TileRoof}
            onChange={handleRoofChange}
          />
          <hr className="ms-2 mt-1 mb-5" style={{ width: "66%" }}></hr>
          <h3 className="mb-3 mt-3 ">Insulation Condition</h3>
          <Form.Check
            type="checkbox"
            label="Average"
            name="Average"
            checked={insulation.Average}
            onChange={handleInsulationChange}
          />
          <Form.Check
            type="checkbox"
            label="Good (very few leakage or window)"
            name="Good"
            checked={insulation.Good}
            onChange={handleInsulationChange}
          />
          <Form.Check
            type="checkbox"
            label="Poor (many leakage or window)"
            name="Poor"
            checked={insulation.Poor}
            onChange={handleInsulationChange}
          />
          <hr className="ms-2 mt-1 mb-5" style={{ width: "66%" }}></hr>
          <h3 className="mb-3 mt-3">Sun Exposure</h3>
          <Form.Check
            type="checkbox"
            label="Average"
            name="Average"
            checked={sunExposure.Average}
            onChange={handleSunExposureChange}
          />
          <Form.Check
            type="checkbox"
            label="Full Sunlight"
            name="FullSunlight"
            checked={sunExposure.FullSunlight}
            onChange={handleSunExposureChange}
          />
          <Form.Check
            type="checkbox"
            label="Heavily Shaded"
            name="HeavilyShaded"
            checked={sunExposure.HeavilyShaded}
            onChange={handleSunExposureChange}
          />
          <hr className="line-hr ms-2 mt-1 mb-5" style={{ width: "66%" }}></hr>
          <h3 className="mb-3 mt-3">Climate</h3>
          <Form.Check
            type="checkbox"
            label="Average  (Warsaw)"
            name="Average"
            checked={climate.Average}
            onChange={handleClimateChange}
          />
          <Form.Check
            type="checkbox"
            label="Hot (Tel-Aviv)"
            name="Hot"
            checked={climate.Hot}
            onChange={handleClimateChange}
          />
          <Form.Check
            type="checkbox"
            label="Cold (Stockholm)"
            name="Cold"
            checked={climate.Cold}
            onChange={handleClimateChange}
          />

          <Button
            variant="primary"
            onClick={handleCalculate}
            className="mt-4 me-3 mb-4"
          >
            Calculate BTU
          </Button>

          <Button
            variant="secondary"
            onClick={handleClear}
            className="mt-4 mb-4"
          >
            Clear
          </Button>

          {error && (
            <div className="btu-error">
              {getError({ response: { data: { message: error } } })}
            </div>
          )}
        </Form>
      </Container>
      {btuResults.length > 0 && (
        <Container className="btu-results mt-4">
          <h3 className="text-center">BTU Results</h3>
          <Table bordered hover className="table-responsive-md">
            <thead>
              <tr>
                <th>Room</th>
                <th>BTU</th>
                <th>Optimal Product</th>
                <th>Product Details</th>
                <th>Product Price</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={index}>
                  <td>{room.name}</td>
                  <td>{btuResults[index]}</td>
                  <td>
                    <Link
                      to={`/product/${products[index]?.slug}`}
                      className="link-product-details"
                    >
                      <Image
                        src={products[index]?.image}
                        alt={products[index]?.name}
                        style={{
                          width: "50px",
                          height: "auto",
                          backgroundColor: "grey",
                        }}
                        className="responsive rounded"
                      />
                    </Link>
                  </td>
                  <td>{products[index]?.name || "No product available"}</td>
                  <td>
                    {products[index]?.price
                      ? products[index].price.toFixed(2)
                      : "No price available"}
                  </td>
                </tr>
              ))}
              {(() => {
                const totalBTU = btuResults.reduce(
                  (total, btu) => total + btu,
                  0
                );
                const condenserProducts = products.filter(
                  (product) => product.category === "Outdoor condenser"
                );
                if (totalBTU >= 25000 && condenserProducts.length > 0) {
                  const product = condenserProducts[0];
                  return (
                    <tr key="condenser">
                      <td
                        colSpan="2"
                        className="text-center bg-info text-white"
                      >
                        Outdoor Condenser
                      </td>
                      <td>
                        <Link to={`/product/${product.slug}`}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: "50px",
                              height: "auto",
                              backgroundColor: "grey",
                            }}
                            className="responsive rounded"
                          />
                        </Link>
                      </td>
                      <td>{product.name}</td>
                      <td>{product.price.toFixed(2)}</td>
                    </tr>
                  );
                }
                return null;
              })()}

              <tr>
                <td className="total-results bg-warning">
                  <strong>Total</strong>
                </td>
                <td className="total-results bg-warning">
                  <strong>
                    {btuResults.reduce((total, btu) => total + btu, 0)}
                  </strong>
                </td>
                <td className="total-results bg-warning">
                  <strong>
                    {products.filter((product) => product).length}
                  </strong>
                </td>
                <td className="total-results bg-warning"></td>
                <td className="total-results bg-warning">
                  <strong>
                    {products
                      .reduce((total, product) => {
                        return product ? total + product.price : total;
                      }, 0)
                      .toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3">
            <Button variant="primary" onClick={saveResultsToCart}>
              Save to Cart
            </Button>
          </div>
        </Container>
      )}
    </div>
  );
}

export default BtuCalculator;
