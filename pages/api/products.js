import content from "*.bmp";
import {verifyToken} from "@/lib/auth";
import {version} from "react";
import {error} from "next/dist/build/output/log";

export default async function handler(req, res){

    const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
    const CDA_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
    const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    const ENV = 'master';
    const LOCALE = 'en-US';

    function requireAuth(handler){
        return async(req, res) => {
            const token = req.cookies?.token;
            const payload = verifyToken(token);

            if(!payload){
                return res.status(401).json({error: 'Authentication Required'});
            }

            req.user = payload;

            return handler(req, res);
        };
    }


    //Service GET (READ) Request
    if(req.method === 'GET'){

        try {
            const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environment/${ENV}/entries?content_type=product&access_token=${CDA_TOKEN}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch Contentful products: ' + response.status);
            }

            const data = await response.json();
            const products = (data.items || []).map(item => ({
                id: item.sys.id,
                title: item.fields.title,
                content: item.fields.description,
                category: item.fields.category || null,
                price: item.fields.price,
                rating: item.fields.rating,
                tag: item.fields.tag,
                brand: item.fields.brand,
                image: item.fields.image?.fields?.file?.url || null,
                author: item.fields.author,
                sys: {version: item.sys.version},
            }));

            return res.status(200).json(products);
        }catch(error){
            return res.status(500).json({ error: 'Failed to fetch products: ' + error.message});
        }
    }

    //Handle Makeup Product Insertion
    if(req.method === 'POST'){

        return requireAuth(  async(req, res) => {

            const {title, body, category, price, rating, tag, brand, image, author} = req.body || {};
            if (!title || !body || !category || !price || !rating || !tag || !brand || !image || !author) {
                return res.status(400).json({error: "Missing required fields"});
            }

            const finalAuthor = req.body.email;

            try {

                const createResponse = await fetch(
                    `https://api.contentful.com/space/${SPACE_ID}/environment/${ENV}/entries`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${CMA_TOKEN}`,
                            'Content-Type': 'application/vnd.contentful.management.v1+json',
                            'X-Contentful-Content-Type': 'post'
                        },
                        body: JSON.stringify({
                                content_type_id: 'post',
                                fields: {
                                    title: { [LOCALE]: title},
                                    body: { [LOCALE]: body},
                                    category: { [LOCALE]: category},
                                    price: { [LOCALE]: price},
                                    rating: { [LOCALE]: rating},
                                    tag: { [LOCALE]: tag},
                                    brand: { [LOCALE]: brand},
                                    image: { [LOCALE]: image},
                                    author: { [LOCALE]: author}
                                }
                            }
                        )
                    }
                );

                if (!createResponse.ok) {
                    const text = await createResponse.text();
                    throw new Error(`Failed to create new Product entry: ${createResponse.status} ${text}`);
                }

                const created = await createResponse.json();
                const entryId = created.sys.id;
                const version = created.sys.version;

                //Publish the new entry so we can view it in our Home and Makeup pages
                const publishResponse = await fetch(
                    `https://api.contentful.com/space/${SPACE_ID}/environments/${ENV}/entries/${entryId}/published`,
                    {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${CMA_TOKEN}`,
                            'X-Contentful-Version': String(version)  //required to prevent collisions
                        }
                    }
                );

                if (!publishResponse.ok) {
                    const text = await publishResponse.text();
                    throw new Error(`Failed to update entry to published: ${publishResponse.status} ${text}`);
                }

                return res.status(201).json({
                    id: entryId,
                    title,
                    body,
                    category,
                    price,
                    rating,
                    tag,
                    brand,
                    image,
                    author,
                    published: true,
                    message: 'Product created and published successfully'
                });

            } catch (error) {
                console.error('ERROR creating product: ', error.message);
                return res.status(500).json({error: 'Failed to create product: ' + error.message});
            }
        })(req, res);
    }

    if( req.method ===  'PUT'){

        return requireAuth( async(req, res) => {

            const {id, title, body, category, price, rating, tag, brand, image, author} = req.body || {};
            if (!id || !title || !body || !price || !rating || !tag || !brand || !image || !author) {
                return res.status(400).json({error: "Missing required fields"});
            }

            try{

                const entryResponse = await fetch(`https://api.contentful.com/space/${SPACE_ID}/environments/${ENV}/entries/${id}`,
                    {
                        headers : {
                            Authorization: `Bearer ${CMA_TOKEN}`,
                            'Content-Type': 'application/vnd.contentful.management.v1+json'
                        }
                    }
                );

                if(!entryResponse.ok) {
                    const errText = await entryResponse.text();
                    throw new Error(`Failed to fetch entry: ${errText}`);
                }

                const entry = await entryResponse.json();
                const currentVersion = entry.sys.version;

                //RBAC - Role Based Authorization Control
                if(entry.fields.author?.[LOCALE] !== req.user.email && req.user.role !== 'admin'){
                    return res.status(403).json({error: 'Forbidden'});
                }

                const updateResponse = await fetch(`https://api.contentful.com/space/${SPACE_ID}/environments/${ENV}/entries/${id}`,
                    {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${CMA_TOKEN}`,
                            'Content-Type': 'application/vnd.contentful.management.v1+json',
                            'X-Contentful-Version': String(currentVersion)
                        },
                        body: JSON.stringify({
                            fields: {
                                title: { [LOCALE]: title},
                                body: { [LOCALE]: body},
                                category: { [LOCALE]: category},
                                price: { [LOCALE]: price},
                                rating: { [LOCALE]: rating},
                                tag: { [LOCALE]: tag},
                                brand: { [LOCALE]: brand},
                                image: { [LOCALE]: image},
                                author: { [LOCALE]: author}
                            }
                        })
                    });

                if(!updateResponse.ok){
                    const errText = await updateResponse.text();
                    throw new Error(`Failed to update entry: ${errText}`);
                }

                res.status(204).json({success: true});

            }catch(err){
                console.error('PUT Error: ', err.message);
                res.status(500).json({error: 'Failed to update product: ' + err.message});
            }

        })(req, res);

    }

    if(req.method ===  'DELETE'){

        return requireAuth( async(req, res) => {

            const {id} = req.query
            if(!id){
                return res.status(400).json({error: 'Id Required'});
            }

            try{
                const getResponse = await fetch(`http://localhost:3000/api/products`);
                const products = await getResponse.json();

                const product = products.find(p => p.id === id);

                if(!products){
                    return res.status(404).json({error: 'Product Not Found'})
                }

                //RBAC - Role Based Authorization Control
                if(product.author !== req.user.email && req.user.role !== 'admin'){
                    return res.status(403).json({error: 'Forbidden'});
                }

                // First in Contentful we must remove the published version
                await fetch(`https://api.contentful.com/space/${ENV}/environments/${ENV}/entries/${id}/published`,
                    {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${CMA_TOKEN}`,}
                    }
                );

                // Second in Contentful we can now remove the entry completely
                await fetch(`https://api.contentful.com/space/${ENV}/environments/${ENV}/entries/${id}`,
                    {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${CMA_TOKEN}`,}
                    }
                );

                res.status(204).json({success: true});

            }catch(err){
                console.error('DELETE Error: ', err.message);
                res.status(500).json({error: 'Failed to delete product: ' + err.message});
            }

        })(req, res);

    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', '']);
    return res.status(405).json({error: 'Method Not Permitted'});

}