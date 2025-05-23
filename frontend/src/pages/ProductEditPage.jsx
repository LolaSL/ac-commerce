import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
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

const ProductEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [mode, setMode] = useState("");
  const [btu, setBtu] = useState("");
  const [areaCoverage, setAreaCoverage] = useState("");
  const [energyEfficiency, setEnergyEfficiency] = useState("");
  const [discount, setDiscount] = useState("");
  const [documents, setDocuments] = useState([]);
  const [dimension, setDimension] = useState({
    width: "",
    height: "",
    depth: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/products/${productId}`);

        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        setFeatures(data.features);
        setMode(data.mode);
        setBtu(data.btu);
        setAreaCoverage(data.areaCoverage);
        setEnergyEfficiency(data.energyEfficiency);
        setDiscount(data.discount);
        setDocuments(data.documents || []);
        setDimension({
          width: data.dimension?.width || "",
          height: data.dimension?.height || "",
          depth: data.dimension?.depth || "",
        });

        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });

      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          brand,
          countInStock,
          description,
          features,
          mode,
          btu,
          areaCoverage,
          energyEfficiency,
          discount,
          documents,
          dimension: {
            width: dimension.width,
            height: dimension.height,
            depth: dimension.depth,
          },
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    bodyFormData.append("productId", productId);

    try {
      dispatch({ type: "UPLOAD_REQUEST" });

      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      dispatch({ type: "UPLOAD_SUCCESS" });

      if (file.type === "application/pdf") {
        setDocuments([
          ...documents,
          { url: data.imageUrl, extractedText: data.extractedText },
        ]);
      } else if (forImages) {
        setImages([...images, data.imageUrl]);
      } else {
        setImage(data.imageUrl);
      }

      toast.success("File uploaded successfully. Click Update to apply it.");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };

  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success("Image removed successfully. click Update to apply it");
  };

  return (
    <Container className="small-container">
      <h1>Edit Product {productId}</h1>
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
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
            <Form.Control type="file" onChange={(e) => uploadFileHandler(e)} />
            {loadingUpload && <LoadingBox />}
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImage">
            <Form.Label>Additional Images</Form.Label>
            {images.length === 0 && <MessageBox>No image</MessageBox>}
            <ListGroup variant="flush">
              {images.map((x) => (
                <ListGroup.Item key={x}>
                  {x}
                  <Button variant="light" onClick={() => deleteFileHandler(x)}>
                    <i className="fa fa-times-circle"></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImageFile">
            <Form.Label>Upload Aditional Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => uploadFileHandler(e, true)}
            />
            {loadingUpload && <LoadingBox />}
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="features">
            <Form.Label>Features</Form.Label>
            <Form.Control
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="features">
            <Form.Label>Mode</Form.Label>
            <Form.Control
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="btu">
            <Form.Label>BTU</Form.Label>
            <Form.Control
              value={btu}
              onChange={(e) => setBtu(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="areaCoverage">
            <Form.Label>Area Coverage</Form.Label>
            <Form.Control
              value={areaCoverage}
              onChange={(e) => setAreaCoverage(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="energyEfficiency">
            <Form.Label>Energy Efficiency</Form.Label>
            <Form.Control
              value={energyEfficiency}
              onChange={(e) => setEnergyEfficiency(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="productDiscount">
            <Form.Label>Product Discount</Form.Label>
            <Form.Control
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="documents">
            <Form.Label>Documents</Form.Label>
            {documents.length === 0 && (
              <MessageBox>No document uploaded</MessageBox>
            )}
            <ListGroup variant="flush">
              {documents.map((doc) => (
                <ListGroup.Item key={doc.url}>
                  {doc.url}
                  <Button
                    variant="light"
                    onClick={() => deleteFileHandler(doc.url, "documents")}
                  >
                    <i className="fa fa-times-circle"></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="uploadDocument">
            <Form.Label>Upload Document</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => uploadFileHandler(e, "documents")}
            />
            {loadingUpload && <LoadingBox />}
          </Form.Group>

          <Form.Group className="mb-3" controlId="dimensionWidth">
            <Form.Label>Dimension - Width</Form.Label>
            <Form.Control
              value={dimension.width}
              onChange={(e) =>
                setDimension({ ...dimension, width: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="dimensionHeight">
            <Form.Label>Dimension - Height</Form.Label>
            <Form.Control
              value={dimension.height}
              onChange={(e) =>
                setDimension({ ...dimension, height: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="dimensionDepth">
            <Form.Label>Dimension - Depth</Form.Label>
            <Form.Control
              value={dimension.depth}
              onChange={(e) =>
                setDimension({ ...dimension, depth: e.target.value })
              }
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button
              disabled={loadingUpdate}
              type="submit"
              className="btn btn-secondary"
            >
              Update
            </Button>
            {loadingUpdate && <LoadingBox />}
          </div>
        </Form>
      )}
    </Container>
  );
};

export default ProductEditPage;
