import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-blue-100 to-white px-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center animate-fade-in">
        <div className="bg-yellow-200 rounded-full p-5 shadow-lg mb-6 border-4 border-yellow-300">
          <span style={{ fontSize: 60 }} role="img" aria-label="Жилет">🦺</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-lg">WebTest</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">Тестування з охорони праці</p>
        <div className="w-full flex flex-col gap-4 mb-4">
          <Link
            to="/themes"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-lg rounded-2xl py-3 shadow-md transition-all duration-200 transform hover:-translate-y-1 hover:scale-105"
          >
            Почати тест
          </Link>
          <Link
            to="/admin"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-lg rounded-2xl py-3 shadow-md transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 border border-gray-200"
          >
            Вхід для адміністратора
          </Link>
        </div>
        <div className="mt-8 text-gray-400 text-sm">Місце для вашого логотипу</div>
      </div>
    </div>
  );
}
