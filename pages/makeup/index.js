// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: index.js

import Header from "@/components/Header.js";
import NavBar from "@/components/AppNavBar.js";
import Footer from "@/components/Footer.js";
import ProductList from "@/components/ProductList.js";
import {useContext, useEffect} from "react";
import {ProductContext} from "@/components/ProductContext.js";
import {Container, Button} from "react-bootstrap";
import {useRouter} from "next/router";

function Products({products, error}) {
    const {selectedSection, setSelectedSection, filteredProducts, setProducts, totalProducts, totalPages} = useContext(ProductContext);

    const sections = ["All", "Eye Makeup", "Face Makeup", "Lip Makeup"];
    const router = useRouter();

    // Load the products into context when fetch from the server
    useEffect(() => {
        if (products) {
            setProducts(products);
        }
    }, [products, setProducts]);

    return (
        <div className="app-container">
            <Header title="Our Products"/>
            <NavBar links={["Home", "Products", "About"]}/>

            <main className="content">
                <Container className="my-5">
                    <h2 className="text-center mb-4">
                        Our Products
                    </h2>

                    {error ? (
                        <p role="alert">{error}</p>
                    ) : (
                        <>
                            {/*Selection Filters*/}
                            <div className="mb-3 text-center">
                                {sections.map((section) => (
                                    <Button
                                        key={section}
                                        variant={selectedSection === section ? "dark" : "outline-dark"}
                                        className="me-2 mb-2"
                                        onClick={() => setSelectedSection(section)}
                                    >
                                        {section}
                                    </Button>
                                ))}
                            </div>

                            <ProductList products={filteredProducts}/>
                        </>
                    )}
                </Container>
            </main>
            <Footer/>
        </div>
    );
}


export async function getStaticProps({query}) {
    const spaceId = process.env.CONTENTFUL_SPACED_ID
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
    const envId = process.env.CONTENTFUL_ENV || 'master'
    const contentType='product';

    const limit = 5;
    const page = parseInt(query.page || 1, 10);
    const skip = (page - 1) * limit;

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}&limit=${limit}&skip=${skip}`;
    try{
        console.log('Fetching products from Contentful API: ', url);
        const response = await fetch(url);

        if(!response.ok){
            console.log('Failed to fetch Contentful products: ', response.status, response.statusText);
            throw new Error ('Failed to fetch Contentful products')
        }

        const data = await response.json();
        console.log('Contentful API response: ', data);
        if(!data.items || data.items.length === 0) {
            console.error('No published products found in Contentful response');
            throw new Error ('No published products found in Contentful response');
        }

        const products = (data.items || []).map((item) => ({
            id: item.sys.id,
            title: item.fields.title,
            description: item.fields.description,
            category: item.fields.category,
            price: item.fields.price,
            rating: item.fields.rating,
            tags: item.fields.tags,
            brand: item.fields.brand,
            image: item.fields.image?.fields?.file?.url || null
        }));

        const totalProducts = data.total || 0;
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            props: {
                products,
                errors: null,
                page,
                totalProducts,
                totalPages,
            }
        }

    }catch(err){
        console.error('Error in getStaticProps', err.message);
        return {
            props: {
                products,
                errors: 'Failed to fetch products' + err.message,
                page: 1,
                totalProducts: 0,
                totalPages: 1,
            }
        };
    }
}

export default Products;
