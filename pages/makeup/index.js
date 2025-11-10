// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: index.js

// pages/products/index.js
import Header from "@/components/Header.js";
import NavBar from "@/components/AppNavBar.js";
import Footer from "@/components/Footer.js";
import ProductList from "@/components/ProductList.js";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "@/components/ProductContext.js";
import { Container, Button } from "react-bootstrap";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const envId = process.env.CONTENTFUL_ENV || "master";

function Products({ products: initialProducts = [], error, page = 1, totalProducts = 0, totalPages = 1 }) {
    const { selectedSection, setSelectedSection, filteredProducts, setProducts } = useContext(ProductContext);
    // fallback in case context doesn't expose setProducts (it does in our provider)
    useEffect(() => {
        if (initialProducts && initialProducts.length) {
            setProducts?.(initialProducts);
        }
    }, [initialProducts, setProducts]);

    const sections = ["All", "Eye Makeup", "Face Makeup", "Lip Makeup"];

    // Default pagination state (client-side control for now)
    const [currentPage, setCurrentPage] = useState(page);

    const handlePageChange = (newPage) => {
        // you could implement client side fetch for the new page or use query param navigation.
        setCurrentPage(newPage);
        // For now: basic demo — in full assignment you'd wire Contentful skip/limit with getStaticProps or dynamic pages
    };

    return (
        <div className="app-container">
            <Header title="Our Products" />
            <NavBar links={["Home", "Products", "About"]} />

            <main className="content">
                <Container className="my-5">
                    <h2 className="text-center mb-4">Our Products</h2>

                    {error ? (
                        <p role="alert">{error}</p>
                    ) : (
                        <>
                            <div className="mb-3 text-center">
                                {sections.map((section) => (
                                    <Button
                                        key={section}
                                        variant={selectedSection === section ? "dark" : "outline-dark"}
                                        className="me-2 mb-2"
                                        onClick={() => setSelectedSection?.(section)}
                                    >
                                        {section}
                                    </Button>
                                ))}
                            </div>

                            <ProductList
                                products={filteredProducts}
                                page={currentPage}
                                totalProducts={totalProducts}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </Container>
            </main>
            <Footer />
        </div>
    );
}

/**
 * For assignment SSG: fetch a (reasonable) page from Contentful.
 * Note: getStaticProps cannot read query params at request-time; if you need page-based SSG you should create
 * paginated routes (e.g., /products/page/[page]) or use client-side fetching.
 */
export async function getStaticProps() {
    try {
        const limit = 5; // number per page for initial build
        const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=product&access_token=${accessToken}&limit=${limit}`;

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Contentful fetch failed: ${res.status}`);
        }
        const data = await res.json();

        const products = (data.items || []).map((item) => {
            const fields = item.fields || {};
            const imageUrl = fields.image?.fields?.file?.url || null;
            return {
                id: item.sys.id,
                title: fields.title || "",
                description: fields.description || "",
                category: fields.category || "",
                price: fields.price || "",
                rating: fields.rating || null,
                tag: fields.tag,
                brand: fields.brand || "",
                image: imageUrl ? (imageUrl.startsWith("//") ? `https:${imageUrl}` : imageUrl) : null,
            };
        });

        const totalProducts = data.total || products.length;
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            props: {
                products,
                error: null,
                page: 1,
                totalProducts,
                totalPages,
            },
            revalidate: 60, // revalidate periodically
        };
    } catch (err) {
        console.error("getStaticProps products error:", err);
        return {
            props: {
                products: [],
                error: "Failed to fetch products",
                page: 1,
                totalProducts: 0,
                totalPages: 1,
            },
        };
    }
}

export default Products;

