import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import { Container, Table } from "react-bootstrap";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, earnings: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const EarningsPage = () => {
  const { state } = useContext(Store);
  const { serviceProviderInfo } = state;

  const [{ loading, error, earnings }, dispatch] = useReducer(reducer, {
    earnings: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchEarnings = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const token = serviceProviderInfo?.token;

        if (!token) {
          throw new Error("Not authenticated, please log in");
        }

        const { data } = await axios.get("/api/service-providers/earnings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };

    fetchEarnings();
  }, [serviceProviderInfo?.token]);

  if (loading) return <p>Loading earnings...</p>;
  if (error) return <p>Error loading earnings: {error}</p>;

  return (
    <Container>
      <h1 className="mt-4 mb-4 fw-bold">Earnings</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Project Name</th>
            <th>Time On Project</th>
            <th>Amount Earned</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {earnings && earnings.length > 0 ? (
            earnings.map((earning, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{earning.projectName.name}</td>
                <td>{earning.projectName.hoursWorked}</td>
                <td>{earning.amount}</td>
                <td>{new Date(earning.date).toLocaleDateString()}</td>
                <td>{earning.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No earnings data found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default EarningsPage;
