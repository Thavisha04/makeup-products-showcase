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
