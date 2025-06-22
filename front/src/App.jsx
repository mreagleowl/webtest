export default function App() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <img src="/logo.png" alt="Логотип" className="mb-4" style={{ width: 100 }} />
      <h1 className="display-4 mb-3">WebTest</h1>
      <p className="lead mb-4">Тестування з охорони праці</p>
      <div className="mb-3">
        <a href="/themes" className="btn btn-primary btn-lg me-3">Почати тест</a>
        <a href="/admin" className="btn btn-outline-secondary btn-lg">Вхід для адміністратора</a>
      </div>
      <p className="text-muted mt-4">Місце для вашого логотипу</p>
    </div>
  );
}
