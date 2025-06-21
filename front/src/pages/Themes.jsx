import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Themes() {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    fetch("/api/themes")
      .then((r) => r.json())
      .then(setThemes)
      .catch(() => setThemes([]));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Оберіть тему тесту</h2>
      <div className="w-full max-w-xl grid gap-4">
        {themes.map((theme) => (
          <Link
            key={theme.id}
            to={`/fio?theme=${theme.id}`}
            className="block bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-2xl shadow-md p-6 transition"
          >
            <div className="text-xl font-semibold text-gray-800">{theme.title}</div>
            <div className="text-sm text-gray-500">Кількість питань: {theme.num_questions}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
