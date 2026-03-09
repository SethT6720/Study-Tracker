import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogSession from './pages/LogSession';
import Subjects from './pages/Subjects';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/log-session' element={<LogSession />} />
                <Route path='/subjects' element={<Subjects />} />
            </Routes>
        </BrowserRouter>
    );
}