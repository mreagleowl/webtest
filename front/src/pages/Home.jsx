import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 px-4">
      <div className="mb-8">
        {/* Місце для вашого логотипу */}
        <div className="rounded-full bg-yellow-200 p-6 shadow-lg mb-4">
          <span style={{ fontSize: 48 }}>🦺</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">WebTest</h1>
        <p className="text-xl text-gray-600">Тестування з охорони праці</p>
      </div>
      <div className="flex gap-6 mb-8">
        <Link
          to="/themes"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-2xl shadow-lg transition"
        >
          Почати тест
        </Link>
        <Link
          to="/admin"
          className="bg-gray-200 hover:bg-gray-300 text-gray-900 text-lg px-8 py-3 rounded-2xl shadow-lg transition"
        >
          Вхід для адміністратора
        </Link>
      </div>
      <div className="mt-6 text-gray-400 text-sm">Місце для вашого логотипу</div>
    </div>
  );
}
