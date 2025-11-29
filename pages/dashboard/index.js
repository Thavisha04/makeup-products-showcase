import {AuthContext} from "@/components/AuthContext";
import {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import Link from "next/link";

export default function Dashboard() {

    const {user, loading} = useContext(AuthContext);
    const router = useRouter();

    useEffect( () => {
        if(!loading){
            if(!user){
                router.push('/');      // redirect the user to home if they are not logged in
            }else if(user.role !== 'admin'){
                alert('Access to Dashboard Denied!');   // redirect non-admin users
                router.push('/');
            }
        }
    }, [user, loading, router]);

    //Show Loading Dashboard State
    if(loading){
        return(
            <section className="card">
                <p>Loading Dashboard</p>
            </section>
        );
    }

    //Last/Final Access Check
    if(!user || user.role !== 'admin'){
        return null;
    }

    return (

        <section className="card">
            <h1>Admin Dashboard</h1>
            <p>Welcome, <strong>{user.email} (Admin)</strong></p>

            <div style={{marginTop: '1.5rem', display: 'grid', gap: '1rem'}}>
                <h3>Quick Access</h3>
                <Link href="/makeup">
                    <button style={{ width: '100%', textAlign: 'left'}}>
                        View All System Products
                    </button>
                </Link>

                {/* Future Enhancements */}
                <button disabled style={{opacity: 0.5}}>
                    Manager Users (Possibly in 12.2)
                </button>
                <button disabled style={{opacity: 0.5}}>
                    Site Setting (Time Constraints - Possibly 13.1)
                </button>

            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f09ff', borderRadius: '8px', fondSize: '0.9rem'}}>
                <p><strong>Admin Legend</strong></p>
                <ul style={{ margin:'0.5rem 0', paddingLeft: '1.2rem'}}>
                    <li>You can edit or delete <strong>any</strong> product from the Products Page</li>
                    <li>Authors can edit/delete <strong>only</strong> their own products</li>
                    <li>All actions in this Lab/Practical are secured with JWT + RBAC</li>
                </ul>
            </div>
        </section>
    );

}