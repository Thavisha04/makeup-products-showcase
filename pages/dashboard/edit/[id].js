import {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/components/AuthContext";
import {CategoryContext} from "@/components/CategoryContext";
import {useRouter} from "next/router";

export default function EditProduct(){

    const { user, loading } = useContext(AuthContext);
    const { categories } = useContext(CategoryContext);
    const router = useRouter();
    const { id } = router.query;

    const [product, setProduct] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [tag, setTag] = useState('');
    const [brand, setBrand] = useState('');
    const [image, setImage] = useState('');
    const [author, setAuthor] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if(!id || loading) return;

        if(!user){
            router.push('/');
            return;
        }

        const fetchProduct = async () => {
            try{
                const res = await fetch('api/products');
                const products = await res.json();
                const found = products.find(p => p.id === id);

                if(!found){
                    setError('Products could not be found');
                    return;
                }

                if(found.author !== user.email && user.role !== 'admin'){
                    setError('You can only edit your own products');
                    return;
                }

                setProduct(found);
                setTitle(found.title);
                setBody(found.body);
                setCategory(found.category);
                setPrice(found.price);
                setRating(found.rating);
                setTag(found.tag);
                setBrand(found.brand);
                setImage(found.image);
                setAuthor(found.author);


            }catch(error){
                setError('Failed to load product: ' + error.message);
            }
        };

        fetchProduct();

    }, [id, user, loading, router,categories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title || !body ) return setError("Title and body are required");

        setSaving(true);
        setError('');

        try{
            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, title, body, category, price, rating, tag, brand, image, author }),
            });

            if(res.ok){
                router.push('/makeup');
            }else{
                const data = await res.json();
                setError(data.error || 'Failed to update product');
            }

        }catch(error){
            setError('Failed to update product: ' + error.message);
        } finally{
            setSaving(false);
        }
    };

    if(loading) return <p>Loading...</p>
    if(error) return <section className="card"><p style={{color: 'red'}}>{error}</p></section>
    if(!product) return <p>Product not found</p>;

    return (
        <section className="card">
            <h1>Edit Product</h1>
            <form onSubmit={handleSubmit} className="post-form">

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Enter Your Content"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={10}
                    required
                    style={{width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)'}}
                />

                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    readOnly
                    style={{backgroundColor: '#f0f0f0'}}
                />

                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    readOnly
                    style={{backgroundColor: '#f0f0f0'}}
                />

                <input
                    type="text"
                    placeholder="Rating"
                    value={rating}
                    readOnly
                    style={{backgroundColor: '#f0f0f0'}}
                />

                <input
                    type="text"
                    placeholder="Tag"
                    value={tag}
                    readOnly
                    style={{backgroundColor: '#f0f0f0'}}
                />

                <input
                    type="text"
                    placeholder="Brand"
                    value={brand}
                    readOnly
                    style={{backgroundColor: '#f0f0f0'}}
                />

                <input
                    type="text"
                    placeholder="Image"
                    value={image}
                    readOnly
                    style={{backgroundColor: '#f0f0f0'}}
                />

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))
                    }
                </select>

                <button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Update Product'}
                </button>
            </form>
        </section>

    );
}