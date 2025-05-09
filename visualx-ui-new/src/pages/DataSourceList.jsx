import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

function DataSourceList() {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    axios.get("/datasources")
      .then(res => setSources(res.data))
      .catch(err => console.error("Error fetching datasources:", err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`/datasources/${id}`)
      .then(() => {
        setSources(sources.filter(src => src.id !== id));
      })
      .catch(err => console.error("Delete failed:", err));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Data Sources</h2>
      <Link to="/datasources/add" className="bg-green-600 text-white px-3 py-1 rounded">Add New</Link>
      <ul className="mt-4 space-y-2">
        {sources.map(src => (
          <li key={src.id} className="p-2 border rounded">
            <Link to={`/datasources/${src.id}`} className="text-blue-500">{src.name}</Link>
            <button className="ml-4 text-red-600" onClick={() => handleDelete(src.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataSourceList;