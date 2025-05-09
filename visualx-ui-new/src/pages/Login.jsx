import React, { useState } from 'react';
import axios from '../api/axios';
import { saveToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      console.log('Login success', response.data);
      saveToken(response.data.token);
      navigate('/welcome');
    } catch (error) {
      console.error('Login error', error);
      alert('Login failed!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 shadow rounded w-96">
        <h2 className="text-2xl mb-6">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;