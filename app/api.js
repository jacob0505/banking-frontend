const API_URL = 'https://banking-system-production-d100.up.railway.app/api';

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

export async function login(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return res.json();
}

export async function register(username, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return { data: await res.json(), ok: res.ok };
}

export async function getAccounts() {
    const res = await fetch(`${API_URL}/accounts`, { headers: getHeaders() });
    return res.json();
}

export async function createAccount(ownerName) {
    const res = await fetch(`${API_URL}/accounts/create?ownerName=${ownerName}`, {
        method: 'POST', headers: getHeaders()
    });
    return { data: await res.json(), ok: res.ok };
}

export async function deposit(id, amount) {
    const res = await fetch(`${API_URL}/accounts/${id}/deposit?amount=${amount}`, {
        method: 'POST', headers: getHeaders()
    });
    return { data: await res.json(), ok: res.ok };
}

export async function withdraw(id, amount) {
    const res = await fetch(`${API_URL}/accounts/${id}/withdraw?amount=${amount}`, {
        method: 'POST', headers: getHeaders()
    });
    return { data: await res.json(), ok: res.ok };
}

export async function transfer(fromId, toId, amount) {
    const res = await fetch(`${API_URL}/accounts/transfer?fromId=${fromId}&toId=${toId}&amount=${amount}`, {
        method: 'POST', headers: getHeaders()
    });
    return { data: await res.json(), ok: res.ok };
}

export async function getTransactions(id) {
    const res = await fetch(`${API_URL}/accounts/${id}/transactions`, { headers: getHeaders() });
    return res.json();
}