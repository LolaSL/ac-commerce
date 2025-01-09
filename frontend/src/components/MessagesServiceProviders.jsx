import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import { Container, Table, Button } from "react-bootstrap";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        messages: action.payload.messages || [],
        loading: false,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalMessages: action.payload.totalMessages,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    default:
      return state;
  }
};

const MessagesServiceProviders = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, messages, successDelete, currentPage }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
      messages: [],
      currentPage: 1,
      totalPages: 1,
      successDelete: false,
    });

  useEffect(() => {
    const fetchMessages = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      if (!userInfo || !userInfo.token) {
        console.error("User is not authenticated.");
        return;
      }
      try {
        const { data } = await axios.get(`/api/service-providers/messages/all`, {
          params: { page: currentPage, pageSize: 10 },
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchMessages();
  }, [userInfo, successDelete, currentPage]);

  const deleteHandler = async (messageId) => {
    if (!messageId || !messageId.match(/^[0-9a-fA-F]{24}$/)) {
      alert("Invalid message ID.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this message?")) {
      dispatch({ type: "DELETE_REQUEST" });
      try {
        const { data } = await axios.delete(`/api/service-providers/message/${messageId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "DELETE_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "DELETE_FAIL" });
        alert(getError(err));
      }
    }
  };
  

  const editHandler = (messageId) => {
    window.location.href = `/admin/message/${messageId}/edit`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
    <h1 className="mt-4 mb-4 fw-bold">Service Provider Messages</h1>
    {messages.length === 0 && (
      <div>
        <p>No messages available</p>
        <p>Check API response and ensure messages exist in the database.</p>
      </div>
    )}
    {messages.length > 0 && (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
              <th>#</th>
              <th>Service Provider</th>
              <th>Client</th>
              <th>Project</th>
            <th>Message</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message, index) => (
            <tr key={message._id}>
              <td>{index + 1}</td>
              <td>{message.serviceProvider.name}</td>
              <td>{message.client}</td>
              <td>{message.projectName}</td>
              <td>{message.text}</td>
              <td>{new Date(message.date).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="secondary"
                  className="me-2 mb-1 btn-sm"
                  onClick={() => editHandler(message._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="me-2 btn-sm"
                  onClick={() => deleteHandler(message._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </Container>
  );
};

export default MessagesServiceProviders;
