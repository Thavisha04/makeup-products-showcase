// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Dec 03, 2025
// File name: AppNavBar.js

import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AuthContext } from "@/components/AuthContext";
import LoginForm from "@/components/LoginForm";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

export default function NavBar() {
    const router = useRouter();
    const isActive = (pathname) => router.pathname === pathname;
    const { user, logout } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false);

    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            expanded={expanded}
            className="py-2"
            sticky="top"
        >
            <Container>
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    onClick={() => setExpanded(!expanded)}
                />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            as={Link}
                            href="/"
                            className={isActive("/") ? "active" : ""}
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            href="/about"
                            className={isActive("/about") ? "active" : ""}
                        >
                            About
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            href="/makeup"
                            className={isActive("/makeup") ? "active" : ""}
                        >
                            Products
                        </Nav.Link>
                        {user && (
                            <Nav.Link
                                as={Link}
                                href={`/makeup/author/${encodeURIComponent(user.email)}/page/1`}
                                className={router.pathname.startsWith("/makeup/author") ? "active" : ""}
                            >
                                Author
                            </Nav.Link>
                        )}
                    </Nav>

                    <Nav className="ms-auto mt-3 mt-lg-0 d-flex align-items-lg-center gap-2 flex-column flex-lg-row">
                        {user ? (
                            <>
            <span className="text-white small text-center text-lg-start">
                Hello, <strong>{user.email}</strong>
            </span>

                                {user.role === "admin" && (
                                    <Nav.Link
                                        as={Link}
                                        href="/dashboard"
                                        className="text-info fw-semibold"
                                    >
                                        Admin Panel
                                    </Nav.Link>
                                )}

                                <Button
                                    size="sm"
                                    variant="outline-light"
                                    onClick={logout}
                                    className="w-100 w-lg-auto"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="w-100 w-lg-auto">
                                <LoginForm />
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
