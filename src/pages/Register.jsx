import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/auth/register", { email, password });
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (error) {
      alert("Error: " + error.response.data);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-lg w-80">
        <h2 className="text-2xl mb-4 text-center font-semibold">Register</h2>
        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-4 rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white w-full py-2 rounded">Register</button>
        <p className="text-sm text-center mt-2">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </form>
    </div>
  );
}