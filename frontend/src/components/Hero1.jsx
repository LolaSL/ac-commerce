import React from "react";
import Image from "react-bootstrap/Image";

export default function Header() {
  return (
    <header style={{ paddingLeft: 0 }}>
      <div className="mask">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text">
            <h1 className="mb-3 hero-title text-center">Our Mission</h1>
            <Image
              className="p-2 text-center responsive  mb-4"
              src="/images/hero1.jpg"
              alt="Hero"
            />
            <p className="mb-2 featured-products mt-4 ">
              At the heart of our company of a commitment to providing
              exceptional air conditioning solutions that not only keep your
              comfortable but also contribute to a more sustainable further. We
              believe in power of innovation to revolutionize the way we control
              and manage our indoor.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
