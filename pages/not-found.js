// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: NotFound.jsx

import Alert from 'react-bootstrap/Alert';
import Header from "@/components/Header";
import AppNavbar from "@/components/AppNavBar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Footer from "@/components/Footer";

export default function NotFound() {
    return (
        <div>
            <Header title="Page Not Found"/>
            <AppNavbar links={["Home", "Product", "About"]}/>

            <main>
                <Container className="text-center my-5">
                    <h1 className="display-4 fw-bold">404</h1>
                    <h3 className="mb-3">404 - Page Not Found</h3>
                    <p className="text-secondary mb-4">
                        The page you are looking for does not exist.
                    </p>
                    <Button href="/products" variant="dark" size="lg">
                        Back to Products
                    </Button>
                </Container>
            </main>

            <Footer />
        </div>

    );
}