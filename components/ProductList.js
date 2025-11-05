// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: ProductList.js

import ProductCard from "./ProductCard.jsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function ProductList({products}) {
    return (
        <Row className="g-4">
            {products.map((p) => (
                <Col key={p.id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard product={p}/>
                </Col>
            ))}
        </Row>
    );
}

export default ProductList;