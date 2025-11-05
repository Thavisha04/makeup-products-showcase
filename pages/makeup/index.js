// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: index.js

import {useContext} from "react";
import {ProductContext} from "../context/ProductContext.js";
import ProductList from "../ui/ProductList.jsx";
import {Container, Button} from "react-bootstrap";

function Products() {
    const {selectedSection, setSelectedSection, filteredProducts} = useContext(ProductContext);

    const sections = ["All", "Eye Makeup", "Face Makeup", "Lip Makeup"];

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Our Products</h2>

            {/* Section Filters */}
            <div className="mb-3 text-center">
                {sections.map((section) => (
                    <Button
                        key={section}
                        variant={selectedSection === section ? "dark" : "outline-dark"}
                        className="me-2 mb-2"
                        onClick={() => setSelectedSection(section)}
                    >
                        {section}
                    </Button>
                ))}
            </div>

            {/* Product Grid */}
            <ProductList products={filteredProducts}/>
        </Container>
    );
}

export default Products;


