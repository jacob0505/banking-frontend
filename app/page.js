'use client';
import { useState, useEffect, useRef } from 'react';
import { login, register } from './api';

export default function Home() {
    const [tab, setTab] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('token');
        if (token) window.location.href = '/dashboard';
        const saved = localStorage.getItem('darkMode');
        if (saved === 'true') setDarkMode(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const meteors = Array.from({ length: 30 }, () => createMeteor(canvas));

        function createMeteor(canvas) {
            return {
                x: Math.random() * canvas.width * 2,
                y: Math.random() * canvas.height - canvas.height,
                length: Math.random() * 150 + 80,
                speed: Math.random() * 6 + 4,
                opacity: Math.random() * 0.7 + 0.3,
                width: Math.random() * 1.5 + 0.5,
            };
        }

        function drawMeteor(m) {
            const angle = Math.PI / 4;
            const dx = Math.cos(angle) * m.length;
            const dy = Math.sin(angle) * m.length;
            const gradient = ctx.createLinearGradient(m.x, m.y, m.x - dx, m.y - dy);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(m.x - dx, m.y - dy);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = m.width;
            ctx.stroke();
        }

        let animId;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            meteors.forEach(m => {
                drawMeteor(m);
                m.x += m.speed;
                m.y += m.speed;
                if (m.x > canvas.width + 200 || m.y > canvas.height + 200) {
                    Object.assign(m, createMeteor(canvas));
                }
            });
            animId = requestAnimationFrame(animate);
        }
        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, [mounted]);

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
            <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
                style={{ background: darkMode ? '#0a0a1a' : '#0f172a' }}>

                {/* Star background */}
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                        opacity: 0.08,
                    }}
                />

                {/* Meteor canvas */}
                <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />

                {/* Glow orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', zIndex: 1 }} />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', zIndex: 1 }} />

                {/* Card */}
                <div className="relative z-10 w-full max-w-sm"
                    style={{
                        background: 'rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                        padding: '2rem',
                    }}>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-white">🏦 Banking</h1>
                        <button onClick={toggleDark} className="text-2xl">
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </div>

                    <div className="flex mb-6 rounded-xl overflow-hidden"
                        style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                        {['login', 'register'].map(t => (
                            <button key={t} onClick={() => { setTab(t); setMessage(''); }}
                                className="flex-1 py-2.5 font-semibold capitalize text-sm transition"
                                style={{
                                    background: tab === t ? 'rgba(59,130,246,0.8)' : 'transparent',
                                    color: tab === t ? 'white' : 'rgba(255,255,255,0.6)',
                                }}>
                                {t}
                            </button>
                        ))}
                    </div>

                    <input
                        className="w-full rounded-xl px-4 py-3 mb-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        className="w-full rounded-xl px-4 py-3 mb-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())}
                    />

                    {message && (
                        <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${isError
                            ? 'bg-red-500 bg-opacity-20 text-red-300 border border-red-500 border-opacity-30'
                            : 'bg-green-500 bg-opacity-20 text-green-300 border border-green-500 border-opacity-30'}`}>
                            {message}
                        </div>
                    )}

                    <button
                        onClick={tab === 'login' ? handleLogin : handleRegister}
                        className="w-full text-white py-3 rounded-xl font-semibold transition text-sm"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                        {tab === 'login' ? '🔐 Login' : '📝 Register'}
                    </button>
                </div>
            </div>
        </div>
    );
}