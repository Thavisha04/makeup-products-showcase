// // Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// // Student ID: 100942619, 100942614
// // Group no: 7
// // Date created: Sep 27, 2025
// // Last modified: Nov 09, 2025
// // File name: ProductCard.js
//
// import Link from "next/link";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import Image from "next/image";
// import Badge from "react-bootstrap/Badge";
//
// export default function ProductCard({ product }) {
//     const { id, title, price, rating, image, tag, author } = product;
//
//     return (
//         <Card className="shadow-sm mb-4">
//             {image ? (
//                 <div style={{ position: "relative", width: "100%", height: 300 }}>
//                     <Image
//                         src={image}
//                         alt={title}
//                         fill
//                         style={{ objectFit: "cover" }}
//                         sizes="(max-width: 768px) 100vw, 33vw"
//                     />
//                 </div>
//             ) : (
//                 <div
//                     style={{
//                         width: "100%",
//                         height: 300,
//                         backgroundColor: "#333",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                     }}
//                 >
//                     <span>No Image</span>
//                 </div>
//             )}
//
//             <Card.Body>
//                 <Card.Title>{title}</Card.Title>
//
//                 {price && (
//                     <Card.Text className="fw-bold text-success">${price}</Card.Text>
//                 )}
//
//                 {rating && <Card.Text>⭐ {rating}</Card.Text>}
//
//                 {tag && (
//                     <div className="mb-2">
//                         <Badge bg="dark">{tag}</Badge>
//                     </div>
//                 )}
//
//                 {author && <Card.Text>{author}</Card.Text>}
//
//                 <Link href={`/makeup/product/${id}`} className="variant sm">
//                     <Button variant="dark" size="sm" className="mt-3">View Details</Button>
//                 </Link>
//             </Card.Body>
//         </Card>
//     );
// }

import Link from "next/link";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "next/image";
import Badge from "react-bootstrap/Badge";
import { useContext } from "react";
import { AuthContext } from "@/components/AuthContext";
import { useRouter } from "next/router";

export default function ProductCard({ product }) {
    const { id, title, price, rating, image, tag, author } = product;
    const { user } = useContext(AuthContext);
    const router = useRouter();

    const canEdit = user && (user.role === "admin" || user.email === author);
    const canDelete = user && (user.role === "admin" || user.email === author);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;

        try {
            const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
            });

            if (res.ok) {
                if (router.pathname.startsWith("/makeup") || router.pathname === "/") {
                    router.replace(router.asPath);
                } else {
                    router.push("/makeup");
                }
            } else if (res.status === 401) {
                alert("You must be logged in to delete products.");
            } else if (res.status === 403) {
                alert("You do not have permission to delete this product.");
            } else {
                const data = await res.json();
                alert(data?.error || "Failed to delete product");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete product: " + err.message);
        }
    };

    return (
        <Card className="shadow-sm mb-4">
            {image ? (
                <div style={{ position: "relative", width: "100%", height: 300 }}>
                    <Image src={image} alt={title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
            ) : (
                <div style={{ width: "100%", height: 300, backgroundColor: "#333", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span>No Image</span>
                </div>
            )}

            <Card.Body>
                <Card.Title>{title}</Card.Title>

                {price && <Card.Text className="fw-bold text-success">${price}</Card.Text>}
                {rating && <Card.Text>⭐ {rating}</Card.Text>}
                {tag && <div className="mb-2"><Badge bg="dark">{tag}</Badge></div>}
                {author && <Card.Text className="small text-muted">By: {author}</Card.Text>}

                <div className="d-flex gap-2 mt-3">
                    <Link href={`/makeup/product/${id}`} className="variant sm">
                        <Button variant="dark" size="sm" className="uniform-btn">Details</Button>
                    </Link>

                    {canEdit && (
                        <Link href={`/dashboard/edit/${id}`}>
                            <Button variant="outline-primary" size="sm" className="uniform-btn">Edit</Button>
                        </Link>
                    )}

                    {canDelete && (
                        <Button variant="outline-danger" size="sm" className="uniform-btn" onClick={handleDelete}>Delete</Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}
