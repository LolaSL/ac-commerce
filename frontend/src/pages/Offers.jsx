import React, { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap"; 
import { Link } from "react-router-dom";

export default function Offers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  const offers = [
    {
      title: "Winter Sale!",
      description: "Get up air conditioners on sale!",
      imageSrc: "/images/offer1.jpg",
      linkTo: "/products",
      linkText: "Shop Now",
      criteria: (product) => product.discount >= 20 && product.discount <= 31, 
    },
    {
      title: "Energy Saver Discount",
      description: "Save money and energy!",
      imageSrc: "/images/offer2.jpg",
      linkTo: "/products",
      linkText: "Learn More",
      criteria: (product) => product.discount === 50, 
    },
    {
      title: "Combo Deals",
      description: "Buy 2 AC units and get free installation.",
      imageSrc: "/images/offer3.jpg",
      linkTo: "/products",
      linkText: "Explore Deals",
      criteria: () => true,
    },
  ];
  
  

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filterOffers = () => {
    if (loading) return [];
    return offers.filter(
      (offer) => typeof offer.criteria === "function" && products.some(offer.criteria) 
    );
  };
  


  const filteredOffers = filterOffers();

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Special Offers</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredOffers.length > 0 ? (
        <div className="row">
          {filteredOffers.map((offer, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <Card>
                <Card.Img
                  variant="top"
                  src={offer.imageSrc}
                  alt={offer.title}
                />
                <Card.Body>
                  <Card.Title>{offer.title}</Card.Title>
                  <Card.Text>{offer.description}</Card.Text>

                  <Button
                    variant="secondary"
                    as={Link}
                    to="/products"
                  >
                    {offer.linkText}
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">
          No offers match your criteria at this time.
        </p>
      )}
    </div>
  );
}
