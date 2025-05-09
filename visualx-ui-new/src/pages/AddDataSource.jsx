import React, { useState } from 'react';
import axios from '../api/axios';

function AddDataSource() {
  const [name, setName] = useState('');
  const [type, setType] = useState('csv'); // 'csv' or 'mysql'
  const [file, setFile] = useState(null);
  const [connectionString, setConnectionString] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);

    if (type === 'csv') {
      if (!file) {
        alert('Please select a CSV file');
        return;
      }
      formData.append('file', file);
    } else if (type === 'mysql') {
      if (!connectionString) {
        alert('Please provide a MySQL connection string');
        return;
      }
      formData.append('connection_string', connectionString);
    }

    try {
      await axios.post('/datasources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Data source added successfully');
      setName('');
      setFile(null);
      setConnectionString('');
    } catch (error) {
      console.error(error);
      alert('Failed to add data source');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 shadow rounded mt-10">
      <h2 className="text-xl font-bold mb-4">Add Data Source</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Source Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="csv">CSV Upload</option>
          <option value="mysql">MySQL Connection</option>
        </select>

        {type === 'csv' && (
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full mb-4"
            required
          />
        )}

        {type === 'mysql' && (
          <input
            type="text"
            placeholder="MySQL Connection String (e.g. mysql+pymysql://user:pass@host/db)"
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
            required
          />
        )}

        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddDataSource;