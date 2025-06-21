import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function FioInput() {
  const [fio, setFio] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const theme = params.get("theme") || "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fio.trim()) {
      navigate(`/test?theme=${theme}&fio=${encodeURIComponent(fio)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Введіть ваше ПІБ</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          className="border border-gray-300 rounded-xl p-4 text-lg"
          placeholder="ПІБ"
          value={fio}
          onChange={(e) => setFio(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-2xl shadow-md transition"
        >
          Почати тест
        </button>
      </form>
    </div>
  );
}
