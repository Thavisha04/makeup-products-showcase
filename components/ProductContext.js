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
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        if (!selectedSection || selectedSection === "All") return products;

        const filterValue = selectedSection.toLowerCase().trim();

        return products.filter((p) => {
            const category = (p.category || "").toLowerCase().trim();
            return category.includes(filterValue);
        });
    }, [products, selectedSection]);

    const value = {
        products,
        setProducts,
        selectedSection,
        setSelectedSection,
        filteredProducts,
        page,
        setPage,
        totalProducts,
        setTotalProducts,
        totalPages,
        setTotalPages,
    };

    return (
        <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
    );
}