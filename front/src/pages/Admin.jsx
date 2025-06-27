import React, { useState, useEffect } from "react";

function parseTxt(content) {
  const lines = content.split(/\r?\n/).map(l => l.trim());
  const questions = [];
  let cur = null;
  let id = 1;
  function parseCorrect(val) {
    const letterArr = val.replace(/[✅Правильна відповідь:]/g, '').replace(/[^АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЬЮЯ,]/g, '').split(',').map(x => x.trim()).filter(Boolean);
    const letters = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЬЮЯ'.split('');
    const letterToIdx = Object.fromEntries(letters.map((l, i) => [l, i]));
    return letterArr.map(l => letterToIdx[l]).filter(x => x !== undefined);
  }
  lines.forEach(line => {
    const qMatch = line.match(/^(\d+)\.\s*(.+)$/);
    const optMatch = line.match(/^([АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЬЮЯ])\.\s*(.+)$/);
    const correctMatch = line.match(/^✅\s*Правильна відповідь:\s*(.+)$/i);
    if (qMatch) {
      if (cur) questions.push(cur);
      cur = { id: id++, question: qMatch[2], options: [], correct: [] };
    } else if (optMatch && cur) {
      cur.options.push(optMatch[2]);
    } else if (correctMatch && cur) {
      cur.correct = parseCorrect(correctMatch[1]);
    }
  });
  if (cur) questions.push(cur);
  const title = questions[0]?.question?.slice(0, 30) || "Тема тесту";

  // --- Проверка на латинские буквы в вариантах ---
  const badOptions = [];
  questions.forEach((q, qIdx) => {
    (q.options || []).forEach((opt, optIdx) => {
      if (/^[A-Z]\./.test(opt)) {
        badOptions.push(`Питання ${qIdx + 1}, варіант ${optIdx + 1}: "${opt}"`);
      }
    });
  });
  if (badOptions.length) {
    throw new Error(
      'Виявлено варіанти, що починаються з латинської букви (A., B., ...):\n' +
      badOptions.join('\n') +
      '\nВаріанти відповідей повинні починатися з кириличної букви (А., Б., ...).'
    );
  }
  // --- конец блока ---

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

  // Новое: темы для списка и редактирования
  const [themes, setThemes] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editing, setEditing] = useState(null); // {id, title, num_questions}

  useEffect(() => {
    if (logged) fetchThemes();
    // eslint-disable-next-line
  }, [logged, refresh]);

  function fetchThemes() {
    fetch("/api/themes").then(r => r.json()).then(setThemes);
  }

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
        setRefresh(r => !r);
        setJson(null);
        setUploaded(null);
      } else {
        setError("Не вдалося зберегти тему!");
      }
    } catch {
      setError("Не вдалося зберегти тему!");
    } finally {
      setSaving(false);
    }
  };

  // Новое: удалить тему
  const handleDelete = async (id) => {
    if (!window.confirm("Видалити цю тему?")) return;
    await fetch(`/api/themes/${id}`, { method: "DELETE" });
    setRefresh(r => !r);
  };

  // Новое: редактировать тему
  const handleEdit = (t) => {
    setEditing({ ...t });
  };
  const handleEditSave = async () => {
    await fetch(`/api/themes/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editing.title, num_questions: editing.num_questions })
    });
    setEditing(null);
    setRefresh(r => !r);
  };

  if (!logged) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
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
    <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh", maxWidth: 750 }}>
      <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
        <h2 className="mb-0">Теми для тестів</h2>
        <a href="/" className="btn btn-outline-secondary">На головну</a>
      </div>
      {/* Добавление новой темы */}
      <div className="card p-3 mb-4 w-100" style={{ maxWidth: 700 }}>
        <h5 className="mb-3">Додати нову тему (.txt)</h5>
        <input type="file" className="form-control mb-2" accept=".txt" onChange={handleFile} />
        {uploaded && json && (
          <>
            <div className="alert alert-success py-2">
              Завантажено: <b>{uploaded}</b> | Успішно конвертовано <b>{json.questions.length}</b> питань
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Назва теми:</label>
                <input type="text" className="form-control mb-2" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="col">
                <label className="form-label">Кількість питань для тесту:</label>
                <input type="number" className="form-control mb-2" min={1} max={json.questions.length} value={numQuestions} onChange={e => setNumQuestions(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-success" disabled={saving} onClick={handleSave}>Зберегти тему</button>
          </>
        )}
        {saved && (
          <div className="alert alert-info py-2 mt-2">Тему додано! Можна проходити тест у списку тем.</div>
        )}
        {json && (
          <pre className="bg-light p-3 rounded small" style={{ maxHeight: 250, overflow: "auto" }}>{JSON.stringify(json, null, 2)}</pre>
        )}
        {error && (
          <div className="alert alert-danger py-2 mt-3">{error}</div>
        )}
      </div>
      {/* Список тем */}
      <div className="w-100">
        <h5 className="mb-3">Список тем</h5>
        <div className="table-responsive">
          <table className="table table-bordered align-middle bg-white">
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва теми</th>
                <th>Питань</th>
                <th>Кількість на тест</th>
                <th style={{ minWidth: 200 }}></th>
              </tr>
            </thead>
            <tbody>
              {themes.map((t) => (
                editing?.id === t.id ? (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td><input type="text" className="form-control" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></td>
                    <td>{t.total_questions || t.num_questions}</td>
                    <td><input type="number" className="form-control" value={editing.num_questions} min={1} max={t.total_questions || t.num_questions} onChange={e => setEditing({ ...editing, num_questions: e.target.value })} /></td>
                    <td style={{ minWidth: 210, whiteSpace: "nowrap" }}>
                      <div className="d-flex flex-row justify-content-center align-items-center" style={{ gap: 10 }}>
                        <button className="btn btn-success btn-sm" style={{ minWidth: 95 }} onClick={handleEditSave}>Зберегти</button>
                        <button className="btn btn-secondary btn-sm" style={{ minWidth: 95 }} onClick={() => setEditing(null)}>Відмінити</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.title}</td>
                    <td>{t.total_questions || t.num_questions}</td>
                    <td>{t.num_questions}</td>
                    <td style={{ minWidth: 210, whiteSpace: "nowrap" }}>
                      <div className="d-flex flex-row justify-content-center align-items-center" style={{ gap: 10 }}>
                        <button className="btn btn-outline-primary btn-sm" style={{ minWidth: 95 }} onClick={() => handleEdit(t)}>Редагувати</button>
                        <button className="btn btn-outline-danger btn-sm" style={{ minWidth: 95 }} onClick={() => handleDelete(t.id)}>Видалити</button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
              {themes.length === 0 && <tr><td colSpan={5} className="text-center">Тем не знайдено</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
