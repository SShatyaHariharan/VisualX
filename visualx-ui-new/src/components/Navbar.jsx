import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../services/auth';

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <div>
        <Link to="/dashboards" className="mr-4">Dashboards</Link>
        <Link to="/charts/new" className="mr-4">New Chart</Link>
        <Link to="/datasources" className="mr-4">Datasources</Link>
        <button onClick={toggleDarkMode} className="bg-gray-700 px-2 py-1 rounded">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <button onClick={logout} className="ml-4">Logout</button>
    </nav>
  );
}

export default Navbar;