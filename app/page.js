'use client';
import { useState, useEffect } from 'react';
import { login, register } from './api';

export default function Home() {
    const [tab, setTab] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('token');
        if (token) window.location.href = '/dashboard';
        const saved = localStorage.getItem('darkMode');
        if (saved === 'true') setDarkMode(true);
    }, []);

    if (!mounted) return null;

    const toggleDark = () => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem('darkMode', next);
    };

    async function handleLogin() {
        const data = await login(username, password);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            window.location.href = '/dashboard';
        } else {
            setMessage(data.message || 'Login failed');
            setIsError(true);
        }
    }

    async function handleRegister() {
        const { data, ok } = await register(username, password);
        setMessage(data.message);
        setIsError(!ok);
        if (ok) setTab('login');
    }

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-300">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-400">🏦 Banking</h1>
                        <button onClick={toggleDark} className="text-2xl">
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                    <div className="flex mb-6 rounded-xl overflow-hidden border border-blue-900 dark:border-blue-500">
                        {['login', 'register'].map(t => (
                            <button key={t} onClick={() => { setTab(t); setMessage(''); }}
                                className={`flex-1 py-2.5 font-semibold capitalize text-sm transition ${
                                    tab === t
                                        ? 'bg-blue-900 dark:bg-blue-600 text-white'
                                        : 'text-blue-900 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800'
                                }`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <input
                        className="w-full border dark:border-gray-700 rounded-xl px-4 py-3 mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        className="w-full border dark:border-gray-700 rounded-xl px-4 py-3 mb-4 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())}
                    />
                    {message && (
                        <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${isError ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'}`}>
                            {message}
                        </div>
                    )}
                    <button
                        onClick={tab === 'login' ? handleLogin : handleRegister}
                        className="w-full bg-blue-900 dark:bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition text-sm">
                        {tab === 'login' ? '🔐 Login' : '📝 Register'}
                    </button>
                </div>
            </div>
        </div>
    );
}