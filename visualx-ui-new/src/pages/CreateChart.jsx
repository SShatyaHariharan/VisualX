import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function CreateChart() {
  const [title, setTitle] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [sqlQuery, setSqlQuery] = useState('');
  const [dashboardId, setDashboardId] = useState('');
  const [datasourceId, setDatasourceId] = useState('');
  const [dashboards, setDashboards] = useState([]);
  const [datasources, setDatasources] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [valueColumn, setValueColumn] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/dashboards').then(res => setDashboards(res.data)).catch(console.error);
    axios.get('/datasources').then(res => setDatasources(res.data)).catch(console.error);
  }, []);

  const handleTestQuery = async () => {
    try {
      const res = await axios.post('/query', {
        datasource_id: datasourceId,
        query: sqlQuery,
      });
      if (res.data.length > 0) {
        setColumns(Object.keys(res.data[0]));
      } else {
        alert('Query returned no data.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to execute query');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const config = {
      x_column: xAxis,
      y_column: yAxis,
      value_column: valueColumn,
    };
    try {
      await axios.post('/charts', {
        title,
        chart_type: chartType,
        sql_query: sqlQuery,
        dashboard_id: dashboardId,
        datasource_id: datasourceId,
        config_json: JSON.stringify(config),
      });
      alert('Chart created successfully!');
      navigate('/dashboards');
    } catch (err) {
      console.error(err);
      alert('Failed to create chart');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6">Create New Chart</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Chart Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>

        <textarea
          placeholder="SQL Query"
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          rows={4}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <button type="button" onClick={handleTestQuery} className="mb-4 bg-yellow-500 text-white px-4 py-2 rounded">
          Test Query
        </button>

        <select
          value={datasourceId}
          onChange={(e) => setDatasourceId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        >
          <option value="">Select Data Source</option>
          {datasources.map((ds) => (
            <option key={ds.id} value={ds.id}>{ds.name}</option>
          ))}
        </select>

        <select
          value={dashboardId}
          onChange={(e) => setDashboardId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        >
          <option value="">Select Dashboard</option>
          {dashboards.map((dash) => (
            <option key={dash.id} value={dash.id}>{dash.title}</option>
          ))}
        </select>

        {chartType === 'bar' || chartType === 'line' ? (
          <>
            <input
              list="column-options"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              placeholder="X-Axis Column"
              className="w-full border p-2 rounded mb-4"
            />
            <input
              list="column-options"
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              placeholder="Y-Axis Column"
              className="w-full border p-2 rounded mb-4"
            />
          </>
        ) : chartType === 'pie' ? (
          <>
            <input
              list="column-options"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              placeholder="Label Column"
              className="w-full border p-2 rounded mb-4"
            />
            <input
              list="column-options"
              value={valueColumn}
              onChange={(e) => setValueColumn(e.target.value)}
              placeholder="Value Column"
              className="w-full border p-2 rounded mb-4"
            />
          </>
        ) : null}

        <datalist id="column-options">
          {columns.map((col) => (
            <option key={col} value={col} />
          ))}
        </datalist>

        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
          Save Chart
        </button>
      </form>
    </div>
  );
}

export default CreateChart;