import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

function ViewDataSource() {
  const { id } = useParams();
  const [source, setSource] = useState(null);

  useEffect(() => {
    axios.get(`/datasources/${id}`)
      .then(res => setSource(res.data))
      .catch(err => console.error("Load failed:", err));
  }, [id]);

  if (!source) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{source.name}</h2>
      <div className="space-y-2">
        <p><strong>Type:</strong> {source.type}</p>
        <p><strong>File Path:</strong> {source.filepath}</p>
        <p><strong>Connection String:</strong> {source.connection_string}</p>
      </div>
    </div>
  );
}

export default ViewDataSource;