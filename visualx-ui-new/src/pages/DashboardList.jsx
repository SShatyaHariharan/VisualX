import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

function DashboardList() {
  const [dashboards, setDashboards] = useState([]);

  useEffect(() => {
    axios.get('/dashboards')
      .then(response => setDashboards(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboards</h1>
      <Link to="/dashboards/new" className="bg-green-500 text-white px-4 py-2 rounded">Create New Dashboard</Link>
      <ul className="mt-4">
        {dashboards.map(dash => (
          <li key={dash.id} className="border-b p-2">
            <Link to={`/dashboard/${dash.id}`}>{dash.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardList;