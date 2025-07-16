import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //
import { registerUser, loginUser } from '../services/authService';
import '../styles/AuthForm.css';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  const navigate = useNavigate(); 

  const toggleForm = () => setIsLogin(prev => !prev);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const loginPayload = {
          email: form.email,
          password: form.password
        };
        const res = await loginUser(loginPayload);
        alert('Login success!');
        navigate('/dashboard');
      } else {
        const signupPayload = {
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role
        };
        const res = await registerUser(signupPayload);
        alert('Signup success! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-header">Cathackathon!</h1>
      <div className={`auth-container ${isLogin ? 'login' : 'signup'}`}>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>

        <p onClick={toggleForm} className="toggle">
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
