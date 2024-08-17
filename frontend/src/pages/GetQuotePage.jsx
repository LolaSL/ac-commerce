// import React, { useContext, useEffect, useReducer, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { Store } from "../Store";
// import { getError } from "../utils";
// import Container from "react-bootstrap/Container";
// import Form from "react-bootstrap/Form";
// import { Helmet } from "react-helmet-async";
// import LoadingBox from "../components/LoadingBox";
// import MessageBox from "../components/MessageBox ";
// import Button from "react-bootstrap/Button";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true };
//     case "FETCH_SUCCESS":
//       return { ...state, loading: false };
//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     case "UPDATE_REQUEST":
//       return { ...state, loadingUpdate: true };
//     case "UPDATE_SUCCESS":
//       return { ...state, loadingUpdate: false };
//     case "UPDATE_FAIL":
//       return { ...state, loadingUpdate: false };
//     case "UPLOAD_REQUEST":
//       return { ...state, loadingUpload: true, errorUpload: "" };
//     case "UPLOAD_SUCCESS":
//       return { ...state, loadingUpload: false, errorUpload: "" };
//     case "UPLOAD_FAIL":
//       return { ...state, loadingUpload: false, errorUpload: action.payload };
//     default:
//       return state;
//   }
// };

// const GetQuotePage = () => {
//   const navigate = useNavigate();
//   const params = useParams();
//   const { id: quoteId } = params;

//   const { state } = useContext(Store);
//   const { userInfo } = state;

//   const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
//     useReducer(reducer, {
//       loading: true,
//       error: "",
//     });

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [image, setImage] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [floorNumber, setFloorNumber] = useState("");
//   const [directionOfVentilation, setDirectionOfVentilation] = useState("");
//   const [roomType, setRoomType] = useState([]);
//   const [roomArea, setRoomArea] = useState("");
//   const [wallLength, setWallLength] = useState("");
//   const [scaleSize, setScaleSize] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         dispatch({ type: "FETCH_REQUEST" });
//         const { data } = await axios.get(`/api/quote/${quoteId}`);
//         setName(data.name);
//         setEmail(data.email);
//         setImage(data.image);
//         setPhone(data.phone);
//         setAddress(data.address);
//         setFloorNumber(data.floorNumber);
//         setDirectionOfVentilation(data.directionOfVentilation);
//         setRoomType(data.roomType);
//         setRoomArea(data.RoomArea);
//         setWallLength(data.wallLength);
//         setScaleSize(data.scaleSize);
//         dispatch({ type: "FETCH_SUCCESS" });
//       } catch (err) {
//         dispatch({ type: "FETCH_FAIL", payload: getError(err) });
//       }
//     };
//     fetchData();
//   }, [quoteId]);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch({ type: "UPDATE_REQUEST" });
//       await axios.put(
//         `/api/quote/${quoteId}`,
//         {
//           _id: quoteId,
//           name,
//           email,
//           image,
//           phone,
//           address,
//           floorNumber,
//           directionOfVentilation,
//           roomType,
//           roomArea,
//           wallLength,
//           scaleSize,
//         },
//         {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         }
//       );
//       dispatch({ type: "UPDATE_SUCCESS" });
//       toast.success(" quote updated successfully");
//       navigate("/admin/quote");
//     } catch (err) {
//       toast.error(getError(err));
//       dispatch({ type: "UPDATE_FAIL" });
//     }
//   };

//   const uploadFileHandler = async (e) => {
//     const file = e.target.files[0];
//     const bodyFormData = new FormData();
//     bodyFormData.append("file", file);
//     try {
//       dispatch({ type: "UPLOAD_REQUEST" });
//       await axios.post("/api/upload", bodyFormData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           authorization: `Bearer ${userInfo.token}`,
//         },
//       });

