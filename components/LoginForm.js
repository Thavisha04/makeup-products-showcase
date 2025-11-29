import {useContext, useState} from "react";
import {AuthContext} from "@/components/AuthContext";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await login(email, password);
        if(response.error){
            alert(response.error);
        }else{
            setEmail('');
            setPassword('');
        }
    };

    return(
        <form onSubmit={handleSubmit} className="login-form" style={{ display: 'flex', gap: '0.5rem'}}>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{padding: '0.5rem'}}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{padding: '0.5rem'}}
            />
            <button type="submit" style={{ padding: '0.5rem 1rem'}}>Login</button>
        </form>
    );
}