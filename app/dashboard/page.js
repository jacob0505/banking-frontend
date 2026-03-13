'use client';
import { useState, useEffect } from 'react';
import { getAccounts, createAccount, deposit, withdraw, transfer, getTransactions } from '../api';

export default function Dashboard() {
    const [username, setUsername] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState('accounts');
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [ownerName, setOwnerName] = useState('');
    const [depositId, setDepositId] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawId, setWithdrawId] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [fromId, setFromId] = useState('');
    const [toId, setToId] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [txId, setTxId] = useState('');
    const [message, setMessage] = useState({ text: '', ok: true });

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('token');
        if (!token) { window.location.href = '/'; return; }
        setUsername(localStorage.getItem('username') || '');
        const saved = localStorage.getItem('darkMode');
        if (saved === 'true') setDarkMode(true);
        loadAccounts();
    }, []);

    if (!mounted) return null;

    async function loadAccounts() {
        const data = await getAccounts();
        setAccounts(Array.isArray(data) ? data : []);
    }

    function showMsg(text, ok) {
        setMessage({ text, ok });
        setTimeout(() => setMessage({ text: '', ok: true }), 3000);
    }

    const toggleDark = () => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem('darkMode', next);
    };

    async function handleCreate() {
        const { data, ok } = await createAccount(ownerName);
        showMsg(ok ? `✅ Account created! ID: ${data.id}` : `❌ ${data.message}`, ok);
        if (ok) { setOwnerName(''); loadAccounts(); }
    }

    async function handleDeposit() {
        const { data, ok } = await deposit(depositId, depositAmount);
        showMsg(ok ? `✅ Deposited! Balance: $${data.balance}` : `❌ ${data.message}`, ok);
        if (ok) loadAccounts();
    }

    async function handleWithdraw() {
        const { data, ok } = await withdraw(withdrawId, withdrawAmount);
        showMsg(ok ? `✅ Withdrawn! Balance: $${data.balance}` : `❌ ${data.message}`, ok);
        if (ok) loadAccounts();
    }

    async function handleTransfer() {
        const { data, ok } = await transfer(fromId, toId, transferAmount);
        showMsg(ok ? `✅ Transferred!` : `❌ ${data.message}`, ok);
        if (ok) loadAccounts();
    }

    async function handleGetTransactions() {
        const data = await getTransactions(txId);
        setTransactions(Array.isArray(data) ? data : []);
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/';
    }

    const tabs = [
        { id: 'accounts', label: '👥 Accounts' },
        { id: 'create', label: '➕ Create' },
        { id: 'deposit', label: '💰 Deposit' },
        { id: 'withdraw', label: '💸 Withdraw' },
        { id: 'transfer', label: '🔄 Transfer' },
        { id: 'transactions', label: '📋 History' },
    ];

    const inputClass = "w-full border dark:border-gray-700 rounded-xl px-4 py-3 mb-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
                <nav className="bg-blue-900 dark:bg-gray-900 text-white px-4 md:px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
                    <h1 className="text-xl font-bold">🏦 Banking</h1>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-blue-200 text-sm">Welcome, <span className="text-white font-semibold">{username}</span>!</span>
                        <button onClick={toggleDark} className="text-xl">{darkMode ? '☀️' : '🌙'}</button>
                        <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold transition">
                            Logout
                        </button>
                    </div>
                </nav>

                <div className="max-w-4xl mx-auto p-4">
                    {message.text && (
                        <div className={`mb-4 p-4 rounded-xl text-sm font-medium ${message.ok ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {tabs.map(t => (
                            <button key={t.id} onClick={() => setActiveTab(t.id)}
                                className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition ${
                                    activeTab === t.id
                                        ? 'bg-blue-900 dark:bg-blue-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-400 border border-blue-900 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700'
                                }`}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'accounts' && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 md:p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-blue-900 dark:text-blue-400">All Accounts</h2>
                                <button onClick={loadAccounts} className="text-sm bg-blue-900 dark:bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition">Refresh</button>
                            </div>
                            <div className="block md:hidden space-y-3">
                                {accounts.map(a => (
                                    <div key={a.id} className="border dark:border-gray-700 rounded-xl p-4">
                                        <div className="flex justify-between">
                                            <span className="font-semibold dark:text-white">{a.ownerName}</span>
                                            <span className="text-green-600 font-bold">${a.balance.toFixed(2)}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">ID: {a.id} · {a.accountNumber}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-blue-900 dark:bg-blue-800 text-white">
                                            <th className="p-3 text-left rounded-tl-xl">ID</th>
                                            <th className="p-3 text-left">Owner</th>
                                            <th className="p-3 text-left">Account No.</th>
                                            <th className="p-3 text-left rounded-tr-xl">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.map((a, i) => (
                                            <tr key={a.id} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}>
                                                <td className="p-3 dark:text-gray-300">{a.id}</td>
                                                <td className="p-3 font-medium dark:text-white">{a.ownerName}</td>
                                                <td className="p-3 text-gray-500 dark:text-gray-400">{a.accountNumber}</td>
                                                <td className="p-3 font-semibold text-green-700 dark:text-green-400">${a.balance.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'create' && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 max-w-md mx-auto">
                            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-4">➕ Create Account</h2>
                            <input className={inputClass} placeholder="Owner Name" value={ownerName} onChange={e => setOwnerName(e.target.value)} />
                            <button onClick={handleCreate} className="w-full bg-blue-900 dark:bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition">
                                Create Account
                            </button>
                        </div>
                    )}

                    {activeTab === 'deposit' && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 max-w-md mx-auto">
                            <h2 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4">💰 Deposit</h2>
                            <input className={inputClass} placeholder="Account ID" type="number" value={depositId} onChange={e => setDepositId(e.target.value)} />
                            <input className={inputClass} placeholder="Amount" type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
                            <button onClick={handleDeposit} className="w-full bg-green-700 dark:bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition">
                                Deposit
                            </button>
                        </div>
                    )}

                    {activeTab === 'withdraw' && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 max-w-md mx-auto">
                            <h2 className="text-lg font-bold text-red-700 dark:text-red-400 mb-4">💸 Withdraw</h2>
                            <input className={inputClass} placeholder="Account ID" type="number" value={withdrawId} onChange={e => setWithdrawId(e.target.value)} />
                            <input className={inputClass} placeholder="Amount" type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
                            <button onClick={handleWithdraw} className="w-full bg-red-600 dark:bg-red-700 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition">
                                Withdraw
                            </button>
                        </div>
                    )}

                    {activeTab === 'transfer' && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 max-w-md mx-auto">
                            <h2 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-4">🔄 Transfer</h2>
                            <input className={inputClass} placeholder="From Account ID" type="number" value={fromId} onChange={e => setFromId(e.target.value)} />
                            <input className={inputClass} placeholder="To Account ID" type="number" value={toId} onChange={e => setToId(e.target.value)} />
                            <input className={inputClass} placeholder="Amount" type="number" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} />
                            <button onClick={handleTransfer} className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                                Transfer
                            </button>
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 md:p-6">
                            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-4">📋 Transaction History</h2>
                            <div className="flex gap-3 mb-4">
                                <input className="flex-1 border dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Account ID" type="number" value={txId} onChange={e => setTxId(e.target.value)} />
                                <button onClick={handleGetTransactions} className="bg-blue-900 dark:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-800 transition text-sm">
                                    Search
                                </button>
                            </div>
                            <div className="block md:hidden space-y-3">
                                {transactions.map(t => (
                                    <div key={t.id} className="border dark:border-gray-700 rounded-xl p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                t.type === 'DEPOSIT' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                                                t.type === 'WITHDRAW' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'}`}>
                                                {t.type}
                                            </span>
                                            <span className="font-bold dark:text-white">${t.amount.toFixed(2)}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">From: {t.fromAccountId || '-'} → To: {t.toAccountId || '-'}</div>
                                        <div className="text-xs text-gray-400 mt-1">{new Date(t.timestamp).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-blue-900 dark:bg-blue-800 text-white">
                                            <th className="p-3 text-left rounded-tl-xl">ID</th>
                                            <th className="p-3 text-left">Type</th>
                                            <th className="p-3 text-left">From</th>
                                            <th className="p-3 text-left">To</th>
                                            <th className="p-3 text-left">Amount</th>
                                            <th className="p-3 text-left rounded-tr-xl">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((t, i) => (
                                            <tr key={t.id} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}>
                                                <td className="p-3 dark:text-gray-300">{t.id}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                        t.type === 'DEPOSIT' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                                                        t.type === 'WITHDRAW' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' :
                                                        'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'}`}>
                                                        {t.type}
                                                    </span>
                                                </td>
                                                <td className="p-3 dark:text-gray-300">{t.fromAccountId || '-'}</td>
                                                <td className="p-3 dark:text-gray-300">{t.toAccountId || '-'}</td>
                                                <td className="p-3 font-semibold dark:text-white">${t.amount.toFixed(2)}</td>
                                                <td className="p-3 text-gray-500 dark:text-gray-400 text-sm">{new Date(t.timestamp).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}