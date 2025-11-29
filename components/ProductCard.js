// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Nov 09, 2025
// File name: ProductCard.js

import Link from "next/link";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "next/image";
import Badge from "react-bootstrap/Badge";

export default function ProductCard({ product }) {
    const { id, title, price, rating, image, tag, author } = product;

    return (
        <Card className="shadow-sm mb-4">
            {image ? (
                <div style={{ position: "relative", width: "100%", height: 300 }}>
                    <Image
                        src={image}
                        alt={title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            ) : (
                <div
                    style={{
                        width: "100%",
                        height: 300,
                        backgroundColor: "#333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <span>No Image</span>
                </div>
            )}

            <Card.Body>
                <Card.Title>{title}</Card.Title>

                {price && (
                    <Card.Text className="fw-bold text-success">${price}</Card.Text>
                )}

                {rating && <Card.Text>⭐ {rating}</Card.Text>}

                {tag && (
                    <div className="mb-2">
                        <Badge bg="dark">{tag}</Badge>
                    </div>
                )}

                {author && <Card.Text>{author}</Card.Text>}

                <Link href={`/makeup/product/${id}`} className="variant sm">
                    <Button variant="dark" size="sm" className="mt-3">View Details</Button>
                </Link>
            </Card.Body>
        </Card>
    );
}