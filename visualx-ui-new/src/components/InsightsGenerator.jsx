import React, { useState } from 'react';
import axios from '../api/axios';

function InsightsGenerator({ charts }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateInsight = async () => {
    setLoading(true);
    const insightsPayload = [];

    for (const chart of charts) {
      if (!chart.sql_query || !chart.datasource_id) continue;

      try {
        const res = await axios.post('/query', {
          datasource_id: chart.datasource_id,
          query: chart.sql_query,
        });

        insightsPayload.push({
          title: chart.title,
          sql_query: chart.sql_query,
          data: res.data,
        });
      } catch (err) {
        console.error(`Failed for ${chart.title}`, err);
      }
    }

    try {
      const aiRes = await axios.post('/insights', { charts: insightsPayload });
      setInsight(aiRes.data.insight || 'No insight returned.');
    } catch (err) {
      console.error("Insight generation error:", err);
      setInsight('Failed to generate insights.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <button
        onClick={handleGenerateInsight}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
      >
        {loading ? 'Generating Insight...' : 'Generate AI Insight'}
      </button>

      {insight && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 border rounded whitespace-pre-wrap">
          <h3 className="text-lg font-semibold mb-2">AI Insight</h3>
          <p>{insight}</p>
        </div>
      )}
    </div>
  );
}

export default InsightsGenerator;