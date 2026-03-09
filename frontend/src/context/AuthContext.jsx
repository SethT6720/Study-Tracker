import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('jwtToken') || '');

    function login(token) {
        localStorage.setItem('jwtToken', token);
        setToken(token);
    }

    function logout() {
        localStorage.removeItem('jwtToken');
        setToken('');
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}