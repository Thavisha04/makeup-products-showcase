// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Nov 09, 2025
// File name: AppNavBar.js

// components/AppNavBar.js
import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function AppNavbar({ links = [] }) {
    const router = useRouter();
    const { pathname } = router || {};

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
            <Navbar.Brand as={Link} href="/">
                Glowup
            </Navbar.Brand>

            <Nav className="ms-auto">
                {links.map((link, index) => {
                    // 👇 Fix the href so “Products” goes to /makeup
                    const href =
                        link === "Home"
                            ? "/"
                            : link === "Products"
                                ? "/makeup"
                                : `/${link.toLowerCase()}`;

                    // 👇 Adjust active link detection
                    const isActive =
                        pathname === href ||
                        (link === "Products" && pathname.startsWith("/makeup"));

                    return (
                        <Nav.Link
                            key={index}
                            as={Link}
                            href={href}
                            className={isActive ? "active" : ""}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {link}
                        </Nav.Link>
                    );
                })}
            </Nav>
        </Navbar>
    );
}
