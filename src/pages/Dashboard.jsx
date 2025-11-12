import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // ✅ for edit mode
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    department: "",
    salary: "",
  });

  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:8080/api/employee";
  const navigate = useNavigate();

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have logged out!");
    navigate("/login");
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle add or update employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // ✅ Update existing employee
        await axios.put(`${API_BASE_URL}/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("✅ Employee updated successfully!");
      } else {
        // ✅ Add new employee
        await axios.post(API_BASE_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("✅ Employee added successfully!");
      }

      setShowForm(false);
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        department: "",
        salary: "",
      });
      setEditingId(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("❌ Failed to save employee");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Employee deleted!");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("❌ Failed to delete employee");
    }
  };

  // Handle edit
  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setFormData({
      firstname: emp.firstname,
      lastname: emp.lastname,
      email: emp.email,
      department: emp.department,
      salary: emp.salary,
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">Employee Dashboard</h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setFormData({
                  firstname: "",
                  lastname: "",
                  email: "",
                  department: "",
                  salary: "",
                });
                setEditingId(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md"
            >
              ➕ Add Employee
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-md"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Salary</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id} className="text-center hover:bg-gray-100">
                  <td className="border p-2">{emp.id}</td>
                  <td className="border p-2">{emp.firstname}</td>
                  <td className="border p-2">{emp.lastname}</td>
                  <td className="border p-2">{emp.email}</td>
                  <td className="border p-2">{emp.department}</td>
                  <td className="border p-2">{emp.salary}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center">
              {editingId ? "Edit Employee" : "Add New Employee"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={formData.salary}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
              >
                {editingId ? "Update Employee" : "Save Employee"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}