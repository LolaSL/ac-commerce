import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "../components/LoadingBox.jsx";
import MessageBox from "../components/MessageBox.jsx";
import { Table } from "react-bootstrap";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        serviceProviders: action.payload || [],
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ServiceProviders = () => {
  const [{ loading, serviceProviders, error }, dispatch] = useReducer(reducer, {
    loading: true,
    serviceProviders: [],
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/service-providers/", {
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

  return (
    <div>
      <h3 className="mb-4 mt-4">Service Providers Information</h3>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
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
                  <td>{index + 1}</td>
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
      )}
    </div>
  );
};

export default ServiceProviders;
