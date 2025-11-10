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
    const pathname = router?.pathname || "";

    return (
        <Navbar bg="dark" variant="dark" className="px-3">
            <Link href="/" legacyBehavior>
                <a className="navbar-brand">Glowup</a>
            </Link>

            <Nav className="ms-auto">
                {links.map((link, index) => {
                    const href = link.toLowerCase() === "home" ? "/" : `/${link.toLowerCase()}`;
                    const isActive =
                        pathname === href || (link === "Products" && pathname.startsWith("/products"));

                    return (
                        <div key={index} className="nav-item">
                            <Link href={href} legacyBehavior>
                                <a
                                    className={`nav-link ${isActive ? "active" : ""}`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {link}
                                </a>
                            </Link>
                        </div>
                    );
                })}
            </Nav>
        </Navbar>
    );
}
