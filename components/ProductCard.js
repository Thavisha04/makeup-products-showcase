// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: ProductCard.js

// components/ProductCard.js
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "next/image";

export default function ProductCard({ product }) {
    const { id, title, author, image } = product;

    return (
        <Card className="bg-dark text-light mb-4">
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
                {author && <Card.Text className="text-muted">{author}</Card.Text>}

                <Link href={`/makeup/product/${id}`} legacyBehavior>
                    <Button variant="light" size="sm">
                        View Details
                    </Button>
                </Link>
            </Card.Body>
        </Card>
    );
}