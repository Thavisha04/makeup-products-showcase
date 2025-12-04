// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Nov 09, 2025
// File name: _app.js

import "@/styles/globals.css";
import {ProductProvider} from "@/components/ProductContext";
import "../styles/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider} from "@/components/AuthContext";
import {CategoryProvider} from "@/components/CategoryContext";

export default function App({Component, pageProps}) {
    return (
        <ProductProvider>
            <AuthProvider>
                <CategoryProvider>
                    <Component {...pageProps} />
                </CategoryProvider>
            </AuthProvider>
        </ProductProvider>
    );
}
