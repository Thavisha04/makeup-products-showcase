// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: [id].js

import {Navigate, useParams} from "react-router-dom";
import {useContext} from "react";
import {ProductContext} from "../context/ProductContext.js";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function ProductDetail() {
    const {id} = useParams();
    const {products} = useContext(ProductContext);

    const product = products.find((p) => p.id === parseInt(id));

    if (!product) return <Navigate to="/not-found" replace/>;

    return (
        <Container className="my-5">
            <Row className="align-items-center">
                <Col md={6} className="text-center">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="img-fluid"
                        style={{maxHeight: "350px", objectFit: "contain"}}
                    />
                </Col>

                <Col md={6} className="text-center">
                    <h3 className="fw-bold">${product.price}</h3>
                    <p className="text-uppercase text-muted mb-2">{product.title}</p>
                    <p className="text-secondary">{product.description}</p>

                    <div className="mb-2">
                        <strong>Category:</strong> {product.category}
                    </div>
                    <div className="mb-2">
                        <strong>Rating:</strong> ⭐ {product.rating}
                    </div>
                    <div className="mb-2">
                        <strong>Brand:</strong> {product.brand}
                    </div>
                    {product.tags && (
                        <div className="mb-3">
                            {product.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="badge bg-light text-dark border me-1"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <Button variant="outline-dark" size="lg">
                        ADD TO CART
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default ProductDetail;
