// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: Index.js

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Link from "next/link";


export default function Home() {
  return (
      <>
        <section className="bg-light text-center py-5">
          <div className="container-fluid p-0">
            <h1 className="display-4 fw-bold">Glow Up With Confidence 💄✨</h1>
            <p className="lead mt-3">
              Discover beauty products that bring out the best in you – skincare, makeup, and more.
            </p>
            <Link href="/products">
            <Button variant="dark" size="lg" className="mt-3">
              Shop Now
            </Button>
            </Link>
          </div>
        </section>

        <section className="py-5">
          <Container>
            <Row className="g-4 text-center">
              <Col md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <h2>🧴 Skincare Essentials</h2>
                    <p>Nourish your skin with our best-selling serums and creams.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <h2>💋 Makeup Must-Haves</h2>
                    <p>From bold lips to natural looks, find your perfect match.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <h2>🌸 Fragrance Collection</h2>
                    <p>Find scents that make every moment unforgettable.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="bg-dark text-white py-5">
          <div className="container-fluid p-0">
            <h2 className="text-center mb-4">Why Choose Glow Up?</h2>
            <Row className="text-center">
              <Col md={3} sm={6}>
                <p>🌿 Cruelty-Free & Sustainable</p>
              </Col>
              <Col md={3} sm={6}>
                <p>🚚 Free Shipping over $50</p>
              </Col>
              <Col md={3} sm={6}>
                <p>⭐ Top-Rated Products</p>
              </Col>
              <Col md={3} sm={6}>
                <p>💖 Beauty for Everyone</p>
              </Col>
            </Row>
          </div>
        </section>

        <section className="py-5 bg-light">
          <Container>
            <h2 className="text-center mb-4">What Our Customers Say</h2>
            <Row className="g-4">
              <Col md={6}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <blockquote className="blockquote mb-0">
                      <p>
                        “Glow Up has completely transformed my skincare routine! My skin has never
                        felt better.”
                      </p>
                      <footer className="blockquote-footer">Sarah M.</footer>
                    </blockquote>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <blockquote className="blockquote mb-0">
                      <p>
                        “Affordable and amazing quality. I always get compliments on my makeup!”
                      </p>
                      <footer className="blockquote-footer">Jade T.</footer>
                    </blockquote>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="text-center py-5">
          <div className="container-fluid p-0">
            <h2 className="fw-bold">✨ Ready to Glow? ✨</h2>
            <Link href="/products">
              <Button variant="dark" size="lg" className="mt-3">
                Browse Products
              </Button>
            </Link>
          </div>
        </section>
      </>
  );
}