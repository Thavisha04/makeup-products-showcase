// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: [id].js

// pages/products/[id].js
import { useRouter } from "next/router";
import Header from "@/components/Header";
import AppNavbar from "@/components/AppNavBar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Link from "next/link";

export default function ProductDetail({ product }) {
    const router = useRouter();

    // fallback blocking handled in getStaticPaths; show loading if fallback
    if (router.isFallback) {
        return (
            <div className="app-container">
                <Header title="Product" />
                <AppNavbar links={["Home", "Products", "About"]} />
                <Container className="my-5 text-center">
                    <h2>Loading product…</h2>
                </Container>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="app-container">
                <Header title="Product Not Found" />
                <AppNavbar links={["Home", "Products", "About"]} />
                <Container className="my-5 text-center">
                    <h2>Product not found</h2>
                    <Link href="/makeup">
                        <Button variant="dark">Back to Products</Button>
                    </Link>
                </Container>
                <Footer />
            </div>
        );
    }

    return (
        <div className="app-container">
            <AppNavbar links={["Home", "Products", "About"]} />

            <main>
                <Container className="my-5">
                    <Row className="align-items-center">
                        <Col md={6} className="text-center">
                            {product.image ? (
                                <div style={{ position: "relative", width: "100%", height: 350 }}>
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        style={{ objectFit: "contain" }}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            ) : null}
                        </Col>

                        <Col md={6}>
                            <h3 className="fw-bold">{product.title}</h3>
                            <p className="text-secondary">{product.description}</p>
                            {product.price && <h4 className="text-dark">${product.price}</h4>}

                            {product.category && (
                                <div>
                                    <strong>Category: </strong>
                                    {product.category}
                                </div>
                            )}
                            {product.rating && (
                                <div>
                                    <strong>Rating: </strong>⭐ {product.rating}
                                </div>
                            )}
                            {product.author && (
                                <div>
                                    <strong>Brand: </strong>{product.author}
                                </div>
                            )}
                            <div className="mt-3">
                                <Button variant="outline-dark" size="lg" className="me-2">
                                    ADD TO CART
                                </Button>
                                <Link href="/makeup">
                                    <Button variant="secondary" size="lg">
                                        Back to Products
                                    </Button>
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

export async function getStaticPaths() {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const envId = process.env.CONTENTFUL_ENV || "master";
    const contentType = "product";

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}&select=sys.id&limit=1000`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const paths = (data.items || []).map((item) => ({
            params: { id: item.sys.id },
        }));

        return { paths, fallback: "blocking" };
    } catch (err) {
        console.error("Error in getStaticPaths (products):", err.message);
        return { paths: [], fallback: "blocking" };
    }
}

export async function getStaticProps({ params }) {
    const id = params?.id;
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const envId = process.env.CONTENTFUL_ENV || "master";
    const contentType = "product";

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries/${id}?access_token=${accessToken}`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            return { notFound: true, revalidate: 60 };
        }

        const item = await res.json();
        // item.fields may not include the linked image asset; if image is an asset, fetch it.
        // But Contentful's entry fetch usually includes fields.image as an asset link; if not, we construct image url defensively.

        let imageUrl = null;
        if (item.fields?.image?.sys?.type === "Asset" && item.fields.image.sys.id) {
            // fetch asset
            const assetUrl = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/assets/${item.fields.image.sys.id}?access_token=${accessToken}`;
            const assetRes = await fetch(assetUrl);
            if (assetRes.ok) {
                const asset = await assetRes.json();
                imageUrl = asset.fields?.file?.url ? `https:${asset.fields.file.url}` : null;
            }
        } else if (item.fields?.image?.fields?.file?.url) {
            imageUrl = `https:${item.fields.image.fields.file.url}`;
        }

        const product = {
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

        return {
            props: { product },
            revalidate: 60,
        };
    } catch (err) {
        console.error("Error in getStaticProps (product):", err.message);
        return { notFound: true, revalidate: 60 };
    }
}
