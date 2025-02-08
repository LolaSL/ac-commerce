import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload.orders,
        page: action.payload.page,
        pages: action.payload.pages,
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

export default function OrderListPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [
    { loading, error, orders, loadingDelete, successDelete, pages },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const sp = new URLSearchParams(search);
  const currentPage = sp.get("page") || 1;

  const [sortedOrders, setSortedOrders] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (orders) {
      const sorted = [...orders].sort((a, b) => {
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];

        if (valueA == null) return 1;
        if (valueB == null) return -1;
        if (valueA === undefined || valueB === undefined) {
          return 0;
        }
        if (
          sortColumn === "date" ||
          sortColumn === "paid" ||
          sortColumn === "delivered"
        ) {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }

        if (sortColumn === "total" || sortColumn === "paid") {
          valueA = parseFloat(valueA.replace(/[^0-9.-]+/g, ""));
          valueB = parseFloat(valueB.replace(/[^0-9.-]+/g, ""));
        }

        if (typeof valueA === "number" && typeof valueB === "number") {
          return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
        }

        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortOrder === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        return 0;
      });

      setSortedOrders(sorted);
    }
  }, [orders, sortColumn, sortOrder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders?page=${currentPage}`, {
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
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete, currentPage]);

  const deleteHandler = async (order) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("order deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-4">
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loadingDelete && <LoadingBox />}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>
                  <button type="button" onClick={() => handleSort("_id")}>
                    ID{" "}
                    {sortColumn === "_id" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => handleSort("user")}>
                    User{" "}
                    {sortColumn === "user" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => handleSort("date")}>
                    Date{" "}
                    {sortColumn === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => handleSort("total")}>
                    Total{" "}
                    {sortColumn === "total" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => handleSort("paid")}>
                    Paid{" "}
                    {sortColumn === "paid" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => handleSort("delivered")}>
                    Delivered{" "}
                    {sortColumn === "delivered" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user ? order.user.name : "DELETED USER"}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : "No"}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(order)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <Link
                    className="page-link"
                    to={`/admin/orders?page=${Number(currentPage) - 1}`}
                  >
                    &lt;
                  </Link>
                </li>
                {[...Array(pages).keys()].map((x) => (
                  <li
                    key={x + 1}
                    className={`page-item ${
                      x + 1 === Number(currentPage) ? "active" : ""
                    }`}
                  >
                    <Link
                      className="page-link"
                      to={`/admin/orders?page=${x + 1}`}
                    >
                      {x + 1}
                    </Link>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === pages ? "disabled" : ""
                  }`}
                >
                  <Link
                    className="page-link"
                    to={`/admin/orders?page=${Number(currentPage) + 1}`}
                  >
                    &gt;
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
