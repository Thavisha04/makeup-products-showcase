import {createContext, useEffect, useState} from "react";

export const AuthContext = createContext();

export function AuthProvider( {children} ){

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                setUser(data?.user || null)
                setLoading(false)
            })
            .catch(() => setLoading(false) );
    }, []);

    const login = (email, password) => {
        return fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        }).then(r => r.json())
            .then(data => {
                if(data.user) setUser(data.user);
                return data;
            })
    }

    const logout = () => {
        return fetch('/api/auth/logout')
            .then(() => setUser(null));
    }

    return (
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );

}