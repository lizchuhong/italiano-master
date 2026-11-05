/* Per-question drafts use the original lesson, section, and block keys. */
(function () {
  'use strict';

  const codeApp = typeof all !== 'undefined';
  const listTypes = new Set(['number', 'List Number', 'bullet', 'List Bullet']);
  const textTypes = new Set(['text', 'Normal', 'Paragraph']);

  function store(key, text, status) {
    state.answers ||= {};
    state.answers[key] = { text, status, updated: new Date().toISOString() };
    save();
  }

  function buildAnswer(key, number) {
    const box = document.createElement('div');
    box.className = 'inline-answer';
    const fieldId = 'ans-' + key.replace(/[^a-zA-Z0-9]/g, '-');
    box.innerHTML = '<label for="' + fieldId + '">Câu ' + number + ' <span class="answer-status"></span></label>' +
      '<textarea id="' + fieldId + '" rows="3" placeholder="Viết câu trả lời của bạn" aria-label="Trả lời câu ' + number + '"></textarea>' +
      '<div class="answer-actions"><button type="button" class="secondary submit-answer">Đánh dấu đã làm</button>' +
      '<small class="save-status" aria-live="polite"></small></div>';

    const field = box.querySelector('textarea');
    const badge = box.querySelector('.answer-status');
    const hint = box.querySelector('.save-status');
    const update = () => {
      const answer = state.answers?.[key];
      badge.textContent = answer?.status === 'submitted' ? 'Đã làm' : answer?.text?.trim() ? 'Bản nháp' : '';
    };
    field.value = state.answers?.[key]?.text || '';
    update();
    field.addEventListener('input', () => {
      store(key, field.value, 'draft');
      hint.textContent = 'Đã lưu bản nháp';
      update();
    });
    box.querySelector('button').addEventListener('click', () => {
      if (!field.value.trim()) {
        hint.textContent = 'Hãy nhập câu trả lời trước.';
        field.focus();
        return;
      }
      store(key, field.value, 'submitted');
      hint.textContent = 'Đã lưu trên thiết bị này';
      update();
    });
    return box;
  }

  function showSavedAnswers(card, prefixes, rendered) {
    const previous = Object.entries(state.answers || {}).filter(([key, answer]) =>
      prefixes.some(prefix => key.startsWith(prefix)) && !rendered.has(key) && answer?.text?.trim());
    if (!previous.length) return;

    const archive = document.createElement('details');
    archive.className = 'optional-notes';
    archive.innerHTML = '<summary>Câu trả lời đã lưu trước đây (' + previous.length + ')</summary>';
    previous.forEach(([, answer], index) => {
      const label = document.createElement('label');
      label.textContent = 'Bài đã lưu ' + (index + 1);
      const field = document.createElement('textarea');
      field.readOnly = true;
      field.value = answer.text;
      label.append(field);
      archive.append(label);
    });
    card.append(archive);
  }

  function addQuestions(card, item) {
    const lessonId = codeApp ? item.id : 'I' + item.number;
    const suffix = lessonId + ':s' + section + ':';
    const prefix = 'q:' + suffix;
    const rendered = new Set();
    let number = 0;
    const answerFor = key => {
      rendered.add(key);
      return buildAnswer(key, ++number);
    };

    if (window.GuidedStudy?.hasExercises(item, section)) {
      const sectionData = item.sections[section];
      const numberedOnly = !codeApp && /^16\. Economia/.test(sectionData.title);
      const acceptsParagraph = !codeApp && /^9\. Esercizi/.test(sectionData.title);
      const nodes = new Map([...card.querySelectorAll(':scope > [data-block-index]')]
        .map(node => [Number(node.dataset.blockIndex), node]));

      sectionData.blocks.forEach((block, index) => {
        const node = nodes.get(index);
        const text = block.text?.trim();
        if (!node || !text || /^https?:\/\//.test(text)) return;

        const key = prefix + 'b' + index;
        if (listTypes.has(block.type)) {
          if (numberedOnly && block.type !== 'number') return;
          node.after(answerFor(key));
          return;
        }
        if (!textTypes.has(block.type)) return;

        const markers = [...text.matchAll(/(?:^|\s)(\d{1,2})\)\s*/g)];
        if (markers.length > 1) {
          const group = document.createDocumentFragment();
          const context = text.slice(0, markers[0].index).trim();
          if (context) {
            const intro = document.createElement('p');
            intro.textContent = context;
            group.append(intro);
          }
          markers.forEach((marker, i) => {
            const prompt = document.createElement('p');
            prompt.className = 'question-prompt';
            prompt.textContent = text.slice(marker.index + marker[0].length, markers[i + 1]?.index).trim();
            group.append(prompt, answerFor(key + ':p' + i));
          });
          node.replaceWith(group);
        } else if (acceptsParagraph || /^(?:hãy |viết |dịch |lập |tạo |vẽ |mô tả |liệt kê |so sánh |nêu |sửa:|ghi âm |tập |bài viết:|write |create |add |implement |run |test |fix |explain )|\bBài viết:/i.test(text)) {
          node.after(answerFor(key + ':p0'));
        }
      });
    }

    showSavedAnswers(card, [prefix, 'extra:' + suffix], rendered);
  }

  function enhance() {
    const card = root.querySelector('.card > .navdays, .card > .lesson-nav')?.parentElement;
    if (!card) return;
    const item = (codeApp ? all : lessons)[current];
    addQuestions(card, item);
    const legacy = root.querySelector('#work')?.closest('.card');
    if (legacy) {
      if (!codeApp) legacy.querySelectorAll('.controls button:not(:first-child)').forEach(button => button.remove());
      const disclosure = document.createElement('details');
      disclosure.className = 'optional-notes';
      const summary = document.createElement('summary');
      summary.textContent = codeApp ? 'Ghi chú và xem trước HTML' : 'Ghi chú của mục';
      legacy.before(disclosure);
      disclosure.append(summary, legacy);
    }
  }

  if (codeApp) {
    const originalRender = renderDay;
    renderDay = function () { originalRender(); enhance(); };
  } else {
    const originalRender = renderLesson;
    renderLesson = function () { originalRender(); enhance(); };
    const originalNotes = notes;
    notes = function () {
      originalNotes();
      const oldEntries = Object.entries(state.notes || {}).filter(([key, value]) =>
        /^lesson-(?:1[9]|2\d|3[0-8])-\d+$/.test(key) && String(value || '').trim());
      if (!oldEntries.length) return;
      const archive = document.createElement('details');
      archive.className = 'optional-notes';
      archive.innerHTML = '<summary>Ghi chú theo số bài cũ 19–38 (' + oldEntries.length + ')</summary>' +
        '<p class="muted">Các bài tháng 11 và 12 từng trùng số. Hãy kiểm tra nội dung ghi chú trước khi sao chép sang bài tương ứng.</p>';
      for (const [key, value] of oldEntries) {
        const label = document.createElement('label');
        label.textContent = key;
        const field = document.createElement('textarea');
        field.readOnly = true;
        field.value = String(value);
        label.append(field);
        archive.append(label);
      }
      root.append(archive);
    };
  }
})();
