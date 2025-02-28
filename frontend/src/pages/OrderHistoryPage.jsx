import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox.jsx";
import MessageBox from "../components/MessageBox.jsx";
import { Store } from "../Store.js";
import { getError } from "../utils";
import Button from "react-bootstrap/esm/Button";
import { Link, useLocation } from 'react-router-dom';

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
    default:
      return state;
  }
};

export default function OrderHistoryPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const { search } = useLocation();
  const [{ loading, error, orders,  pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",


  });

  const sp = new URLSearchParams(search);
  const currentPage = sp.get("page") || 1;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `/api/orders/mine?page=${currentPage}`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo, currentPage]);
  return (
    <div>
    <Helmet>
      <title>Order History</title>
    </Helmet>

    <h1>Order History</h1>
    {loading ? (
      <LoadingBox />
    ) : error ? (
      <MessageBox variant="danger">{error}</MessageBox>
    ) : (
      <>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : "No"}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
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
