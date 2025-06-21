# WebTest Backend (FastAPI)

## Быстрый старт

```bash
docker build -t webtest-backend .
docker run -d -p 8000:8000 -v $(pwd)/backend/questions:/app/backend/questions -v $(pwd)/backend/results:/app/backend/results webtest-backend
```

## Основные эндпоинты

- `GET /api/themes` — список тем
- `GET /api/questions/{theme_id}` — случайные вопросы по теме
- `POST /api/result` — сохранить результат
- `POST /api/admin/convert` — конвертация текстового файла в json (только для админа)

## Пример тестового файла для конвертера


