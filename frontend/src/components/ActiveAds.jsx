import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      console.log("Fetched Ads:", action.payload); 
      return { ...state, loading: false, ads: action.payload, error: "" };
    case "FETCH_FAIL":
      console.error("Error fetching ads:", action.payload);
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ActiveAds = () => {
  const [{ loading, error, ads }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    ads: [],
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo?.token) {
      const fetchData = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await axios.get(`/api/ads/`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: "FETCH_SUCCESS", payload: { ads: data } });
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
      };

      fetchData();
    }
  }, [userInfo]);

  if (loading) {
    return <p>Loading ads...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Active Ads</h2>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <ul>
          {ads.map((ad) => (
            <li key={ad._id}>
              <a href={ad.link} target="_blank" rel="noopener noreferrer">
                <img src={ad.image} alt={ad.title} width="200" />
              </a>
              <p>{ad.title}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveAds;
