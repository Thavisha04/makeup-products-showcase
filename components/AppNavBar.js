// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: AppNavBar.js

import {Link} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function AppNavbar({links}) {

    return (
        <Navbar bg="dark" variant="dark">

            <Navbar.Brand as={Link} to="/">&nbsp;&nbsp;&nbsp;&nbsp;Glowup</Navbar.Brand>

            <Nav className="ms-auto">
                {links.map((link, index) => (
                    <Nav.Link
                        as={Link} key={index} to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                    >{link}
                    </Nav.Link>
                ))}
            </Nav>
        </Navbar>

    );
}

export default AppNavbar;