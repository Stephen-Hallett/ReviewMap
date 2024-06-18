import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

import logo from "../static/images/CoffeeBear.png";

const NavbarComponent = () => {
  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Nav className="justify-content-start">
            <Nav.Link href="/home">Home</Nav.Link>
          </Nav>
          <Nav className="justify-content-center">
            <Navbar.Brand href="/home" className="ms-auto">
              <b>Adventure Bear </b>
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
            </Navbar.Brand>
          </Nav>
          <Nav className="justify-content-end">
            <Button type="submit" variant="secondary" className="ms-auto">
              + Add Location
            </Button>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
