import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import Plot from 'react-plotly.js';
import Select from 'react-select';
import InsightsGenerator from '../components/InsightsGenerator';

function ViewDashboard() {
  const { id } = useParams();
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    axios.post('/charts/by-dashboard', { dashboard_id: parseInt(id) })
      .then(response => setCharts(response.data))
      .catch(error => console.error("Error fetching charts:", error));
  }, [id]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Charts</h1>
      {charts.map(chart => (
        <ChartRenderer key={chart.id} chart={chart} />
      ))}
      <InsightsGenerator charts={charts} />
    </div>
  );
}

function ChartRenderer({ chart }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    if (!chart.sql_query || !chart.datasource_id) return;

    axios.post('/query', {
      datasource_id: chart.datasource_id,
      query: chart.sql_query,
    })
      .then(response => {
        const fetchedData = response.data;
        setData(fetchedData);
        if (fetchedData.length > 0) {
          setColumns(Object.keys(fetchedData[0]));
        }
      })
      .catch(error => {
        console.error("Chart query failed", error);
        setData([]);
      });
  }, [chart]);

  const getUniqueValues = (column) => {
    const values = data.map(d => d[column]);
    return [...new Set(values)].filter(v => v !== null && v !== undefined);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const filteredData = data.filter(row => {
    return Object.entries(appliedFilters).every(([column, selectedValues]) => {
      if (!selectedValues || selectedValues.length === 0) return true;
      return selectedValues.includes(row[column]);
    });
  });

  const xColumn = columns[0];
  const yColumn = columns[1];

  const renderChart = () => {
    if (!xColumn || !yColumn) return null;

    if (chart.chart_type === 'bar') {
      return (
        <Plot
          data={[{
            type: 'bar',
            x: filteredData.map(d => d[xColumn]),
            y: filteredData.map(d => d[yColumn]),
            marker: { color: 'teal' },
          }]}
          layout={{
            title: chart.title,
            xaxis: { title: xColumn },
            yaxis: { title: yColumn },
          }}
          style={{ width: '100%', height: '400px' }}
        />
      );
    }

    if (chart.chart_type === 'line') {
      return (
        <Plot
          data={[{
            type: 'scatter',
            mode: 'lines+markers',
            x: filteredData.map(d => d[xColumn]),
            y: filteredData.map(d => d[yColumn]),
            line: { color: 'orange' },
          }]}
          layout={{
            title: chart.title,
            xaxis: { title: xColumn },
            yaxis: { title: yColumn },
          }}
          style={{ width: '100%', height: '400px' }}
        />
      );
    }

    if (chart.chart_type === 'pie') {
      return (
        <Plot
          data={[{
            type: 'pie',
            labels: filteredData.map(d => d[xColumn]),
            values: filteredData.map(d => d[yColumn]),
          }]}
          layout={{ title: chart.title }}
          style={{ width: '100%', height: '400px' }}
        />
      );
    }

    return <div>Unsupported chart type</div>;
  };

  return (
    <div className="mb-8 border rounded p-4 shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4">{chart.title}</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        {columns.map(col => (
          <div key={col} className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1">{col} Filter</label>
            <Select
              isMulti
              options={getUniqueValues(col).map(val => ({ value: val, label: val }))}
              value={(filters[col] || []).map(val => ({ value: val, label: val }))}
              onChange={(selected) => {
                const selectedValues = selected.map(opt => opt.value);
                setFilters(prev => ({ ...prev, [col]: selectedValues }));
              }}
              className="text-black"
            />
          </div>
        ))}
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </button>

      {renderChart()}
    </div>
  );
}

export default ViewDashboard;