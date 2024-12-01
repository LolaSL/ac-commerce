import React, { useContext, useEffect, useReducer, useCallback } from "react";
import Chart from "react-google-charts";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "../components/LoadingBox.jsx";
import MessageBox from "../components/MessageBox.jsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Helmet } from "react-helmet-async";

const initialState = {
  loading: true,
  summary: {},
  totalPages: 1,
  currentPage: 1,
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        currentPage: action.payload.currentPage || 1,
        totalPages: action.payload.totalPages || 1,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Users() {
  const [{ loading, summary, currentPage, totalPages, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { state } = useContext(Store);
  const { userInfo } = state;

  const fetchData = useCallback(
    async (page = 1) => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/orders/summary?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    },
    [userInfo]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderPagination = () => (
    <div className="pagination my-3 text-center">
      <button
        disabled={currentPage === 1}
        onClick={() => fetchData(currentPage - 1)}
        className="btn btn-primary mx-2"
        aria-label="Previous Page"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => fetchData(currentPage + 1)}
        className="btn btn-primary mx-2"
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  );

  const renderCard = (title, value) => (
    <Col md={4}>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title className="fw-bold">{value || 0}</Card.Title>
          <Card.Text>{title}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );

  const renderChart = (title, data, chartType) => (
    <div className="my-4">
      <h3 className="text-center">{title}</h3>
      {data.length === 0 ? (
        <MessageBox>No Data Available</MessageBox>
      ) : (
        <Chart
          width="100%"
          height="400px"
          chartType={chartType}
          loader={<div>Loading Chart...</div>}
          data={data}
        />
      )}
    </div>
  );

  return (
    <div>
      <Helmet>
        <title>Users Dashboard</title>
      </Helmet>
      <h1  className="mb-4 mt-4">Users Dashboard</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <h3 className="mb-4 mt-4">Users</h3>
          <Row>
            {renderCard("Users", summary?.users?.[0]?.numUsers)}
            {renderCard("Orders", summary?.orders?.[0]?.numOrders)}
            {renderCard("Sales", summary?.orders?.[0]?.totalSales?.toFixed(2))}
          </Row>

          {renderChart(
            "Sales",
            [["Date", "Sales"], ...summary.dailyOrders.map((x) => [x._id, x.sales])],
            "AreaChart"
          )}

          {renderChart(
            "Categories",
            [["Category", "Products"], ...summary.productCategories.map((x) => [x._id, x.count])],
            "PieChart"
          )}

          {renderPagination()}
        </>
      )}
    </div>
  );
}
