import React, { useContext, useReducer, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";
import NavLink from "react-bootstrap/NavLink";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function ServiceProviderProfile() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { serviceProviderInfo } = state;
  const serviceProviderId = serviceProviderInfo?._id;

  const [name, setName] = useState(serviceProviderInfo?.name || "");
  const [email, setEmail] = useState(serviceProviderInfo?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!serviceProviderId) {
      toast.error("Service Provider ID is missing.");
      return;
    }
    try {
      const { data } = await axios.put(
        `/api/service-providers/profile/${serviceProviderId}`, // Correct URL with ID
        {
          name,
          email,
          password: password || undefined,
        },
        {
          headers: { Authorization: `Bearer ${serviceProviderInfo.token}` },
        }
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({ type: "SERVICE_PROVIDER_LOGIN", payload: data });
      localStorage.setItem("serviceProviderInfo", JSON.stringify(data));
      toast.success("Service Provider updated successfully");
      navigate("/");
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!serviceProviderInfo) {
      navigate("/serviceprovider/login");
    }
  }, [serviceProviderInfo, navigate]);

  return (
    <Container className="container small-container">
      <Helmet>
        <title>Service Provider Profile</title>
      </Helmet>
      <h1 className="mt-4 mb-4 fw-bold">Service Provider Profile</h1>
      <div className="card p-3 mb-4">
        <h1 className="mt-2 mb-2-italic">{name}</h1>
        {serviceProviderInfo && (
          <div>
            <p>{serviceProviderInfo.typeOfProvider || "N/A"}</p>
            <p>{serviceProviderInfo.experience || "N/A"}</p>
          </div>
        )}
        <div className="footer-icons d-flex mb-4">
          <NavLink href="#" className="me-2">
            <i className="fa-brands fa-facebook"></i>
          </NavLink>
          <NavLink href="#" className="me-2">
            <i className="fa-brands fa-twitter"></i>
          </NavLink>
          <NavLink href="#" className="me-2">
            <i className="fa-brands fa-instagram"></i>
          </NavLink>
          <NavLink href="#" className="me-2">
            <i className="fa-brands fa-linkedin-in"></i>
          </NavLink>
        </div>
      </div>

      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" disabled={loadingUpdate} className="mt-3">
            {loadingUpdate ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Container>
  );
}
