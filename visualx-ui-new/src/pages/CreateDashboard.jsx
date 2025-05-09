import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function CreateDashboard() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/dashboards', { title });
      alert('Dashboard created successfully!');
      navigate('/dashboards');
    } catch (error) {
      console.error(error);
      alert('Error creating dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleCreate} className="bg-white p-8 shadow rounded w-96 dark:bg-gray-800">
        <h2 className="text-2xl mb-6">Create Dashboard</h2>
        <input
          type="text"
          placeholder="Dashboard Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateDashboard;