import { useRouter } from 'next/router';
import Header from '@/components/Header';
import AppNavbar from '@/components/AppNavBar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { client } from '@/lib/contentful';

export default function ProductDetail({ product }) {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <div className="app-container">
                <Header title="Product" />
                <AppNavbar links={['Home', 'Products', 'About']} />
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
                <AppNavbar links={['Home', 'Products', 'About']} />
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
            <AppNavbar links={['Home', 'Products', 'About']} />

            <main>
                <Container className="my-5">
                    <Row className="align-items-center">
                        <Col md={6} className="text-center">
                            {product.image && (
                                <div style={{ position: 'relative', width: '100%', height: 350 }}>
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            )}
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
                            {product.brand && (
                                <div>
                                    <strong>Brand: </strong> {product.brand}
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

// Get all product IDs for static paths
export async function getStaticPaths() {
    try {
        const entries = await client.getEntries({ content_type: 'product', select: 'sys.id' });
        const paths = entries.items.map((item) => ({
            params: { id: item.sys.id },
        }));
        return { paths, fallback: 'blocking' };
    } catch (err) {
        console.error(err);
        return { paths: [], fallback: 'blocking' };
    }
}

// Fetch product details by ID
export async function getStaticProps({ params }) {
    try {
        const entry = await client.getEntry(params.id);

        if (!entry) return { notFound: true, revalidate: 60 };

        const product = {
            id: entry.sys.id,
            title: entry.fields.title || '',
            description: entry.fields.description || '',
            brand: entry.fields.brand || entry.fields.author || '',
            category: entry.fields.category || '',
            price: entry.fields.price || null,
            rating: entry.fields.rating || null,
            tags: entry.fields.tags || [],
            image: entry.fields.image?.fields?.file?.url ? `https:${entry.fields.image.fields.file.url}` : null,
        };

        return { props: { product }, revalidate: 60 };
    } catch (err) {
        console.error(err);
        return { notFound: true, revalidate: 60 };
    }
}