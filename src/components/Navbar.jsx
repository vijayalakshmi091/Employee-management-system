
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <h1 className="text-white text-xl font-semibold">Employee Management</h1>
      <div>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white px-3 py-2 hover:underline"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/add")}
          className="text-white px-3 py-2 hover:underline"
        >
          Add Employee
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}