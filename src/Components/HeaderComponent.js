import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";

import "../App.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { isNavOpen: false };
    this.togglenav = this.togglenav.bind(this);
  }

  togglenav() {
    this.setState({ isNavOpen: !this.state.isNavOpen });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar dark expand="md">
          <div className="container navbar-container">
            <NavbarBrand className="mr-auto">DOCTEL</NavbarBrand>
            <NavbarToggler onClick={this.togglenav} />
            <Collapse
              isOpen={this.state.isNavOpen}
              navbar
              className="d-flex justify-content-between w-100"
            >
              <Nav navbar className="nav-items">
                <NavItem>
                  <NavLink className="nav-link" to="/home">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/signup">
                    Register
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/members">
                    Members
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/patient">
                    Patient
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/patdata">
                    Patient Data
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/treatment">
                    Treatment
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/treat">
                    All Treatment
                  </NavLink>
                </NavItem>
              </Nav>
              <div className="right-info">
                <div>
                  {localStorage.getItem("myAadhar") !== "0"
                    ? `Logged in: ${localStorage.getItem("myAadhar")}`
                    : "Not Logged in"}
                </div>
                <small>
                  {localStorage.getItem("wallet") !== "0"
                    ? `Wallet: ${localStorage.getItem("wallet")}`
                    : "Not Connected"}
                </small>
              </div>
            </Collapse>
          </div>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default Header;
