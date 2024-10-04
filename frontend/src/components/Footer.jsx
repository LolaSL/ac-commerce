import React from "react";
import NavLink from "react-bootstrap/NavLink";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";



const Footer = () => {
  return (
    <>
      <Container fluid>
        <footer className="footer ">
          <Row className="bg-secondary text-white p-4">
            <Col className="col-md-6 col-lg-5 col-12 ft-1">
                 <div> <i className="fa-solid fa-air-conditioner"> 
                 </i>               
             <h3>
                <span>AC</span> Commerce
                </h3>
                <h5>
                Cooling Solutions For Every Space
                </h5>
              </div>
                 <p>  We believe in power of innovation to revolutionize the way we
                  control and manage our indoor.
                </p>
       
              <div className="footer-icons d-flex mb-4">
                <NavLink href="#">
                  {" "}
                  <i className="fa-brands fa-facebook"></i>
                </NavLink>
                <NavLink href="#">
                  {" "}
                  <i className="fa-brands fa-twitter"></i>
                </NavLink>
                <NavLink href="#">
                  {" "}
                  <i className="fa-brands fa-instagram"></i>
                </NavLink>
                <NavLink href="#">
                  {" "}
                  <i className="fa-brands fa-linkedin-in"></i>
                </NavLink>
              </div>
            </Col>
            <Col className="col-md-6 col-lg-3 col-12 ft-2 mb-4">
              <h5>Quick Links</h5>
              <NavLink className="text-white" href="/">
                Home
              </NavLink>
                 <NavLink className="text-white" href="/about-us">
                About Us
              </NavLink>
              <NavLink className="text-white" href="/products">
                Products
              </NavLink>
              <NavLink className="text-white" href="/sellers">
                Sellers
              </NavLink>
              <NavLink className="text-white" href="/upload-pdf">
                Services
              </NavLink>
           
              <NavLink className="text-white" href="/blogs">Blogs
            </NavLink>
            </Col>
            <Col className="col-md-6 col-lg-4 col-12 ft-3">
              <h5>Contact</h5>
              <p>
                <i className="fa-solid fa-phone-volume"></i> Phone: (123) 456-7890
              </p>
              <p>
                <i className="fa-solid fa-envelope"></i>Email: contact@example.com
              </p>
              <p>
                <i className="fa-solid fa-paper-plane"></i> 1234 Street Name
              </p>
              <p>
                <i className="fa-solid fa-paper-plane"></i>City, State, Zip Code
              </p>
            </Col>
            <div className="last-footer bg-secondary">
              <p className="text-center">
                &copy; {new Date().getFullYear()} AC Commerce. All rights
                reserved
              </p>
            </div>
          </Row>
        </footer>
      </Container>
    </>
  );
};

export default Footer;
