// import {verifyToken} from "@/lib/auth";
//
// export default async function handler(req, res){
//
//     const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
//     const CDA_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
//     const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
//     const ENV = 'master';
//     const LOCALE = 'en-US';
//
//     function requireAuth(handler){
//         return async(req, res) => {
//             const token = req.cookies?.token;
//             const payload = verifyToken(token);
//
//             if(!payload){
//                 return res.status(401).json({error: 'Authentication Required'});
//             }
//
//             req.user = payload;
//
//             return handler(req, res);
//         };
//     }
//
//
//     //Service GET (READ) Request
//     if(req.method === 'GET'){
//
//         try {
//             const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries`;
//             const response = await fetch(url);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch Contentful products: ' + response.status);
//             }
//
//             const data = await response.json();
//             const products = (data.items || []).map(item => ({
//                 id: item.sys.id,
//                 title: item.fields.title,
//                 content: item.fields.description,
//                 category: item.fields.category || null,
//                 price: item.fields.price,
//                 rating: item.fields.rating,
//                 tag: item.fields.tag,
//                 brand: item.fields.brand,
//                 image: item.fields.image?.fields?.file?.url || null,
//                 author: item.fields.author,
//                 sys: {version: item.sys.version},
//             }));
//
//             return res.status(200).json(products);
//         }catch(error){
//             return res.status(500).json({ error: 'Failed to fetch products: ' + error.message});
//         }
//     }
//
//     //Handle Makeup Product Insertion
//     if(req.method === 'POST'){
//
//         return requireAuth(  async(req, res) => {
//
//             const {title, body, category, price, rating, tag, brand, image, author} = req.body || {};
//             if (!title || !body || !category || !price || !rating || !tag || !brand || !image || !author) {
//                 return res.status(400).json({error: "Missing required fields"});
//             }
//
//             const finalAuthor = req.body.email;
//
//             try {
//
//                 const createResponse = await fetch(
//                     `https://api.contentful.com/spaces/${SPACE_ID}/environment/${ENV}/entries`,
//                     {
//                         method: 'POST',
//                         headers: {
//                             Authorization: `Bearer ${CMA_TOKEN}`,
//                             'Content-Type': 'application/vnd.contentful.management.v1+json',
//                             'X-Contentful-Content-Type': 'post'
//                         },
//                         body: JSON.stringify({
//                                 content_type_id: 'post',
//                                 fields: {
//                                     title: { [LOCALE]: title},
//                                     body: { [LOCALE]: body},
//                                     category: { [LOCALE]: category},
//                                     price: { [LOCALE]: price},
//                                     rating: { [LOCALE]: rating},
//                                     tag: { [LOCALE]: tag},
//                                     brand: { [LOCALE]: brand},
//                                     image: { [LOCALE]: image},
//                                     author: { [LOCALE]: author}
//                                 }
//                             }
//                         )
//                     }
//                 );
//
//                 if (!createResponse.ok) {
//                     const text = await createResponse.text();
//                     throw new Error(`Failed to create new Product entry: ${createResponse.status} ${text}`);
//                 }
//
//                 const created = await createResponse.json();
//                 const entryId = created.sys.id;
//                 const version = created.sys.version;
//
//                 //Publish the new entry so we can view it in our Home and Makeup pages
//                 const publishResponse = await fetch(
//                     `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${entryId}/published`,
//                     {
//                         method: 'PUT',
//                         headers: {
//                             Authorization: `Bearer ${CMA_TOKEN}`,
//                             'X-Contentful-Version': String(version)  //required to prevent collisions
//                         }
//                     }
//                 );
//
//                 if (!publishResponse.ok) {
//                     const text = await publishResponse.text();
//                     throw new Error(`Failed to update entry to published: ${publishResponse.status} ${text}`);
//                 }
//
//                 return res.status(201).json({
//                     id: entryId,
//                     title,
//                     body,
//                     category,
//                     price,
//                     rating,
//                     tag,
//                     brand,
//                     image,
//                     author,
//                     published: true,
//                     message: 'Product created and published successfully'
//                 });
//
//             } catch (error) {
//                 console.error('ERROR creating product: ', error.message);
//                 return res.status(500).json({error: 'Failed to create product: ' + error.message});
//             }
//         })(req, res);
//     }
//
//     if( req.method ===  'PUT'){
//
//         return requireAuth( async(req, res) => {
//
//             const {id, title, body, category, price, rating, tag, brand, image, author} = req.body || {};
//             if (!id || !title || !body || !price || !rating || !tag || !brand || !image || !author) {
//                 return res.status(400).json({error: "Missing required fields"});
//             }
//
//             try{
//
//                 const entryResponse = await fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`,
//                     {
//                         headers : {
//                             Authorization: `Bearer ${CMA_TOKEN}`,
//                             'Content-Type': 'application/vnd.contentful.management.v1+json'
//                         }
//                     }
//                 );
//
//                 if(!entryResponse.ok) {
//                     const errText = await entryResponse.text();
//                     throw new Error(`Failed to fetch entry: ${errText}`);
//                 }
//
//                 const entry = await entryResponse.json();
//                 const currentVersion = entry.sys.version;
//
//                 //RBAC - Role Based Authorization Control
//                 if(entry.fields.author?.[LOCALE] !== req.user.email && req.user.role !== 'admin'){
//                     return res.status(403).json({error: 'Forbidden'});
//                 }
//
//                 const updateResponse = await fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`,
//                     {
//                         method: 'PUT',
//                         headers: {
//                             Authorization: `Bearer ${CMA_TOKEN}`,
//                             'Content-Type': 'application/vnd.contentful.management.v1+json',
//                             'X-Contentful-Version': String(currentVersion)
//                         },
//                         body: JSON.stringify({
//                             fields: {
//                                 title: { [LOCALE]: title},
//                                 body: { [LOCALE]: body},
//                                 category: { [LOCALE]: category},
//                                 price: { [LOCALE]: price},
//                                 rating: { [LOCALE]: rating},
//                                 tag: { [LOCALE]: tag},
//                                 brand: { [LOCALE]: brand},
//                                 image: { [LOCALE]: image},
//                                 author: { [LOCALE]: author}
//                             }
//                         })
//                     });
//
//                 if(!updateResponse.ok){
//                     const errText = await updateResponse.text();
//                     throw new Error(`Failed to update entry: ${errText}`);
//                 }
//
//                 res.status(204).json({success: true});
//
//             }catch(err){
//                 console.error('PUT Error: ', err.message);
//                 res.status(500).json({error: 'Failed to update product: ' + err.message});
//             }
//
//         })(req, res);
//
//     }
//
//     if(req.method ===  'DELETE'){
//
//         return requireAuth( async(req, res) => {
//
//             const {id} = req.query
//             if(!id){
//                 return res.status(400).json({error: 'Id Required'});
//             }
//
//             try{
//                 const getResponse = await fetch(`http://localhost:3000/api/products`);
//                 const products = await getResponse.json();
//
//                 const product = products.find(p => p.id === id);
//
//                 if(!products){
//                     return res.status(404).json({error: 'Product Not Found'})
//                 }
//
//                 //RBAC - Role Based Authorization Control
//                 if(product.author !== req.user.email && req.user.role !== 'admin'){
//                     return res.status(403).json({error: 'Forbidden'});
//                 }
//
//                 // First in Contentful we must remove the published version
//                 await fetch(`https://api.contentful.com/spaces/${ENV}/environments/${ENV}/entries/${id}/published`,
//                     {
//                         method: 'DELETE',
//                         headers: { Authorization: `Bearer ${CMA_TOKEN}`,}
//                     }
//                 );
//
//                 // Second in Contentful we can now remove the entry completely
//                 await fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}/published`,
//                     {
//                         method: 'DELETE',
//                         headers: { Authorization: `Bearer ${CMA_TOKEN}`,}
//                     }
//                 );
//
//                 res.status(204).json({success: true});
//
//             }catch(err){
//                 console.error('DELETE Error: ', err.message);
//                 res.status(500).json({error: 'Failed to delete product: ' + err.message});
//             }
//
//         })(req, res);
//
//     }
//
//     res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
//     return res.status(405).json({error: 'Method Not Permitted'});
//
// }

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
            // 1. Fetch existing entry so we can preserve image + author
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

            // preserve required fields
            const originalImage = entry.fields.image;   // ⭐ IMPORTANT FIX
            const originalAuthor = entry.fields.author?.[LOCALE] ?? null;

            // 2. RBAC check: only owner or admin
            if (originalAuthor !== user.email && user.role !== "admin") {
                return res.status(403).json({ error: "Forbidden: not owner or admin" });
            }

            // 3. Build updated fields WITHOUT modifying the image
            const updateBody = {
                fields: {
                    title: { [LOCALE]: title },
                    description: { [LOCALE]: description },
                    category: { [LOCALE]: category ?? "" },
                    price: { [LOCALE]: price ?? "" },
                    rating: { [LOCALE]: rating ?? "" },
                    tag: { [LOCALE]: tag ?? "" },
                    brand: { [LOCALE]: brand ?? "" },

                    // ⭐ DO NOT overwrite image
                    image: originalImage,

                    // ⭐ preserve original author
                    author: { [LOCALE]: originalAuthor },
                },
            };

            // 4. Update entry
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

            // 5. Publish updated entry
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
