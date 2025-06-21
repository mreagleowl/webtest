import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

export default function Themes() {
  const [themes, setThemes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_BASE + "/themes")
      .then((r) => r.json())
      .then(setThemes);
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Оберіть тему тесту</h2>
      <ul className="space-y-3">
        {themes.map((theme) => (
          <li key={theme.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{theme.title}</div>
              <div className="text-sm text-gray-400">
                {theme.num_questions} з {theme.total_questions} питань
              </div>
            </div>
            <button
              onClick={() => navigate(`/fio?theme=${theme.id}`)}
              className="bg-blue-600 text-white rounded px-4 py-1 hover:bg-blue-700 transition"
            >
              Обрати
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:underline">
          На головну
        </Link>
      </div>
    </div>
  );
}
