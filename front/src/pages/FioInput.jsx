import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function FioInput() {
  const [fio, setFio] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const theme = params.get("theme");

  function handleSubmit(e) {
    e.preventDefault();
    if (fio.trim().length < 3) return;
    navigate(`/test?theme=${theme}&fio=${encodeURIComponent(fio)}`);
  }

  return (
    <form className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-4">Введіть ПІБ</h2>
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        value={fio}
        onChange={e => setFio(e.target.value)}
        placeholder="Прізвище, ім'я, по батькові"
        required
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        type="submit"
      >
        Далі
      </button>
    </form>
  );
}
