import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-lg w-80">
        <h2 className="text-2xl mb-4 text-center font-semibold">Login</h2>
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
        <button className="bg-blue-600 text-white w-full py-2 rounded">Login</button>
        <p className="text-sm text-center mt-2">
          Don’t have an account? <a href="/register" className="text-blue-600">Register</a>
        </p>
      </form>
    </div>
  );
}