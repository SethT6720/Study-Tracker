import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { isTokenValid } from "../utils/token";

export default function ProtectedRoute({ children }) {
    const { token } = useAuth();
    const navigate = useNavigate();

    if (!isTokenValid(token)) {
        return <Navigate to="/" />
    }

    return children;
}