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
      return { ...state, messages: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const MessagesPage = ({ messageId }) => {
  const { state } = useContext(Store);
  const { serviceProviderInfo } = state;

  const [{ loading, error, messages }, dispatch] = useReducer(reducer, {
    messages: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchMessages = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const token = serviceProviderInfo?.token;

        if (!token) {
          throw new Error("Not authenticated, please log in");
        }

        const { data } = await axios.get(`/api/service-providers/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };

    fetchMessages();
  }, [messageId, serviceProviderInfo?.token]);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>Error loading messgaes: {error}</p>;

  return (
    <Container>
      <h1 className="mt-4 mb-4 fw-bold">Messages</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Client Name</th>
            <th>Project Name</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{message.client}</td>
                <td>{message.projectName}</td>
                <td>{message.text}</td>
                <td>{new Date(message.date).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No messages data found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default MessagesPage;