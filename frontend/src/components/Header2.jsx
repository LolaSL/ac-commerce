import React from "react";
import Image from "react-bootstrap/Image";

export default function Header2() {
  return (
    <header style={{ paddingLeft: 0,  marginBottom: "80px" }}>
      <div className="mask">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text">
            <h1 className="header-title  mb-3 text-center">
              Welcome to Air Conditioning With AC Commerce
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
            <h3 className="header1-info  mb-3 ">
              Designed for Optimal Perfomance: Our Air conditioning units
              combine cutting-edge technology, energy efficiency and
              unparalleled cooling carabilities to transform your living or
              work.
            </h3>
          </div>
        </div>
      </div>
    </header>
  );
}
