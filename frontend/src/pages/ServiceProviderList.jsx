import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        serviceProviders: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function ServiceProviderList() {
  const [
    { loading, error, serviceProviders, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { serviceProviderInfo, userInfo } = state;
  const { token } = userInfo; 

  
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/service-providers/`, config); 
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (token) {
      fetchData();
    } else {
      console.error("Token is missing or invalid");
    }
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [serviceProviderInfo, successDelete, token]);
  useEffect(() => {
    if (!serviceProviderInfo) {
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await axios.get(`/api/service-providers/`, {
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
    }
  }, [serviceProviderInfo, userInfo.token]);

  const deleteHandler = async (serviceProviders) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/service-providers/${serviceProviders._id}`, {
          headers: { Authorization: `Bearer ${serviceProviderInfo.token}` },
        });
        toast.success("service Provider deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  return (
    <div>
      <Helmet>
        <title>Service Providers</title>
      </Helmet>
      <h1>Service Providers</h1>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
                  <th>IS ADMIN</th>
                  <th>IS ACTIVE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {serviceProviders.map((serviceProvider) => (
              <tr key={serviceProvider._id}>
                <td>{serviceProvider._id}</td>
                <td>{serviceProvider.name}</td>
                <td>{serviceProvider.email}</td>
                <td>{serviceProvider.isAdmin ? "YES" : "NO"}</td>
                <td>{serviceProvider.isActive ? "YES" : "NO"}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/admin/manage-service-providers/${serviceProvider._id}`)}
                  >
                    Edit
                  </Button>
                  </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(serviceProvider)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
