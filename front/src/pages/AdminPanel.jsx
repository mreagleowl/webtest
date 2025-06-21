import React, { useState } from "react";
import { API_BASE } from "../config";

export default function AdminPanel() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [num, setNum] = useState(20);
  const [message, setMessage] = useState("");

  function handleUpload(e) {
    e.preventDefault();
    if (!file || !title) return;
    const fd = new FormData();
    fd.append("title", title);
    fd.append("num_questions", num);
    fd.append("file", file);
    fetch(`${API_BASE}/admin/convert`, {
      method: "POST",
      body: fd,
    })
      .then(r => r.json())
      .then(res => setMessage("Файл завантажено!"))
      .catch(() => setMessage("Помилка!"));
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">Конвертація питань</h2>
      <form className="mb-6" onSubmit={handleUpload}>
        <input
          className="border px-2 py-1 mb-2 w-full"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Назва теми"
          required
        />
        <input
          className="border px-2 py-1 mb-2 w-full"
          value={num}
          onChange={e => setNum(e.target.value)}
          type="number"
          min="1"
          placeholder="Кількість питань для тесту"
        />
        <input
          type="file"
          className="mb-2"
          accept=".txt"
          onChange={e => setFile(e.target.files[0])}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Завантажити
        </button>
      </form>
      {message && <div className="text-green-700">{message}</div>}
      {/* Тут можна додати компоненти для формування звітів */}
    </div>
  );
}
