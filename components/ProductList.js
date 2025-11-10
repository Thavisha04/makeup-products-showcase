// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: ProductList.js

import { useContext } from "react";
import { ProductContext } from "@/components/ProductContext.js";
import ProductCard from "@/components/ProductCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function ProductList({ products = [], page = 1, totalProducts = 0, totalPages = 1, onPageChange }) {
    // defensive check
    if (!products || products.length === 0) {
        return <p>No products available</p>;
    }

    return (
        <div className="product-list">
            <h3>
                Products (Page {page} of {totalPages}, Total: {totalProducts})
            </h3>

            <Row className="g-4">
                {products.map((p) => (
                    <Col key={p.id} xs={12} sm={6} md={4} lg={3}>
                        <ProductCard product={p} />
                    </Col>
                ))}
            </Row>

            {/* Pagination Controls */}
            <div className="pagination text-center mt-4">
                <button
                    disabled={page <= 1}
                    onClick={() => onPageChange?.(page - 1)}
                    className="btn btn-outline-dark me-2"
                >
                    Previous
                </button>

                <span>Page {page} of {totalPages}</span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => onPageChange?.(page + 1)}
                    className="btn btn-outline-dark ms-2"
                >
                    Next
                </button>
            </div>
        </div>
    );
}