import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { login } = useAuth();

    async function submitForm(e) {
        console.log("submitted")
        e.preventDefault();

        const toSend = {
            username: username,
            password: password
        }

        try {
            const result = await fetch(import.meta.env.VITE_API_URL + '/auth/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(toSend)
            });
            const data = await result.json();
            login(data);
            navigate('/dashboard');
        } catch (err) {
            console.log(err.message);
            setError('Invalid username or password');
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-80 flex flex-col gap-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Study Tracker</h1>
                    <p className="text-gray-400 text-sm mt-1">Log in to your account</p>
                </div>
                
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                
                <form onSubmit={submitForm} className="flex flex-col gap-3">
                    <input 
                        id="username" type="text"
                        placeholder="Username"
                        className="px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" 
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        id="password" type="password" 
                        placeholder="Password"
                        className="px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className="bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >Login</button>
                </form>
                
                <p className="text-gray-400 text-sm text-center">
                    Don't have an account? <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => navigate('/register')}>Register</span>
                </p>
            </div>
        </div>
    );
}