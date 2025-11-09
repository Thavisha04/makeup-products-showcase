// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: ProductList.js

import {useContext} from "react";
import {PostContext} from "./PostContext.js";
import Link from "next/link";
import ProductCard from "./ProductCard.jsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function ProductList({products}) {
    if (!products || !products.length === 0) {
        return <p>No products available</p>
    }

    return (
        <div className="product-list">
            <Row className="g-4">
                {products.map((p) => (
                    <Col key={p.id} xs={12} sm={6} md={4} lg={3}>
                        <Link href={`/products/${p.id}`}>
                            <ProductCard product={p} />
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
