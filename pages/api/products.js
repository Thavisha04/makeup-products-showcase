// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Sep 27, 2025
// Last modified: Dec 03, 2025
// File name: products.js

import { verifyToken } from "@/lib/auth";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CDA_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENV = process.env.CONTENTFUL_ENV || "master";
const LOCALE = "en-US";

function getAuthUser(req) {
    try {
        const token = req.cookies?.token;
        if (!token) return null;
        return verifyToken(token);
    } catch (err) {
        return null;
    }
}

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries?content_type=product&access_token=${CDA_TOKEN}&include=1`;
            const response = await fetch(url);
            if (!response.ok) {
                const txt = await response.text();
                throw new Error("Failed to fetch Contentful products: " + txt);
            }
            const data = await response.json();
            const products = (data.items || []).map((item) => ({
                id: item.sys.id,
                title: item.fields.title,
                description: item.fields.description,
                category: item.fields.category || null,
                price: item.fields.price,
                rating: item.fields.rating,
                tag: item.fields.tag,
                brand: item.fields.brand,
                image:
                    item.fields.image?.fields?.file?.url
                        ? item.fields.image.fields.file.url.startsWith("//")
                            ? "https:" + item.fields.image.fields.file.url
                            : item.fields.image.fields.file.url
                        : null,
                author: item.fields.author,
                sys: { version: item.sys.version },
            }));

            return res.status(200).json(products);
        } catch (error) {
            console.error("GET Error:", error);
            return res.status(500).json({ error: "Failed to fetch products: " + error.message });
        }
    }

    if (req.method === "POST") {
        const user = getAuthUser(req);
        if (!user) return res.status(401).json({ error: "Authentication required" });

        if (user.role === "viewer") return res.status(403).json({ error: "Insufficient permissions" });

        const { title, description, category, price, rating, tag, brand, image } = req.body || {};
        if (!title || !description) {
            return res.status(400).json({ error: "Missing required fields (title/description)" });
        }

        try {
            const createResp = await fetch(
                `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${CMA_TOKEN}`,
                        "Content-Type": "application/vnd.contentful.management.v1+json",
                        "X-Contentful-Content-Type": "product",
                    },
                    body: JSON.stringify({
                        fields: {
                            title: { [LOCALE]: title },
                            description: { [LOCALE]: description },
                            category: { [LOCALE]: category || "" },
                            price: { [LOCALE]: price || "" },
                            rating: { [LOCALE]: rating || "" },
                            tag: { [LOCALE]: tag || "" },
                            brand: { [LOCALE]: brand || "" },
                            image: { [LOCALE]: image || "" },
                            author: { [LOCALE]: user.email },
                        },
                    }),
                }
            );

            if (!createResp.ok) {
                const txt = await createResp.text();
                throw new Error("Failed to create Contentful entry: " + txt);
            }

            const created = await createResp.json();
            const entryId = created.sys.id;
            const version = created.sys.version;

            const publishResp = await fetch(
                `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${entryId}/published`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${CMA_TOKEN}`,
                        "X-Contentful-Version": String(version),
                    },
                }
            );

            if (!publishResp.ok) {
                const txt = await publishResp.text();
                throw new Error("Failed to publish entry: " + txt);
            }

            return res.status(201).json({
                id: entryId,
                message: "Product created and published successfully",
            });
        } catch (err) {
            console.error("POST Error:", err);
            return res.status(500).json({ error: "Failed to create product: " + err.message });
        }
    }

    if (req.method === "PUT") {
        const user = getAuthUser(req);
        if (!user) return res.status(401).json({ error: "Authentication required" });

        const { id, title, description, category, price, rating, tag, brand } = req.body || {};
        if (!id || !title || !description) {
            return res.status(400).json({ error: "Missing required fields (id/title/description)" });
        }

        try {
            const entryResp = await fetch(
                `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${CMA_TOKEN}`,
                        "Content-Type": "application/vnd.contentful.management.v1+json",
                    },
                }
            );

            if (!entryResp.ok) {
                const txt = await entryResp.text();
                throw new Error("Failed to fetch entry: " + txt);
            }

            const entry = await entryResp.json();
            const currentVersion = entry.sys.version;

            const originalImage = entry.fields.image;
            const originalAuthor = entry.fields.author?.[LOCALE] ?? null;

            if (originalAuthor !== user.email && user.role !== "admin") {
                return res.status(403).json({ error: "Forbidden: not owner or admin" });
            }

            const updateBody = {
                fields: {
                    title: { [LOCALE]: title },
                    description: { [LOCALE]: description },
                    category: { [LOCALE]: category ?? "" },
                    price: { [LOCALE]: price ?? "" },
                    rating: { [LOCALE]: rating ?? "" },
                    tag: { [LOCALE]: tag ?? "" },
                    brand: { [LOCALE]: brand ?? "" },

                    image: originalImage,

                    author: { [LOCALE]: originalAuthor },
                },
            };

            const updateResp = await fetch(
                `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${CMA_TOKEN}`,
                        "Content-Type": "application/vnd.contentful.management.v1+json",
                        "X-Contentful-Version": String(currentVersion),
                    },
                    body: JSON.stringify(updateBody),
                }
            );

            if (!updateResp.ok) {
                const txt = await updateResp.text();
                throw new Error("Failed to update entry: " + txt);
            }

            const updated = await updateResp.json();
            const newVersion = updated.sys.version;

            const publishResp = await fetch(
                `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}/published`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${CMA_TOKEN}`,
                        "X-Contentful-Version": String(newVersion),
                    },
                }
            );

            if (!publishResp.ok) {
                const txt = await publishResp.text();
                throw new Error("Failed to publish updated entry: " + txt);
            }

            return res.status(200).json({ success: true, message: "Product updated" });
        } catch (err) {
            console.error("PUT Error:", err);
            return res.status(500).json({ error: "Failed to update product: " + err.message });
        }
    }

    if (req.method === "DELETE") {
        const user = getAuthUser(req);
        if (!user) return res.status(401).json({ error: "Authentication required" });

        const id = req.query?.id || (req.body && req.body.id);
        if (!id) return res.status(400).json({ error: "Id required" });

        try {
            const entryResp = await fetch(
                `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`,
                {
                    headers: { Authorization: `Bearer ${CMA_TOKEN}` },
                }
            );

            if (!entryResp.ok) {
                const txt = await entryResp.text();
                throw new Error("Failed to fetch entry: " + txt);
            }
            const entry = await entryResp.json();
            const entryAuthor = entry.fields.author?.[LOCALE] ?? null;

            if (entryAuthor !== user.email && user.role !== "admin") {
                return res.status(403).json({ error: "Forbidden: not owner or admin" });
            }

            const unpubResp = await fetch(
                `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}/published`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${CMA_TOKEN}` },
                }
            );

            if (!unpubResp.ok && unpubResp.status !== 404) {
                const txt = await unpubResp.text();
                throw new Error("Failed to unpublish entry: " + txt);
            }

            const delResp = await fetch(
                `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${CMA_TOKEN}` },
                }
            );

            if (!delResp.ok) {
                const txt = await delResp.text();
                throw new Error("Failed to delete entry: " + txt);
            }

            return res.status(200).json({ success: true, message: "Product deleted" });
        } catch (err) {
            console.error("DELETE Error:", err);
            return res.status(500).json({ error: "Failed to delete product: " + err.message });
        }
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method Not Permitted" });
}
