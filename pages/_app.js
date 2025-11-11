// pages/_app.js
import "@/styles/globals.css";
import { ProductProvider } from "@/components/ProductContext";
import "../styles/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App({ Component, pageProps }) {
    return (
        <ProductProvider>
            <Component {...pageProps} />
        </ProductProvider>
    );
}
