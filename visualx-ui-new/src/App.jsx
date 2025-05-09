import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardList from './pages/DashboardList';
import CreateDashboard from './pages/CreateDashboard';
import CreateChart from './pages/CreateChart';
import ViewDashboard from './pages/ViewDashboard';
import VisualXWelcome from './pages/VisualXWelcome';
import Navbar from './components/Navbar';
import DataSourceList from "./pages/DataSourceList";
import AddDataSource from "./pages/AddDataSource";
import ViewDataSource from "./pages/ViewDataSource";

import { getToken } from './services/auth';

function App() {
  const token = getToken();

  return (
    <div>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboards" element={token ? <DashboardList /> : <Navigate to="/login" />} />
        <Route path="/dashboards/new" element={token ? <CreateDashboard /> : <Navigate to="/login" />} />
        <Route path="/charts/new" element={token ? <CreateChart /> : <Navigate to="/login" />} />
        <Route path="/dashboard/:id" element={token ? <ViewDashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/welcome" element={token ? <VisualXWelcome /> : <Navigate to="/login" />} />
        <Route path="/datasources" element={<DataSourceList />} />
        <Route path="/datasources/add" element={<AddDataSource />} />
        <Route path="/datasources/:id" element={<ViewDataSource />} />
      </Routes>
    </div>
  );
}

export default App;