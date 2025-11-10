// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Oct 02, 2025
// File name: ProductContext.js

// components/ProductContext.js
import { createContext, useMemo, useState } from "react";

export const ProductContext = createContext(null);

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [selectedSection, setSelectedSection] = useState("All");

    // filteredProducts derived from products + selectedSection
    const filteredProducts = useMemo(() => {
        if (!products || products.length === 0) return [];
        if (selectedSection === "All") return products;
        // simple category matching (case-insensitive)
        return products.filter((p) => (p.category || "").toLowerCase().includes(selectedSection.toLowerCase()));
    }, [products, selectedSection]);

    return (
        <ProductContext.Provider value={{
            products,
            setProducts,
            selectedSection,
            setSelectedSection,
            filteredProducts
        }}>
            {children}
        </ProductContext.Provider>
    );
}
