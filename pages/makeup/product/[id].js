// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: [id].js

import {ProductContext} from "@/components/ProductContext.js";
import {useContext, useEffect} from "react";
import {useRouter} from "next/router"
import Header from "@/components/Header.js"
import AppNavbar from "@/components/AppNavBar.js";
import Footer from "@/components/Footer.js"
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Link from "next/link";

// TODO: Add a loading spinner effect

function ProductDetail() {

    const router = useRouter();
    const {products} = useContext(ProductContext);
    const {id} = router.query;

    console.log('ProductDetail: Route query ID', id);
    console.log('ProductDetail: ProductContext products: ', products);

    const product = id ? products.find(product => product.id === id) : null;

    useEffect(() => {
        if (id && !product) {
            router.push("/not-found");
        }
    }, [id, product, router]);

    if (!id || !products.length) return null;

    const handleBack = () => {
        router.push('/blog');
    }

    return (<div>
            <main>
                <Container className="my-5">
                    {product ? (<Row className="align-items-center">
                            <Col md={6} className="text-center">

                                {product.image && (<Image
                                        src={product.image}
                                        alt={product.title}
                                        className="img-fluid"
                                        style={{maxHeight: "350px", objectFit: "contain"}}
                                    />)}
                            </Col>

                            <Col md={6} className="text-center">
                                <h3 className="fw-bold">${product.price}</h3>
                                <p className="text-uppercase text-muted mb-2">{product.title}</p>
                                <p className="text-secondary">{product.description}</p>

                                {product.category && (<div className="mb-2">
                                        <strong>Category:</strong> {product.category}
                                    </div>)}
                                {product.rating && (<div className="mb-2">
                                        <strong>Rating:</strong> ⭐ {product.rating}
                                    </div>)}
                                {product.brand && (<div className="mb-2">
                                        <strong>Brand:</strong> {product.brand}
                                    </div>)}

                                {product.tags && (<div className="mb-3">
                                        {product.tags.map((tag, index) => (<span
                                                key={index}
                                                className="badge bg-light text-dark border me-1"
                                            >
                                    {tag}
                                </span>))}
                                    </div>)}

                                <div className="mt-3">
                                    <Button variant="outline-dark" size="lg" className="me-2">
                                        ADD TO CART
                                    </Button>
                                    <Link href="/products"></Link>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        // onClick={handleBack}
                                    >
                                        Back to Products
                                    </Button>
                                </div>
                            </Col>
                        </Row>) : (<div className="text-center my-5">
                            <h2>Loading Product...</h2>
                        </div>)}

                </Container>
            </main>
            <Footer/>
        </div>);
}


