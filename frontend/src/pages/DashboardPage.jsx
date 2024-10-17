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
    {
      loading: true,
      summary: {},
      serviceProviders: [],
      error: "",
    }
  );
  const { state } = useContext(Store);
  const { userInfo, serviceProviderInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
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
  }, [userInfo, serviceProviderInfo]);

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h1 className="mb-4 mt-4 text-center fw-bold">Dashboard</h1>
      <h3 className="mb-4 mt-4">Users</h3>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>{summary?.users?.[0]?.numUsers || 0}</Card.Title>
                  <Card.Text>Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary?.orders?.[0]?.numOrders || 0}
                  </Card.Title>
                  <Card.Text>Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    ${summary?.orders?.[0]?.totalSales?.toFixed(2) || 0}
                  </Card.Title>
                  <Card.Text>Sales</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="my-3">
            <h3>Sales</h3>
            {summary?.dailyOrders?.length === 0 ? (
              <MessageBox>No Sale</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ["Date", "Sales"],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              />
            )}
          </div>

          <div className="my-3">
            <h3>Categories</h3>
            {summary?.productCategories?.length === 0 ? (
              <MessageBox>No Category</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ["Category", "Products"],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              />
            )}
          </div>
        </>
      )}
      <h2 className="mb-4 mt-4">Service Providers</h2>
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Service Providers</th>
            <th>Projects</th>
            <th>Earnings</th>
            <th>Messages</th>
          </tr>
        </thead>
        <tbody>
          {serviceProviders?.length > 0 ? (
            serviceProviders.map((serviceProvider, index) => (
              <tr key={index}>
                <td>{index + 1}</td> {/* Assuming index-based ID */}
                <td>{serviceProvider.numServiceProviders}</td>
                <td>{summary.totalProjects?.[0]?.numProjects || 0}</td>
                <td>
                  ${summary.totalEarnings?.[0]?.totalEarnings?.toFixed(2) || 0}
                </td>
                <td>{summary.totalMessages?.[0]?.numMessages || 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No service providers found</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div>
        <ServiceProviders />
      </div>
    </div>
  );
}
