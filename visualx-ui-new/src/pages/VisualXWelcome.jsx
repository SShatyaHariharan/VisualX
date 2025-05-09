import React from "react";
import { Link } from "react-router-dom";
import VisualXLogo from "../components/VisualXLogo";

function VisualXWelcome() {
  return (
    <div className="glitch-bg flex flex-col items-center justify-center h-screen bg-white dark:bg-black text-gray-900 dark:text-green-400 text-center font-mono px-4">
      <VisualXLogo />
      <h1 className="text-xl sm:text-2xl text-white mt-6 mb-4"></h1>
      <p className="text-gray-400 mb-6 max-w-md">
        Empower your data with real-time dashboards and intelligent visual analytics.
      </p>
      <Link
        to="/dashboards"
        className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded shadow"
      >
        Go to Dashboards
      </Link>
    </div>
  );
}

export default VisualXWelcome;