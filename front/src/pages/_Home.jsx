import React, { useEffect, useState } from "react";

export default function Home() {
  const [themes, setThemes] = useState([]);
  useEffect(() => {
    fetch("/api/themes")
      .then((r) => r.json())
      .then(setThemes)
      .catch(() => setThemes([]));
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <h1>Тестування з охорони праці</h1>
      <h2>Оберіть тему</h2>
      <ul>
        {themes.map((theme) => (
          <li key={theme.id} style={{ margin: "1em 0", fontWeight: "bold" }}>
            {theme.title} ({theme.num_questions} питань)
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 40, fontSize: 12, color: "#aaa" }}>
        <b>WebTest</b> | демо
      </div>
    </div>
  );
}
