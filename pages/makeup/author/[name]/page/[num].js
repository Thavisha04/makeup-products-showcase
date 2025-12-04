import { useRouter } from "next/router";
import { createClient } from "contentful";
import ProductCard from "@/components/ProductCard";
import { Container, Row, Col, Button } from "react-bootstrap";
import AppNavBar from "@/components/AppNavBar";
import Footer from "@/components/Footer";

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export default function AuthorPage({ posts, authorName, page, hasMore }) {
    const router = useRouter();

    if (!posts || posts.length === 0) {
        return (
            <Container className="py-5 text-center">
                <h3>No posts found.</h3>
            </Container>
        );
    }

    return (
        <div>
            <AppNavBar />

            {/* Page Header */}
            <Container className="py-4">
                <h2 className="fw-medium text-center mb-4">
                    Products by <span className="text-black-50">{authorName}</span>
                </h2>

                {/* Product Grid */}
                <Row className="g-4 justify-content-center">
                    {posts.map((post) => (
                        <Col
                            key={post.sys.id}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            className="d-flex"
                        >
                            <ProductCard
                                product={{
                                    id: post.sys.id,
                                    title: post.fields.title,
                                    price: post.fields.price,
                                    rating: post.fields.rating,
                                    image: post.fields.image?.fields?.file?.url
                                        ? post.fields.image.fields.file.url.startsWith("//")
                                            ? "https:" + post.fields.image.fields.file.url
                                            : post.fields.image.fields.file.url
                                        : null,
                                    tag: post.fields.tag,
                                    author: post.fields.author,
                                }}
                            />
                        </Col>
                    ))}
                </Row>

                {/* Pagination */}
                <div className="d-flex justify-content-center gap-3 mt-5">
                    {page > 1 && (
                        <Button
                            variant="outline-dark"
                            onClick={() =>
                                router.push(
                                    `/makeup/author/${encodeURIComponent(
                                        authorName
                                    )}/page/${page - 1}`
                                )
                            }
                        >
                            Previous Page
                        </Button>
                    )}

                    {hasMore && (
                        <Button
                            variant="dark"
                            onClick={() =>
                                router.push(
                                    `/makeup/author/${encodeURIComponent(
                                        authorName
                                    )}/page/${page + 1}`
                                )
                            }
                        >
                            Next Page
                        </Button>
                    )}
                </div>
            </Container>

            <Footer />
        </div>
    );
}

export async function getServerSideProps(context) {
    const { name, num } = context.params;
    const page = parseInt(num) || 1;
    const pageSize = 8; // shows more items in the grid

    const response = await client.getEntries({
        content_type: "product",
        "fields.author": name,
        skip: (page - 1) * pageSize,
        limit: pageSize,
        order: "-sys.createdAt",
    });

    const totalResponse = await client.getEntries({
        content_type: "product",
        "fields.author": name,
        limit: 1,
        skip: page * pageSize,
    });

    return {
        props: {
            posts: response.items,
            authorName: name,
            page,
            hasMore: totalResponse.items.length > 0,
        },
    };
}
