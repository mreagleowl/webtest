import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Мінімальна перевірка пароля, наприклад "admin123"
    if (password === "admin123") {
      navigate("/admin-panel");
    } else {
      alert("Невірний пароль!");
    }
  }

  return (
    <form className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-4">Вхід для адміністратора</h2>
      <input
        type="password"
        className="w-full border rounded px-3 py-2 mb-4"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Пароль"
        required
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        type="submit"
      >
        Увійти
      </button>
    </form>
  );
}
