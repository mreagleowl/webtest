import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Themes() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/themes")
      .then((res) => res.json())
      .then((data) => {
        setThemes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Не вдалося завантажити теми.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Завантаження...</div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Оберіть тему тесту</h2>
      <div className="row justify-content-center">
        {themes.map((theme, idx) => (
          <div className="col-md-6 col-lg-4 mb-4" key={idx}>
            <div className="card h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">{theme.title}</h5>
                <p className="card-text mb-2">Питань у темі: <b>{theme.total_questions}</b></p>
                <p className="card-text mb-3">Буде задано: <b>{theme.num_questions}</b></p>
                <Link to={`/pib?theme=${encodeURIComponent(theme.id)}`} className="btn btn-primary btn-lg mt-auto">
                  Вибрати
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <Link to="/" className="btn btn-outline-secondary btn-lg">Назад</Link>
      </div>
    </div>
  );
}
