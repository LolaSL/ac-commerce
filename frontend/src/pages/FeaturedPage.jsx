import React, { useReducer } from "react";
import { useEffect } from "react";
import axios from "axios";
// import logger from "use-reducer-logger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product.jsx";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox.jsx";
import MessageBox from "../components/MessageBox .jsx";




const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomePage = () => {
  const [{ loading, error, products }, dispatch] = useReducer(
    // logger
      (reducer), {
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
        <Helmet>
          <title> Cool Commerce</title>
      </Helmet>
      <article className="py-4 mb-4">
        <h1 className="featured-title text-center pt-4 mb-4 fw-bold">Featured Products</h1>
        <p className="py-2 mb-2 featured-products text-center">
        Introducing our latest line of air conditioning units</p>
      </article>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
          ) : (
              <div>
          <Row>
            {products.map((product) => (
              <Col key={product.slug} xs={12} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
                </Row>
              </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;