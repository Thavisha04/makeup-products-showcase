// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: [id].js

// pages/products/[id].js
import Header from "@/components/Header.js";
import AppNavbar from "@/components/AppNavBar.js";
import Footer from "@/components/Footer.js";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "next/image";
import Link from "next/link";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const envId = process.env.CONTENTFUL_ENV || "master";

export default function ProductDetail({ product }) {
    if (!product) {
        return (
            <div>
                <Header title="Product Not Found" />
                <AppNavbar links={["Home", "Products", "About"]} />
                <main>
                    <Container className="text-center my-5">
                        <h2>Product not found</h2>
                        <Link href="/makeup" legacyBehavior>
                            <a className="btn btn-dark mt-3">Back to Products</a>
                        </Link>
                    </Container>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header title={product.title} />
            <AppNavbar links={["Home", "Products", "About"]} />
            <main>
                <Container className="my-5">
                    <Row className="align-items-center">
                        <Col md={6} className="text-center">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    className="img-fluid"
                                    style={{ maxHeight: "350px", objectFit: "contain" }}
                                />
                            ) : null}
                        </Col>

                        <Col md={6}>
                            <h3 className="fw-bold">${product.price}</h3>
                            <p className="text-uppercase text-muted mb-2">{product.title}</p>
                            <p className="text-secondary">{product.description}</p>

                            {product.category && (
                                <div className="mb-2">
                                    <strong>Category:</strong> {product.category}
                                </div>
                            )}
                            {product.rating && (
                                <div className="mb-2">
                                    <strong>Rating:</strong> ⭐ {product.rating}
                                </div>
                            )}
                            {product.brand && (
                                <div className="mb-2">
                                    <strong>Brand:</strong> {product.brand}
                                </div>
                            )}

                            {product.tag && (
                                <div className="mb-3">
                                    {product.tag}
                                </div>
                            )}

                            <div className="mt-3">
                                <Button variant="outline-dark" size="lg" className="me-2">
                                    ADD TO CART
                                </Button>

                                <Link href="/makeup" legacyBehavior>
                                    <a className="btn btn-secondary btn-lg">Back to Products</a>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </main>
            <Footer />
        </div>
    );
}

/**
 * Build the static paths from Contentful entries so pages/products/[id] is generated
 */
export async function getStaticPaths() {
    try {
        const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=product&access_token=${accessToken}&limit=1000`;
        const res = await fetch(url);
        const data = await res.json();

        const paths = (data.items || []).map((item) => ({
            params: { id: item.sys.id },
        }));

        return {
            paths,
            fallback: "blocking", // generate on demand if not built
        };
    } catch (err) {
        console.error("getStaticPaths error:", err);
        return { paths: [], fallback: "blocking" };
    }
}

/**
 * For each product page, fetch the single entry by id
 */
export async function getStaticProps({ params }) {
    const { id } = params || {};

    try {
        const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries/${id}?access_token=${accessToken}`;
        const res = await fetch(url);

        if (!res.ok) {
            return { notFound: true };
        }

        const data = await res.json();

        const fields = data.fields || {};
        const imageUrl = fields.image?.fields?.file?.url || null;

        const product = {
            id: data.sys?.id,
            title: fields.title || "",
            description: fields.description || "",
            category: fields.category || "",
            price: fields.price || "",
            rating: fields.rating || null,
            tag: fields.tag || "",
            brand: fields.brand || "",
            image: imageUrl ? (imageUrl.startsWith("//") ? `https:${imageUrl}` : imageUrl) : null,
        };

        return {
            props: { product },
            revalidate: 60, // revalidate after 60s
        };
    } catch (err) {
        console.error("getStaticProps product detail error:", err);
        return { notFound: true };
    }
}
