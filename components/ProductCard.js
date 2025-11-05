// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: ProductCard.js

import {Link} from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

function ProductCard({product}) {
    return (
        <Card style={{width: "18rem"}} className="shadow-sm mb-4">
            <Card.Img
                variant="top"
                src={product.image}
                alt={product.title}
                style={{height: "250px", objectFit: "cover"}}
            />
            <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text className="fw-bold text-success">
                    ${product.price}
                </Card.Text>
                <Card.Text>⭐ {product.rating}</Card.Text>
                <div className="mb-2">
                    {product.tags.slice(0, 2).map((tag, index) => (
                        <Badge bg="dark" key={index} className="me-1">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <Button
                    as={Link}
                    to={`/product/${product.id}`}
                    variant="dark"
                    size="sm"
                >
                    View Details
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;