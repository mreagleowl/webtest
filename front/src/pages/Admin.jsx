import React, { useState } from "react";

function parseTxt(content) {
  // Разбиваем на строки, режем по вопросам
  const lines = content.split(/\r?\n/).map(l => l.trim());
  const questions = [];
  let cur = null;
  let id = 1;

  function parseCorrect(val) {
    // 'В' или 'В, Б' -> массив индексов
    const letterArr = val.replace(/[✅Правильна відповідь:]/g, '').replace(/[^АБВГ,]/g, '').split(',').map(x => x.trim()).filter(Boolean);
    // Приводим буквы к индексу
    const letterToIdx = { 'А': 0, 'Б': 1, 'В': 2, 'Г': 3 };
    return letterArr.map(l => letterToIdx[l]).filter(x => x !== undefined);
  }

  lines.forEach(line => {
    const qMatch = line.match(/^(\d+)\.\s*(.+)$/);
    const optMatch = line.match(/^([АБВГ])\.\s*(.+)$/);
    const correctMatch = line.match(/^✅\s*Правильна відповідь:\s*(.+)$/i);
    if (qMatch) {
      // Новый вопрос
      if (cur) questions.push(cur);
      cur = { id: id++, question: qMatch[2], options: [], correct: [] };
    } else if (optMatch && cur) {
      cur.options.push(optMatch[2]);
    } else if (correctMatch && cur) {
      cur.correct = parseCorrect(correctMatch[1]);
    }
  });
  if (cur) questions.push(cur);
  // Простой автотайтл
  const title = questions[0]?.question?.slice(0, 30) || "Тема тесту";
  return {
    title,
    num_questions: questions.length,
    total_questions: questions.length,
    questions
  };
}

export default function Admin() {
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [json, setJson] = useState(null);
  const [title, setTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(3);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setLogged(true);
      setError(null);
    } else {
      setError("Невірний пароль");
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploaded(file.name);
    setSaved(false);
    setError(null);
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = parseTxt(ev.target.result);
        if (!parsed.questions.length) throw new Error("Не знайдено питань у файлі!");
        setJson(parsed);
        setTitle(parsed.title);
        setNumQuestions(parsed.questions.length);
      } catch (err) {
        setJson(null);
        setError("Помилка розбору: " + err.message);
      }
    };
    reader.readAsText(file, "utf-8");
  };

  const handleSave = async () => {
    if (!json || !title || !numQuestions) return;
    setSaving(true);
    setError(null);
    const toSend = {
      ...json,
      title: title.trim(),
      num_questions: Number(numQuestions),
      total_questions: json.questions.length,
      questions: json.questions,
    };
    try {
      const res = await fetch("/api/themes/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSend),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        setError("Не вдалося зберегти тему!");
      }
    } catch {
      setError("Не вдалося зберегти тему!");
    } finally {
      setSaving(false);
    }
  };

  if (!logged) {
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div className="card p-4 shadow-sm text-center" style={{ maxWidth: 400 }}>
          <h2 className="mb-4">Вхід в адмінку</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="form-control form-control-lg mb-3"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <button type="submit" className="btn btn-primary btn-lg w-100">Увійти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4 text-center">Конвертація питань із файлів</h2>
      <div className="mb-3">
        <label className="form-label fs-5">Виберіть файл (txt):</label>
        <input type="file" className="form-control" accept=".txt" onChange={handleFile} />
      </div>
      {uploaded && json && (
        <>
          <div className="alert alert-success py-2">
            Завантажено: <b>{uploaded}</b> | Успішно конвертовано <b>{json.questions.length}</b> питань
          </div>
          <div className="card p-3 mb-3">
            <label className="form-label">Назва теми:</label>
            <input type="text" className="form-control mb-2" value={title} onChange={e => setTitle(e.target.value)} />
            <label className="form-label">Кількість питань для тесту:</label>
            <input type="number" className="form-control mb-2" min={1} max={json.questions.length} value={numQuestions} onChange={e => setNumQuestions(e.target.value)} />
            <button className="btn btn-success mt-2" disabled={saving} onClick={handleSave}>Зберегти тему</button>
          </div>
        </>
      )}
      {saved && (
        <div className="alert alert-info py-2 mt-2">Тему додано! Можна проходити тест у списку тем.</div>
      )}
      {json && (
        <pre className="bg-light p-3 rounded small" style={{ maxHeight: 300, overflow: "auto" }}>{JSON.stringify(json, null, 2)}</pre>
      )}
      {error && (
        <div className="alert alert-danger py-2 mt-3">{error}</div>
      )}
    </div>
  );
}
