// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Dec 03, 2025
// File name: [id].js

import {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/components/AuthContext";
import {CategoryContext} from "@/components/CategoryContext";
import {useRouter} from "next/router";
import {Container, Card, Form, Button, Row, Col, Alert} from "react-bootstrap";
import AppNavbar from "@/components/AppNavBar";
import Footer from "@/components/Footer";

export default function EditProduct() {
    const {user, loading} = useContext(AuthContext);
    const {categories} = useContext(CategoryContext);
    const router = useRouter();
    const {id} = router.query;

    const [product, setProduct] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [rating, setRating] = useState("");
    const [tag, setTag] = useState("");
    const [brand, setBrand] = useState("");
    const [image, setImage] = useState("");
    const [authorFld, setAuthorFld] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id || loading) return;
        if (!user) {
            router.push("/");
            return;
        }

        const fetchProduct = async () => {
            try {
                const res = await fetch("/api/products");
                if (!res.ok) throw new Error("Failed to load products");
                const products = await res.json();
                const found = products.find((p) => p.id === id);

                if (!found) {
                    setError("Product could not be found");
                    return;
                }

                if (found.author !== user.email && user.role !== "admin") {
                    setError("You are not allowed to edit this product");
                    return;
                }

                setProduct(found);
                setTitle(found.title || "");
                setDescription(found.description || "");
                setCategory(found.category || (categories?.[0] ?? ""));
                setPrice(found.price ?? "");
                setRating(found.rating ?? "");
                setTag(found.tag ?? "");
                setBrand(found.brand ?? "");
                setImage(found.image ?? "");
                setAuthorFld(found.author ?? "");
            } catch (err) {
                setError("Failed to load product: " + err.message);
            }
        };

        fetchProduct();
    }, [id, user, loading, router, categories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!title || !description) {
            setError("Title and description are required");
            return;
        }

        setSaving(true);

        try {
            const res = await fetch("/api/products", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id, title, description, category, price: Number(price), rating: Number(rating), tag, brand}),
            });

            if (res.ok) {
                router.push("/makeup");
            } else if (res.status === 401) {
                setError("You must be logged in to update this product.");
            } else if (res.status === 403) {
                setError("You do not have permission to update this product.");
            } else {
                const data = await res.json();
                setError(data?.error || "Failed to update product");
            }
        } catch (err) {
            setError("Failed to update product: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error && !product) return <Alert variant="danger">{error}</Alert>;
    if (!product) return <p>Loading product...</p>;

    return (
        <>
            <AppNavbar/>
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-4">Edit Product</Card.Title>

                                {error && <Alert variant="danger">{error}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="title">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter product title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="description">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            placeholder="Enter product description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="author">
                                        <Form.Label>Author</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={authorFld}
                                            readOnly
                                            style={{backgroundColor: "#e9ecef", color: "#495057"}}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="image">
                                        <Form.Label>Image URL</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={image}
                                            readOnly
                                            style={{backgroundColor: "#e9ecef", color: "#495057"}}
                                        />
                                    </Form.Group>

                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Group controlId="brand">
                                                <Form.Label>Brand</Form.Label>
                                                <Form.Control type="text" value={brand}
                                                              onChange={(e) => setBrand(e.target.value)}/>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="tag">
                                                <Form.Label>Tag</Form.Label>
                                                <Form.Control type="text" value={tag}
                                                              onChange={(e) => setTag(e.target.value)}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Group controlId="price">
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control type="number" value={price}
                                                              onChange={(e) => setPrice(e.target.value)}/>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="rating">
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control type="number" value={rating}
                                                              onChange={(e) => setRating(e.target.value)}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="category">
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Button variant="dark" type="submit" disabled={saving} className="w-100">
                                        {saving ? "Saving..." : "Update Product"}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </>
    );
}
