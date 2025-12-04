// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Dec 03, 2025
// File name: CategoryContext.js

import { createContext, useState } from "react";

export const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([
        "Lip Makeup",
        "Eye Makeup",
        "Face Makeup"
    ]);

    const value = {
        categories,
        setCategories,
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
}
