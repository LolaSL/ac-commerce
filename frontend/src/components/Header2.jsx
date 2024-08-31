import React from "react";
import Image from "react-bootstrap/Image";


export default function Header2() {
  return (
    <header style={{ paddingLeft: 0 }}>
      <div className="mask">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text">
            <h1 className="header-title  mb-3 text-center">
              Welcome to Air Conditioning
            </h1>
            <Image
              className="p-2 text-center responsive  mb-4"
              src="/images/header2.jpg"
              alt="Header"
            />
            <h3 className="header1-info  mb-3 ">
              Stay cool and comfortable all year and revolutionize climate with
              our advanced air conditioning.
            </h3>
          </div>
        </div>
      </div>
    </header>
  );
}
