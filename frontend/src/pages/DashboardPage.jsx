import React, { useContext, useEffect, useReducer } from "react";
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
import { Table } from "react-bootstrap";
import ServiceProviders from "../components/ServiceProviders.jsx";

const initialState = {
  loading: true,
  summary: {},
  serviceProviders: [],
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        serviceProviders: action.payload.serviceProviders || [],
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashboardPage() {
  const [{ loading, summary, serviceProviders, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/orders/summary", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const renderCard = (title, value) => (
    <Col md={4}>
      <Card>
        <Card.Body>
          <Card.Title>{value || 0}</Card.Title>
          <Card.Text>{title}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );

  const renderChart = (title, data, chartType) => (
    <div className="my-3">
      <h3>{title}</h3>
      {data.length === 0 ? (
        <MessageBox>No Data</MessageBox>
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
        <title>Dashboard</title>
      </Helmet>
      <h1 className="mb-4 mt-4 text-center fw-bold">Dashboard</h1>

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

          <h2 className="mb-4 mt-4">Service Providers</h2>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Provider</th>
                <th>Projects</th>
                <th>Earnings</th>
                <th>Messages</th>
              </tr>
            </thead>
            <tbody>
              {serviceProviders.length > 0 ? (
                serviceProviders.map((serviceProvider, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{serviceProvider.numServiceProviders}</td>
                    <td>{summary.totalProjects?.[0]?.numProjects || 0}</td>
                    <td>${summary.totalEarnings?.[0]?.totalEarnings?.toFixed(2) || 0}</td>
                    <td>{summary.totalMessages?.[0]?.numMessages || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No service providers found</td>
                </tr>
              )}
            </tbody>
          </Table>

          <ServiceProviders />
        </>
      )}
    </div>
  );
}
