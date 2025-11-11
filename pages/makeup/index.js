import { useEffect, useContext, useState } from "react";
import AppNavbar from "@/components/AppNavBar";
import Footer from "@/components/Footer";
import ProductList from "@/components/ProductList";
import { ProductContext } from "@/components/ProductContext";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const CONTENT_TYPE = "product";
const LIMIT = 5; // 5 products per page

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

    // Initialize context with fetched products
    useEffect(() => {
        setProducts(products);
        setTotalProducts(totalProducts);
        setTotalPages(initialTotalPages);
        setPage(1);
    }, [products, totalProducts, initialTotalPages, setProducts, setTotalProducts, setTotalPages, setPage]);

    // Update current page products whenever filtered products or page changes
    useEffect(() => {
        if (!filteredProducts) return;
        const startIndex = (page - 1) * LIMIT;
        const endIndex = startIndex + LIMIT;
        setCurrentPageProducts(filteredProducts.slice(startIndex, endIndex));
    }, [filteredProducts, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
    };

    const handleCategoryChange = (category) => {
        setSelectedSection(category);
        setPage(1);
    };

    // Create pagination buttons
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

                    {/* Category Filter */}
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

                    {/* Product List */}
                    <ProductList products={currentPageProducts} />

                    {/* Pagination */}
                    <div className="mt-4 text-center">{paginationButtons}</div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}

export async function getStaticProps() {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const envId = process.env.CONTENTFUL_ENV || "master";
    const contentType = CONTENT_TYPE;

    const limit = 1000; // fetch all products for client-side filtering

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}&limit=${limit}&select=sys.id,fields`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Contentful fetch failed ${res.status}`);

        const data = await res.json();

        const items = (data.items || []).map((item) => ({
            id: item.sys.id,
            title: item.fields.title || "",
            description: item.fields.description || "",
            author: item.fields.author || item.fields.brand || "",
            category: item.fields.tag || "",
            price: item.fields.price || null,
            rating: item.fields.rating || null,
            tag: item.fields.tag || "",
            brand: item.fields.brand || "",
            image: item.fields.image?.fields?.file?.url
                ? `https:${item.fields.image.fields.file.url}`
                : null,
        }));

        const totalProducts = items.length;
        const totalPages = Math.max(1, Math.ceil(totalProducts / LIMIT));

        return {
            props: {
                products: items,
                totalProducts,
                totalPages,
            },
            revalidate: 60,
        };
    } catch (err) {
        console.error("Error fetching products:", err.message);
        return {
            props: {
                products: [],
                totalProducts: 0,
                totalPages: 1,
                error: "Failed to fetch products",
            },
            revalidate: 60,
        };
    }
}
