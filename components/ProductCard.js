// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: ProductCard.js

import Link from "next/link";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Image from "next/image";

export default function ProductCard({ product }) {
    if (!product) return null;

    // Use the products route (/products/[id])
    const productHref = `/products/${product.id}`;

    return (
        <Card style={{ width: "18rem" }} className="shadow-sm mb-4">
            {product.image && (
                <Image
                    src={product.image}
                    alt={product.title}
                    className="card-img-top"
                    style={{ height: "250px", objectFit: "cover" }}
                />
            )}
            <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text className="fw-bold text-success">${product.price}</Card.Text>
                <Card.Text>⭐ {product.rating ?? "N/A"}</Card.Text>

                <div className="mb-2">

                        <Badge bg="dark" className="me-1">
                            {product.tag}
                        </Badge>
                </div>

                <Link href={productHref} legacyBehavior>
                    <a className="btn btn-dark btn-sm">View Details</a>
                </Link>
            </Card.Body>
        </Card>
    );
}