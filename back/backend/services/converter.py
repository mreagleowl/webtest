# Версия: 1.3.1, Дата: 2025-06-26 UTC

import re

def parse_questions_file(text: str):
    """
    Парсинг текстового файла с вопросами и вариантами відповідей.
    Если обнаружены латинские символы (A-Z, a-z) — обработка прерывается,
    выбрасывается Exception c подробным списком ошибок.
    Если вариант ответа начинается с латинской буквы и точки (A., B. ...) —
    обработка также прерывается с пояснением.
    """

    warnings = []
    # 1. Проверка на любые латинские символы в тексте
    for idx, line in enumerate(text.splitlines(), 1):
        for match in re.finditer(r'[A-Za-z]', line):
            warnings.append({
                'line_number': idx,
                'char': match.group(0),
                'char_index': match.start() + 1,
                'line': line
            })
    # 2. Парсинг блоков только если нет ошибок
    if warnings:
        message_lines = ["ПОМИЛКА: Виявлено латинські символи у файлі!"]
        for w in warnings:
            message_lines.append(
                f"Рядок {w['line_number']}, позиція {w['char_index']}: '{w['char']}' у \"{w['line']}\""
            )
        raise Exception('\n'.join(message_lines))

    blocks = re.split(r'\n\s*\n', text.strip())
    questions = []
    for block_num, block in enumerate(blocks, 1):
        lines = block.strip().split('\n')
        if not lines or len(lines) < 3:
            continue
        question_match = re.match(r'^\d+\.\s*(.*)', lines[0])
        if not question_match:
            continue
        question_text = question_match.group(1)
        options = []
        for opt_idx, l in enumerate(lines[1:-1], 1):
            # Проверка: начинается ли строка с латинской буквы и точки
            if re.match(r'^[A-Z]\.\s', l):
                raise Exception(
                    f"ПОМИЛКА: В рядку {block_num}, варіант {opt_idx} починається з латинської букви!\n"
                    f"Рядок: \"{l}\"\n"
                    "Варіанти відповідей повинні починатися з кириличної букви (А., Б., ...)."
                )
            opt_match = re.match(r'^([А-ЯІЇЄҐ])\.\s*(.*)', l)
            if opt_match:
                options.append(opt_match.group(2))
        correct_line = lines[-1]
        correct_match = re.search(r'Правильна відповідь:\s*([А-ЯІЇЄҐ](?:,\s*[А-ЯІЇЄҐ])*)', correct_line)
        if not correct_match:
            continue
        correct_letters = [c.strip() for c in correct_match.group(1).split(",")]
        correct_indices = [ord(l) - ord("А") + 1 for l in correct_letters]
        questions.append({
            "question": question_text,
            "options": options,
            "correct": correct_indices
        })
    return questions