//       dispatch({ type: "UPLOAD_SUCCESS" });
//     } catch (error) {
//       toast.error(getError(error));
//       dispatch({ type: "CREATE_FAIL" });
//     }};
//     return (
//       <Container className="small-container">
//         <Helmet>
//           <title>Edit Quote {quoteId}</title>
//         </Helmet>
//         <h1>Edit Quote {quoteId}</h1>
//         {loading ? (
//           <LoadingBox />
//         ) : error ? (
//           <MessageBox variant="danger">{error}</MessageBox>
//         ) : (
//           <Form onSubmit={submitHandler}>
//             <Form.Group className="mb-3" controlId="name">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3" controlId=" email">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3" controlId="image">
//               <Form.Label>Image File</Form.Label>
//               <Form.Control
//                 value={image}
//                 onChange={(e) => setImage(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3" co ntrolId="imageFile">
//               <Form.Label>Upload Image</Form.Label>
//               <Form.Control type="file" onChange={(e) => uploadFileHandler(e)} />
//             {loadingUpload && <LoadingBox />}
//           </Form.Group>
//             <Form.Group className="mb-3" controlId="phone">
//               <Form.Label> Phone</Form.Label>
//               <Form.Control
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3" controlId="address">
//               <Form.Label> Address</Form.Label>
//               <Form.Control
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3" controlId="floorNumber">
//               <Form.Label>Floor Number</Form.Label>
//               <Form.Control
//                 value={floorNumber}
//                 onChange={(e) => setFloorNumber(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3" controlId="directionOfVentilation">
//               <Form.Label>Direction Of Ventilation</Form.Label>
//               <Form.Control
//                 value={directionOfVentilation}
//                 onChange={(e) => setDirectionOfVentilation(e.target.value)}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3" controlId="roomType">
//               <Form.Label>Room Type</Form.Label>
//               <Form.Select
//                 value={roomType}
//                 onChange={(e) => setRoomType(e.target.value)}
//               >
//                 <option value="">Select Room Type</option>
//                 <option value="Bedroom">Bedroom</option>
//                 <option value="Living room + Windows">
//                   Living room + Windows
//                 </option>
//                 <option value="Living room">Living room</option>
//                 <option value="Kitchen">Kitchen</option>
//                 <option value="Basement">Basement</option>
//                 <option value="Open space">Open space</option>
//                 <option value="Office">Office</option>
//                 <option value="Meeting room">Meeting room</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3" controlId="wallLength">
//               <Form.Label>wallLength</Form.Label>
//               <Form.Control
//                 value={wallLength}
//                 onChange={(e) => setWallLength(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3" controlId="scaleSize">
//               <Form.Label>ScaleSize</Form.Label>
//               <Form.Control
//                 value={scaleSize}
//                 onChange={(e) => setScaleSize(e.target.value)}
//               />
//             </Form.Group>
//             <div className="mb-3">
//               <Button disabled={loadingUpdate} type="submit">
//                 Submit
//               </Button>
//               {loadingUpdate && <LoadingBox />}
//             </div>
//           </Form>
//         )}
//       </Container>
//     );

// };

// export default GetQuotePage;

import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

const GetQuotePage = () => {
  const navigate = useNavigate();
  const { id: quoteId } = useParams();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [directionOfVentilation, setDirectionOfVentilation] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomArea, setRoomArea] = useState("");
  const [wallLength, setWallLength] = useState("");
  const [scaleSize, setScaleSize] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/quote/${quoteId}`);
        setName(data.name);
        setEmail(data.email);
        setImage(data.image);
        setPhone(data.phone);
        setAddress(data.address);
        setFloorNumber(data.floorNumber);
        setDirectionOfVentilation(data.directionOfVentilation);
        setRoomType(data.roomType);
        setRoomArea(data.roomArea);
        setWallLength(data.wallLength);
        setScaleSize(data.scaleSize);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [quoteId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.post(
        `/api/quote/${quoteId}`,
        {
          _id: quoteId,
          name,
          email,
          image,
          phone,
          address,
          floorNumber,
          directionOfVentilation,
          roomType,
          roomArea,
          wallLength,
          scaleSize,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Quote updated successfully");
      navigate("/admin/quote");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.put("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(error) });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Quote {quoteId}</title>
      </Helmet>
      <h1>Edit Quote {quoteId}</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {loadingUpload && <LoadingBox />}
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="floorNumber">
            <Form.Label>Floor Number</Form.Label>
            <Form.Control
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="directionOfVentilation">
            <Form.Label>Direction Of Ventilation</Form.Label>
            <Form.Control
              value={directionOfVentilation}
              onChange={(e) => setDirectionOfVentilation(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="roomType">
            <Form.Label>Room Type</Form.Label>
            <Form.Select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="">Select Room Type</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Living room + Windows">
                Living room + Windows
              </option>
              <option value="Living room">Living room</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Basement">Basement</option>
              <option value="Open space">Open space</option>
              <option value="Office">Office</option>
              <option value="Meeting room">Meeting room</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="wallLength">
            <Form.Label>Wall Length</Form.Label>
            <Form.Control
              value={wallLength}
              onChange={(e) => setWallLength(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="scaleSize">
            <Form.Label>Scale Size</Form.Label>
            <Form.Control
              value={scaleSize}
              onChange={(e) => setScaleSize(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Submit
            </Button>
            {loadingUpdate && <LoadingBox />}
          </div>
        </Form>
      )}
    </Container>
  );
};

export default GetQuotePage;
