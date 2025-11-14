// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Nov 09, 2025
// File name: index.js

import { useEffect, useContext, useState } from "react";
import AppNavbar from "@/components/AppNavBar";
import Footer from "@/components/Footer";
import ProductList from "@/components/ProductList";
import { ProductContext } from "@/components/ProductContext";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { client } from "@/lib/contentful";

const CONTENT_TYPE = "product";
const LIMIT = 8;

export default function ProductsPage({ products, totalProducts, totalPages: initialTotalPages }) {
    const {
        setProducts,
        setTotalProducts,
        setTotalPages,
        page,
        setPage,
        filteredProducts,
        selectedSection,
        setSelectedSection,
    } = useContext(ProductContext);

    const [currentPageProducts, setCurrentPageProducts] = useState([]);

    useEffect(() => {
        setProducts(products);
        setTotalProducts(totalProducts);
        setTotalPages(initialTotalPages);
        setPage(1);
    }, [products, totalProducts, initialTotalPages, setProducts, setTotalProducts, setTotalPages, setPage]);

    useEffect(() => {
        const startIndex = (page - 1) * LIMIT;
        const endIndex = startIndex + LIMIT;
        setCurrentPageProducts(filteredProducts.slice(startIndex, endIndex));
    }, [filteredProducts, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCategoryChange = (category) => {
        setSelectedSection(category);
        setPage(1);
    };

    const paginationButtons = [];
    for (let i = 1; i <= Math.ceil(filteredProducts.length / LIMIT); i++) {
        paginationButtons.push(
            <Button
                key={i}
                variant={i === page ? "dark" : "outline-dark"}
                className="me-2 mb-2"
                onClick={() => handlePageChange(i)}
            >
                {i}
            </Button>
        );
    }

    return (
        <div className="app-container">
            <AppNavbar links={["Home", "Products", "About"]} />

            <main className="content">
                <Container className="my-5">
                    <h2 className="text-center mb-4">Our Products</h2>

                    <Row className="mb-4 justify-content-center">
                        {["All", "Lip Makeup", "Eye Makeup", "Face Makeup"].map((cat) => (
                            <Col key={cat} xs="auto" className="mb-2">
                                <Button
                                    variant={selectedSection === cat ? "dark" : "outline-dark"}
                                    onClick={() => handleCategoryChange(cat)}
                                >
                                    {cat}
                                </Button>
                            </Col>
                        ))}
                    </Row>

                    <ProductList products={currentPageProducts} />

                    <div className="mt-4 text-center">{paginationButtons}</div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}

export async function getStaticProps() {
    try {
        const entries = await client.getEntries({
            content_type: "product",
            include: 1,
        });

        const items = entries.items.map((item) => ({
            id: item.sys.id,
            title: item.fields.title || "",
            description: item.fields.description || "",
            author: item.fields.author || item.fields.brand || "",
            category: item.fields.tag || "",
            price: item.fields.price || null,
            rating: item.fields.rating || null,
            brand: item.fields.brand || "",
            image: item.fields.image?.fields?.file?.url
                ? `https:${item.fields.image.fields.file.url}`
                : null,
        }));

        return {
            props: {
                products: items,
                totalProducts: items.length,
                totalPages: Math.max(1, Math.ceil(items.length / 5)),
            },
            revalidate: 60,
        };
    } catch (err) {
        console.error("Error fetching products:", err.message);
        return {
            props: { products: [], totalProducts: 0, totalPages: 1 },
            revalidate: 60,
        };
    }
}
