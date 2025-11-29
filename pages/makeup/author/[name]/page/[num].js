import { useRouter } from "next/router";
import { createClient } from "contentful";
import ProductCard from "@/components/ProductCard";
import { Container, Row, Col, Button } from "react-bootstrap";
import AppNavBar from "@/components/AppNavBar";
import Footer from "@/components/Footer";

// Contentful client
const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export default function AuthorPage({ posts, authorName, page, hasMore }) {
    const router = useRouter();

    if (!posts || posts.length === 0) return <p>No posts found.</p>;

    return (
        <div>
            <AppNavBar />
            <h2 className="mb-4">Posts by {authorName}</h2>

            <Row>
                {posts.map((post) => (
                    <Col key={post.sys.id} xs={12} sm={6} md={4} lg={3}>
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
            <div className="d-flex justify-content-between mt-4">
                {page > 1 && (
                    <Button
                        variant="dark"
                        onClick={() =>
                            router.push(`/makeup/author/${encodeURIComponent(authorName)}/page/${page - 1}`)
                        }
                    >
                        Previous
                    </Button>
                )}
                {hasMore && (
                    <Button
                        variant="dark"
                        onClick={() =>
                            router.push(`/makeup/author/${encodeURIComponent(authorName)}/page/${page + 1}`)
                        }
                    >
                        Next
                    </Button>
                )}
            </div>
            <Footer />
        </div>
    );
}

export async function getServerSideProps(context) {
    const { name, num } = context.params;
    const page = parseInt(num) || 1;
    const pageSize = 5;

    // Fetch posts filtered by author email
    const response = await client.getEntries({
        content_type: "product", // your content type
        "fields.author": name,
        skip: (page - 1) * pageSize,
        limit: pageSize,
        order: "-sys.createdAt",
    });

    // Check if more posts exist for "Next" button
    const totalResponse = await client.getEntries({
        content_type: "product",
        "fields.author": name,
        limit: 1,
        skip: page * pageSize, // check if there are posts after current page
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
