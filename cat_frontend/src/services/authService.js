const LOGIN_URL = 'http://localhost:5000/login';
const SIGNUP_URL = 'http://localhost:5000/signup';

export async function registerUser(data) {
  const res = await fetch(SIGNUP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to register');
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}