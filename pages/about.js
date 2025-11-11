// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: About.jsx

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import NavBar from "@/components/AppNavBar.js";
import Footer from "@/components/Footer.js";

export default function About() {
    return (
        <div className="app-container">
            <NavBar links={['Home', 'Products', 'About']}/>

            <section className="py-5 bg-light full-width">
                <Container>
                    <Row className="justify-content-center text-center mb-4">
                        <Col md={8}>
                            <h1 className="fw-bold display-5">About Us</h1>
                            <p className="lead text-muted">
                                Welcome to our world of beauty, where every product is designed to help you feel
                                confident,
                                radiant,
                                and unapologetically yourself.
                            </p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col md={6}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body>
                                    <p>
                                        Our makeup collection is crafted with high-quality ingredients, vibrant
                                        pigments,
                                        and long-lasting formulas that celebrate all skin tones and styles.
                                    </p>
                                    <p>
                                        Whether you’re creating a bold look for a night out or enhancing your natural
                                        glow
                                        for
                                        everyday wear, our mission is simple: to inspire self-expression through makeup.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body>
                                    <p>
                                        Beauty is more than skin deep—it’s an art, a mood, and a reflection of who you
                                        are.
                                    </p>
                                    <p>
                                        Join us in redefining beauty standards and discover products made to empower,
                                        not
                                        just enhance. 💄✨
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
            <Footer />
        </div>
    );

}


