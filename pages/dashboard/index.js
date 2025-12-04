import { AuthContext } from "@/components/AuthContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Dashboard() {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    // RBAC Gatekeeping
    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/");
            } else if (user.role !== "admin") {
                alert("Access Denied: Admins Only");
                router.push("/");
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <Container className="py-5">
                <Card body className="text-center">
                    <h5>Loading Dashboard...</h5>
                </Card>
            </Container>
        );
    }

    if (!user || user.role !== "admin") return null;

    return (
        <Container className="py-5" style={{ maxWidth: "900px" }}>
            <Card className="shadow-lg">
                <Card.Body>
                    <h2 className="fw-bold mb-1 text-center">Admin Dashboard</h2>
                    <p className="text-center text-muted">
                        Welcome, <strong>{user.email}</strong>
                    </p>

                    <hr />

                    {/* Quick Access Links */}
                    <h5 className="fw-semibold mb-3">Quick Access</h5>

                    <Row className="g-3">
                        <Col md={12}>
                            <Link href="/makeup" passHref legacyBehavior>
                                <Button variant="dark" className="w-100 py-2">
                                    View All Products
                                </Button>
                            </Link>
                        </Col>
                    </Row>

                    {/* Admin Info */}
                    <Card className="mt-4 bg-light border-0">
                        <Card.Body>
                            <h6 className="fw-bold mb-2">Role Based Permissions</h6>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="ps-0">
                                    ✔ Admins can edit or delete <strong>any product</strong>.
                                </ListGroup.Item>
                                <ListGroup.Item className="ps-0">
                                    ✔ Authors can edit/delete <strong>only their own</strong> products.
                                </ListGroup.Item>
                                <ListGroup.Item className="ps-0">
                                    ✔ Viewers can only browse products (read-only).
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Card.Body>
            </Card>
        </Container>
    );
}
