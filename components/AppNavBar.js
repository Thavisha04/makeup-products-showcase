// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Nov 09, 2025
// File name: AppNavBar.js

import Link from "next/link";
import {useRouter} from "next/router";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function AppNavbar({links}) {

    const router = useRouter();
    const {pathname} = router || {};

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand as={Link} href="/">
                &nbsp;&nbsp;&nbsp;&nbsp;Glowup
            </Navbar.Brand>

            <Nav className="ms-auto">
                {links.map((link, index) => {
                    const href = link === "Home" ? "/" : `/${link.toLowerCase()}`;

                    const isActive =
                        pathname === href ||
                        (link === "Products" && pathname.startsWith("/products"));

                    return (
                        <Nav.Link
                            as={Link}
                            key={index}
                            href={href}
                            aria-current={isActive ? "page" : undefined}
                            active={isActive}
                        >
                            {link}
                        </Nav.Link>
                    );
                })}
            </Nav>
        </Navbar>
    );
}