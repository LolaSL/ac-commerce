import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "../components/LoadingBox.jsx";
import MessageBox from "../components/MessageBox.jsx";
import { Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        serviceProviders: action.payload.serviceProviders || [],
        loading: false,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalServiceProviders: action.payload.totalServiceProviders,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ServiceProviders = () => {
  const [
    { loading, serviceProviders, error, currentPage, totalPages },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    serviceProviders: [],
    error: "",
    currentPage: 1,
    totalPages: 1,
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/service-providers/summary", {
          params: { page: currentPage, pageSize: 10 },
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
  }, [currentPage, userInfo]);

  const barChartData = [
    ["Provider", "Earnings"],
    ...serviceProviders.map((provider) => [
      provider.name,
      provider.totalEarnings || 0,
    ]),
  ];

  const barChartOptions = {
    title: "Provider vs Earnings",
    chartArea: { width: "70%" },
    hAxis: { title: "Earnings (USD)", minValue: 0 },
    vAxis: { title: "Provider" },
    legend: "none",
    colors: ["#10b2ad"], 
  };

  const pieChartData = [
    ["Status", "Number of Projects"],
    [
      "Completed Projects",
      serviceProviders.reduce(
        (sum, provider) => sum + (provider.completedProjects || 0),
        0
      ),
    ],
    [
      "In Progress Projects",
      serviceProviders.reduce(
        (sum, provider) => sum + (provider.inProgressProjects || 0),
        0
      ),
    ],
  ];

  const pieChartOptions = {
    title: "Project Distribution",
    pieHole: 0.4,
    is3D: false,
    legend: { position: "bottom" },
    colors: ["#0ac22f", "#cd17ee" ], 
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch({ type: "FETCH_REQUEST" });

    axios
      .get("/api/service-providers", {
        params: { page: newPage, pageSize: 10 },
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      .then((response) => {
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      })
      .catch((err) => {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      });
  };

  return (
    <div>
      <Helmet>
        <title>Service Providers Dashboard</title>
      </Helmet>
      <h1 className="mb-4 mt-4">Service Providers Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Company</th>
                <th>Specialty</th>
                <th>Experience</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Completed Projects</th>
                <th>In Progress Projects</th>
                <th>Total Earnings</th>
              </tr>
            </thead>
            <tbody>
              {serviceProviders.length > 0 ? (
                serviceProviders.map((serviceProvider, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{serviceProvider.name}</td>
                    <td>{serviceProvider.company}</td>
                    <td>{serviceProvider.typeOfProvider}</td>
                    <td>{serviceProvider.experience} years</td>
                    <td>{serviceProvider.email}</td>
                    <td>{serviceProvider.phone}</td>
                    <td className="text-center">
                      {serviceProvider.completedProjects}
                    </td>
                    <td>{serviceProvider.inProgressProjects}</td>
                    <td>${serviceProvider.totalEarnings?.toFixed(2) || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No service providers found</td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="mt-5">
            <h3>Project Distribution</h3>
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={pieChartData}
              options={pieChartOptions}
            />
          </div>
          <div className="mt-5">
            <h3>Provider vs Earnings</h3>
            <Chart
              chartType="BarChart"
              width="100%"
              height="400px"
              data={barChartData}
              options={barChartOptions}
            />
          </div>
          <div>
            <button
              className="btn btn-primary mx-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            <span>
              {" "}
              {currentPage} / {totalPages}{" "}
            </span>
            <button
              className="btn btn-primary mx-2"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceProviders;
