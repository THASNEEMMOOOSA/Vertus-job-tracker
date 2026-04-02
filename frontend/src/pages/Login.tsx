import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.access_token);
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full rounded-xl border p-2"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}