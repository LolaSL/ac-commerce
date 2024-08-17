import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, quote: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    default:
      return state;
  }
};

const GetQuotePage = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    // typeOfProperty: "",
    floorNumber: "",
    directionOfVentilation: "",
    // numberOfRooms: "",
    roomType: "",
    roomArea: "", 
    wallLength: "",
    scaleSize: "",
    file: []
  });

  const [results, setResults] = useState([]);

  const [{ loading, error, quote, loadingCreateReview }, dispatch] = useReducer(
    reducer,
    {
      quote: [],
      loading: true,
      error: "",
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.post("/api/quote", formData, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setResults(data);
        dispatch({ type: "CREATE_SUCCESS" });
        toast.success("Quote submitted successfully");
      } catch (error) {
        console.error(
          "Error details:",
          error.response ? error.response.data : error.message
        );
        toast.error(getError(error));
        dispatch({ type: "CREATE_FAIL" });
      }
    };
    fetchData();
  }, [userInfo, formData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "CREATE_REQUEST" });
    try {
      const { data } = await axios.post("/api/quote", formData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setResults(data);
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Quote submitted successfully");
      dispatch({ type: "FETCH_SUCCESS", payload: quote });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  return (
    <div>
      <h1 className="text-center pt-4 mb-4 fw-bold">
        Get Air Conditioner Quote
      </h1>
      <Form onSubmit={handleSubmit}>
        {[
          { label: "Name", id: "name", type: "text", required: true },
          { label: "Email", id: "email", type: "email", required: true },
          { label: "Phone", id: "phone", type: "text", required: true },
          { label: "Address", id: "address", type: "text", required: true },
          { label: "Floor Number", id: "floorNumber", type: "number", required: true },
          { label: "Direction of ventilation", id: "directionOfVentilation", type: "text", required: true },

          {
            label: "Room Type",
            id: "roomType",
            as: "select",
            required: true,
            options: [
              "Select Room Type",
              "Bedroom",
              "Living room + Windows",
              "Living room",
              "Kitchen",
              "Basement",
              "Open space",
              "Office",
              "Meeting room",
            ],
          },
          { label: "Room Area (sq meters)", id: "roomArea", type: "number" },
          { label: "Wall Length (meters)", id: "wallLength", type: "number" },
          {
            label: "Scale Size (1 unit to ? meters)",
            id: "scaleSize",
            type: "number",
          },
          {
            label: "Upload file",
            id: "file",
            type: "file",
          },

        ].map(({ label, id, type, as, rows, required, options }) => (
          <Form.Group controlId={id} key={id}>
            <Form.Label>{label}</Form.Label>
            {as === "select" ? (
              <Form.Control
                as={as}
                value={formData[id]}
                onChange={handleInputChange}
                required={required}
              >
                {options.map((option, index) => (
                  <option
                    value={option.toLowerCase().replace(/\s+/g, "_")}
                    key={index}
                  >
                    {option}
                  </option>
                ))}
              </Form.Control>
            ) : (
              <Form.Control
                type={type}
                as={as}
                rows={rows}
                value={formData[id]}
                onChange={handleInputChange}
                required={required}
              />
            )}
          </Form.Group>
        ))}
        <Button type="submit" className="mt-4 mb-4">
          Get Quote
        </Button>
      </Form>
      {results.length > 0 && (
        <div>
          <h2>Recommended Air Conditioners</h2>
          <ul>
            {results.map((product) => (
              <li key={product._id} className="text-success fw-bold">
                <img
                  src={product.image}
                  alt={`${product.brand} ${product.category}`}
                  width="100"
                  height="100"
                  className="me-2"
                />
                {product.brand} {product.category} - ${product.price} -{" "}
                {product.btu} BTU
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GetQuotePage;
