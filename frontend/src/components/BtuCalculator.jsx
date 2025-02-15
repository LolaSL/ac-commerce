import React, { useState, useEffect } from "react";
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

  const cartItems = state?.cart?.cartItems || [];
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

  const [OutdoorUnitLocation, setOutdoorUnitLocation] = useState({
    FlatRoof: false,
    PitchedRoof: false,
    WallBrackets: false,
    HardGround: false,
  });

  const [btuResults, setBtuResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const CONVERT_FEET_TO_METERS = 0.092903;
  const CONVERT_METERS_TO_FEET = 1 / CONVERT_FEET_TO_METERS;
  const BASE_BTU_PER_SQ_METER = 600;
  const HEIGHT_ADDITIONAL_BTU = 1000;
  const BTU_PER_ADDITIONAL_PERSON = 600;
  const KITCHEN_BTU_ADDITION = 4000;

  const OUTDOOR_LOCATION_BTU_ADJUSTMENTS = {
    FlatRoof: 1.15,
    PitchedRoof: 1.1,
    WallBrackets: 1.05,
    HardGround: 1.0,
    SoftGround: 0.95,
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

    Object.keys(OutdoorUnitLocation).forEach((location) => {
      if (OutdoorUnitLocation[location]) {
        baseBTU *= OUTDOOR_LOCATION_BTU_ADJUSTMENTS[location];
      }
    });

    return { btu: Math.round(baseBTU), error: null };
  };

  const getOptimalCondensers = (targetBTU) => {
    const condensers = getOutdoorCondensers().sort((a, b) => b.btu - a.btu);
    let selectedCondensers = [];
    let currentTotalBTU = 0;
    const addedCondensers = new Set();
    for (const condenser of condensers) {
      while (
        currentTotalBTU + condenser.btu <= targetBTU * 1.1 &&
        !addedCondensers.has(condenser._id)
      ) {
        selectedCondensers.push(condenser);
        currentTotalBTU += condenser.btu;
        addedCondensers.add(condenser._id);
      }
      if (currentTotalBTU >= targetBTU * 0.8) break;
    }
    if (currentTotalBTU < targetBTU * 0.8) {
      console.warn(
        `Warning: Could not fully meet the required BTU. Current total: ${currentTotalBTU}, Target: ${targetBTU}`
      );
    }
    console.log("Selected Condensers:", selectedCondensers);
    return selectedCondensers;
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
        if (data && typeof data === "object" && data._id) {
          fetchedProducts.push(data);
        } else {
          console.warn("Invalid product data received:", data);
        }
      } catch (error) {
        console.error("Product not found for room:", error);
      }
    }
    setBtuResults(results);
    setError("");
    const optimalCondensers = getOptimalCondensers(totalBTU);
    const condenserMap = new Map();
    const finalProducts = [...fetchedProducts];
    optimalCondensers.forEach((condenser) => {
      if (!condenserMap.has(condenser._id)) {
        finalProducts.push(condenser);
        condenserMap.set(condenser._id, true);
      }
    });
    console.log("Final Products to Set:", finalProducts);
    setProducts(finalProducts);
  };
  const getOutdoorCondensers = () => {
    return [
      {
        _id: "67b0a7e584b21dc6cb63140c",
        name: "36000 BTU Outdoor Condenser",
        slug: "36000-outdoor-condensing-unit",
        category: "Outdoor condenser",
        image: "/images/p23.jpg",
        price: 3091.46,
        discount: 5,
        btu: 36000,
      },
      {
        _id: "67b0a7e584b21dc6cb631410",
        name: "36000 BTU Outdoor Condenser",
        slug: "36000-outdoor-condensing-unit",
        category: "Outdoor condenser",
        image: "/images/p23.jpg",
        price: 3091.46,
        discount: 5,
        btu: 36000,
      },
      {
        _id: "67b0a7e584b21dc6cb631414",
        name: "48000 BTU Outdoor Condenser",
        slug: "48000-cac-condensing-unit",
        category: "Outdoor condenser",
        image: "/images/p22.jpg",
        price: 1296.75,
        discount: 0,
        btu: 48000,
      },
      {
        _id: "67b0627315c4b97976e5988f",
        name: "54000 BTU Multi-System Condenser",
        slug: "54000-mini-split-outdoor-condensing-unit",
        category: "Outdoor condenser",
        image: "/images/p21.jpg",
        price: 3520,
        discount: 5,
        btu: 54000,
      },
      {
        _id: "67b0a7e584b21dc6cb63141c",
        name: "60000 BTU Multi-System Condenser",
        slug: "60000-mini-split-outdoor-condensing-unit",
        category: "Outdoor condenser",
        image: "/images/p21.jpg",
        price: 6764,
        discount: 40,
        btu: 60000,
      },
    ];
  };
  const saveResultsToCart = () => {
    const addItemToCart = (product, quantity = 1) => {
      if (!product || !product.price || isNaN(product.btu)) {
        console.error("Invalid product data:", product);
        return;
      }
      const existingItem = cartItems.find((item) => item.btu === product.btu);
      if (existingItem) {
        ctxDispatch({
          type: "CART_ADD_ITEM",
          payload: {
            ...existingItem,
            quantity: existingItem.quantity + quantity,
          },
        });
      } else {
        ctxDispatch({
          type: "CART_ADD_ITEM",
          payload: { ...product, quantity },
        });
      }
    };

    if (!Array.isArray(rooms) || !Array.isArray(products)) {
      console.error("Invalid input: 'rooms' and 'products' must be arrays.");
      return;
    }

    const productCount = [];

    rooms.forEach((room, index) => {
      const product = products[index];
      if (product && product._id) {
        if (!productCount[product.btu]) {
          productCount[product.btu] = { product, quantity: 0 };
        }
        productCount[product.btu].quantity += 1;
      }
    });

    Object.values(productCount).forEach(({ product, quantity }) => {
      addItemToCart(product, quantity);
    });

    const condenserProducts = products.filter(
      (p) => p.category === "Outdoor condenser"
    );

    condenserProducts.forEach((condenser) => addItemToCart(condenser, 1));

    navigate("/cart");
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems"));
    if (savedCart && savedCart.length > 0) {
      ctxDispatch({ type: "CART_RESTORE", payload: savedCart });
    }
  }, [ctxDispatch]);

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
                <th>Room</th> <th>BTU</th> <th>Optimal Product</th>
                <th>Product Details</th> <th>Product Price</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => {
                const product = products[index] || {};
                return (
                  <tr key={index}>
                    <td>{room.name}</td> <td>{btuResults[index]}</td>
                    <td>
                      {product.slug ? (
                        <Link
                          to={`/product/${product.slug}`}
                          className="link-product-details"
                        >
                          <Image
                            src={product.image || "/images/placeholder.png"}
                            alt={product.name || "No product available"}
                            style={{
                              width: "50px",
                              height: "auto",
                              backgroundColor: "grey",
                            }}
                            className="responsive rounded"
                          />
                        </Link>
                      ) : (
                        "No product available"
                      )}
                    </td>
                    <td>{product.name || "No product available"}</td>
                    <td>
                      {product.discount > 0
                        ? (
                            product.price -
                            (product.price * product.discount) / 100
                          ).toFixed(2)
                        : product.price
                        ? product.price.toFixed(2)
                        : "No price available"}
                    </td>
                  </tr>
                );
              })}
              {(() => {
                const totalBTU = btuResults.reduce(
                  (total, btu) => total + btu,
                  0
                );
                console.log("Total BTU: ", totalBTU);
                const outdoorCondensers = getOutdoorCondensers();
                let relevantCondensers = [];
                let accumulatedBTU = 0;
                const sortedCondensers = [...outdoorCondensers].sort(
                  (a, b) => b.btu - a.btu
                );
                for (const condenser of sortedCondensers) {
                  if (accumulatedBTU >= totalBTU * 0.8) break;
                  relevantCondensers.push(condenser);
                  accumulatedBTU += condenser.btu;
                }
                return (
                  <>
                    {relevantCondensers.map((condenser, index) => (
                      <tr key={`condenser-${index}`}>
                        <td
                          colSpan="2"
                          className="text-center bg-info text-white"
                        >
                          Outdoor Condenser {index + 1}
                        </td>
                        <td>
                          <Link to={`/product/${condenser.slug}`}>
                            <Image
                              src={condenser.image}
                              alt={condenser.name}
                              style={{
                                width: "50px",
                                height: "auto",
                                backgroundColor: "grey",
                              }}
                              className="responsive rounded"
                            />
                          </Link>
                        </td>
                        <td>{condenser.name}</td>
                        <td>{condenser.price.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="total-results bg-warning">
                        <strong>Total</strong>
                      </td>
                      <td className="total-results bg-warning">
                        <strong>{totalBTU}</strong>
                      </td>
                      <td className="total-results bg-warning">
                        <strong>
                          {
                            [
                              ...new Set([
                                ...products.map((product) => product.btu),
                                ...relevantCondensers.map(
                                  (condenser) => condenser.btu
                                ),
                              ]),
                            ].length
                          }
                        </strong>
                      </td>
                      <td className="total-results bg-warning"></td>
                      <td className="total-results bg-warning">
                        <strong>
                          {[...products, ...relevantCondensers]
                            .reduce((total, item) => {
                              const price =
                                item.price -
                                (item.price * (item.discount || 0)) / 100;
                              return total + price;
                            }, 0)
                            .toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  </>
                );
              })()}
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
