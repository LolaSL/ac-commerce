import React from "react";
import Image from "react-bootstrap/Image";



export default function Header() {
  return (
    <header style={{ paddingLeft: 0 ,  marginBottom:"20px"}}>
        <div className="mask">
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text">
            <h1 className="header-title mb-3 text-center">Discover The Ultimate Air</h1>
            <Image className="p-2 text-center responsive  mb-4" src="/images/home.jpg" alt="Header" />
              <h3 className="header-info  mb-3">
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
