import {  useEffect, useReducer} from "react";
import axios from 'axios';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from "../components/MessageBox ";
import Rating from '../components/Rating';
import { Link } from 'react-router-dom';




const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, sellers: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, sellers: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function SellersPage() {
  const [{ loading, error, sellers }, dispatch] = useReducer(reducer, {
    sellers: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/sellers');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  

  return (
    <div>
      <h1>Sellers</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          {sellers.map((seller) => (
            <div key={seller._id}>
             <Link to={`/sellers/${seller._id}`} className="seller-name text-secondary"><h2 >{seller.name}</h2></Link>
              <p>Brand: {seller.brand}</p>
              <p>Information: {seller.info}</p>
              <div>
                {seller.reviews?.length === 0 && (
                  <MessageBox>No Reviews</MessageBox>
                )} 
               <ul>
                  {seller.reviews?.map((review) => (
                    <li key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating rating={review.rating} caption=" "></Rating>
                      <p>{review.comment}</p>
                      <p>{review.createdAt.substring(0, 10)}</p>
                    </li>
                  ))}
                </ul> 
         </div>
             </div> 
          ))}
        </div>
      )}
    </div>
  );
}
