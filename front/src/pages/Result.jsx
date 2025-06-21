import React from "react";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();

  // Тут можна показувати реальний результат, якщо потрібен (отримати через API)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <div className="text-3xl font-bold mb-4">Тест завершено!</div>
      <div className="mb-4">Дякуємо за проходження тесту.</div>
      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded"
          onClick={() => navigate("/")}
        >
          На головну
        </button>
        <button
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded"
          onClick={() => navigate("/themes")}
        >
          Пройти ще одну тему
        </button>
      </div>
    </div>
  );
}
