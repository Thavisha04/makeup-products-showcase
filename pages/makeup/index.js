// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: index.js

// pages/products/index.js
import { useEffect, useContext } from "react";
import Header from "@/components/Header";
import AppNavbar from "@/components/AppNavBar";
import Footer from "@/components/Footer";
import ProductList from "@/components/ProductList";
import { ProductContext } from "@/components/ProductContext";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Link from "next/link";

const CONTENT_TYPE = "product";
const LIMIT = 10;

export default function ProductsPage({ products, page, totalProducts, totalPages, error }) {
    const { setProducts, setTotalProducts, setTotalPages, setPage } =
        useContext(ProductContext);

    useEffect(() => {
        if (products) setProducts(products);
        if (typeof totalProducts !== "undefined") setTotalProducts(totalProducts);
        if (typeof totalPages !== "undefined") setTotalPages(totalPages);
        if (typeof page !== "undefined") setPage(page);
    }, [products, totalProducts, totalPages, page, setProducts, setTotalProducts, setTotalPages, setPage]);

    const handlePageChange = (newPage) => {
        // navigate to paginated path
        window.location.href = `/products/page/${newPage}`;
    };

    return (
        <div className="app-container">
            <Header title="Our Products" />
            <AppNavbar links={["Home", "Products", "About"]} />

            <main className="content">
                <Container className="my-5">
                    <h2 className="text-center mb-4">Our Products</h2>

                    {error ? (
                        <p role="alert">{error}</p>
                    ) : (
                        <>
                            <div className="mb-3 text-center">
                                {/* Simple link to page 1; users can go to pages via product list pagination */}
                                <Link href="/products/page/1">
                                    <Button variant="dark" className="me-2">View Page 1</Button>
                                </Link>
                            </div>

                            <ProductList
                                products={products}
                                page={page}
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

export async function getStaticProps() {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const envId = process.env.CONTENTFUL_ENV || "master";
    const contentType = CONTENT_TYPE;

    const limit = LIMIT;
    const skip = 0; // page 1

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}&limit=${limit}&skip=${skip}&select=sys.id,fields`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Contentful fetch failed ${res.status}`);

        const data = await res.json();

        const items = (data.items || []).map((item) => {
            return {
                id: item.sys.id,
                title: item.fields.title || "",
                description: item.fields.description || "",
                author: item.fields.author || item.fields.brand || "",
                category: item.fields.category || "",
                price: item.fields.price || null,
                rating: item.fields.rating || null,
                tags: item.fields.tags || [],
                brand: item.fields.brand || "",
                image: item.fields.image?.fields?.file?.url
                    ? `https:${item.fields.image.fields.file.url}`
                    : null,
            };
        });

        const totalProducts = data.total || 0;
        const totalPages = Math.max(1, Math.ceil(totalProducts / limit));

        return {
            props: {
                products: items,
                page: 1,
                totalProducts,
                totalPages,
            },
            revalidate: 60, // ISR to keep data fairly fresh
        };
    } catch (err) {
        console.error("Error fetching products:", err.message);
        return {
            props: {
                products: [],
                page: 1,
                totalProducts: 0,
                totalPages: 1,
                error: "Failed to fetch products",
            },
            revalidate: 60,
        };
    }
}
