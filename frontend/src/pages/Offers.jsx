import React from "react";
import { Card, Button } from "react-bootstrap"; // Using React-Bootstrap for styling

export default function OffersPage() {
  const offers = [
    {
      title: "Winter Sale!",
      description:
        "Get up to 30% off on select air conditioners. Offer valid till stocks last.",
      imageSrc: "/images/offer1.jpg",
      linkTo: "/products",
      linkText: "Shop Now",
    },
    {
      title: "Energy Saver Discount",
      description:
        "Save money and energy! Special discounts on energy-efficient models.",
      imageSrc: "/images/offer2.jpg",
      linkTo: "/products",
      linkText: "Learn More",
    },
    {
      title: "Combo Deals",
      description:
        "Buy 2 AC units and get a free installation service. Limited time offer!",
      imageSrc: "/images/offer3.jpg",
      linkTo: "/products",
      linkText: "Explore Deals",
    },
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Special Offers</h1>
      <div className="row">
        {offers.map((offer, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <Card>
              <Card.Img variant="top" src={offer.imageSrc} alt={offer.title} />
              <Card.Body>
                <Card.Title>{offer.title}</Card.Title>
                <Card.Text>{offer.description}</Card.Text>
                <Button variant="primary" href={offer.linkTo}>
                  {offer.linkText}
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
