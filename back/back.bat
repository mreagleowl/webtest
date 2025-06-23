@echo off
REM Активировать venv (если используешь)
IF EXIST venv\Scripts\activate (
    call venv\Scripts\activate
)

REM Запустить FastAPI на порту 8008
uvicorn backend.main:app --host 0.0.0.0 --port 18008 --reload

REM Чтобы окно не закрылось мгновенно при ошибке
pause
