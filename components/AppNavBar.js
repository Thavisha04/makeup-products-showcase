import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "@/components/AuthContext";
import LoginForm from "@/components/LoginForm";

export default function NavBar() {
    const router = useRouter();
    const isActive = (pathname) => router.pathname === pathname;
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <ul className="navbar-nav w-100 d-flex align-items-center gap-3">

                {/* ---- NAV LINKS ---- */}
                <li className="nav-item">
                    <Link
                        href="/"
                        className={`nav-link ${isActive("/") ? "active" : ""}`}
                        aria-current={isActive("/") ? "page" : undefined}
                    >
                        Home
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        href="/about"
                        className={`nav-link ${isActive("/about") ? "active" : ""}`}
                        aria-current={isActive("/about") ? "page" : undefined}
                    >
                        About
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        href="/makeup"
                        className={`nav-link ${isActive("/makeup") ? "active" : ""}`}
                        aria-current={isActive("/makeup") ? "page" : undefined}
                    >
                        Products
                    </Link>
                </li>

                {/* ---- Author route ---- */}
                <li className="nav-item">
                    {user && (
                        <Link
                            href={`/makeup/author/${encodeURIComponent(user.email)}/page/1`}
                            className={`nav-link ${router.pathname.startsWith("/makeup/author") ? "active" : ""}`}
                            aria-current={router.pathname.startsWith("/makeup/author") ? "page" : undefined}
                        >
                            Author
                        </Link>
                    )}
                </li>


                {/* ---- USER SECTION ---- */}
                <li className="ms-auto d-flex align-items-center gap-3">

                    {user ? (
                        <>
                            {/* Greeting */}
                            <span className="text-white small">
                                Hello, <strong>{user.email}</strong>
                            </span>

                            {/* Admin Panel */}
                            {user.role === "admin" && (
                                <Link
                                    href="/dashboard"
                                    className="nav-link text-info fw-semibold"
                                >
                                    Admin Panel
                                </Link>
                            )}

                            {/* Logout Button */}
                            <button
                                onClick={logout}
                                className="btn btn-outline-light btn-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <LoginForm />
                    )}

                </li>
            </ul>
        </nav>
    );
}
