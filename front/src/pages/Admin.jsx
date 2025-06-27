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

  // --- Валидация на латиницу в вариантах ---
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
  // --- END ---

  return {
    title,
    num_questions: questions.length,
    total_questions: questions.length,
    questions
  };
}

// ... остальной файл без изменений ...
