/* Daily recall uses the existing lesson content and the existing local backup. */
(function () {
  'use strict';
  const isCode = typeof all !== 'undefined' && Array.isArray(all);
  const items = isCode ? all : lessons;
  items.forEach(item => {
    const section = item.sections?.[isCode ? (item.studyFlow?.[0]?.[0] ?? 0) : 0];
    if (!section?.blocks) return;
    const longTour = [28, 38, 48, 49, 55, 56, 58].includes(item.number);
    const text = isCode
      ? 'Chia bài thành các phiên 25–30 phút; ghi lại bước đang làm và tiếp tục nếu chưa xong.'
      : longTour
        ? 'Ước tính 2–4 giờ hoặc hơn, chia qua nhiều buổi: lập dàn ý, tập thử theo thời lượng bài, nghe lại và sửa. Thời gian mô phỏng tour không thể rút ngắn thành một buổi 20 phút.'
        : 'Ước tính 70–110 phút: 20–30 phút học và nghe, 20–30 phút nói/ghi âm, 20–35 phút làm và đối chiếu. Có thể chia 15–20 phút sáng và một hoặc hai buổi tối; tiếp tục hôm sau nếu chưa xong.';
    section.blocks.push({type: isCode ? 'Callout' : 'text', text});
  });
  const id = item => isCode ? item.id : 'I' + item.number;
  const doneKey = item => isCode ? item.id : item.number;
  const today = () => {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  };
  function plusDays(date, count) {
    const [year, month, day] = date.split('-').map(Number);
    const d = new Date(year, month - 1, day + count, 12);
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  }
  const reviews = () => state.dailyReview || {};
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function persist() {
    try { save(); return true; } catch (_) { return false; }
  }
  function completed() { return items.filter(item => Boolean(state.done[doneKey(item)])); }
  function dueItems() {
    return completed().filter(item => !reviews()[id(item)] || reviews()[id(item)].next <= today())
      .sort((a, b) => {
        const x = reviews()[id(a)], y = reviews()[id(b)];
        return (x?.next || '').localeCompare(y?.next || '') || items.indexOf(b) - items.indexOf(a);
      });
  }
  function homePanel() {
    const box = el('section', 'study-resume daily-review-home');
    const done = completed().length;
    const due = dueItems().length;
    box.append(el('p', 'study-kicker', 'ÔN BÀI MỖI NGÀY'), el('h2', '', 'Kiểm tra bài đã học'));
    box.append(el('p', '', done ? (due ? `Có ${due} bài đến lượt ôn. Làm tối đa 3 bài mỗi lượt.` : 'Hôm nay chưa có bài đến hạn. Bạn vẫn có thể ôn lại.') : 'Sau khi hoàn thành bài đầu tiên, đánh dấu hoàn thành để đưa bài vào lịch ôn.'));
    const a = el('a', 'study-primary', done ? 'Mở bài kiểm tra →' : 'Xem cách kiểm tra →');
    a.href = '#kiem-tra-hang-ngay';
    box.append(a);
    return box;
  }
  function section(item, re) { return (item.sections || []).find(s => re.test(s.title || '')); }
  function meaningful(block) {
    return block && (typeof block.text === 'string' && block.text.trim() || Array.isArray(block.rows));
  }
  function firstGroup(blocks) {
    const list = (blocks || []).filter(meaningful);
    if (!list.length) return [];
    let start = list.findIndex(b => /^(?:subheading|heading)/i.test(b.type || ''));
    if (start < 0) return list.slice(0, 2);
    const out = [list[start]];
    for (let i = start + 1; i < list.length; i++) {
      if (/^(?:subheading|heading)/i.test(list[i].type || '')) break;
      out.push(list[i]);
    }
    return out.length > 1 ? out : list.slice(0, 2);
  }
  function material(item) {
    if (!isCode) {
      const exercise = section(item, /^9\.\s*Esercizi/i);
      const answer = section(item, /^10\.\s*(?:Answer|Risposte)/i);
      if (exercise && answer) return {
        prompt: firstGroup(exercise.blocks), reference: firstGroup(answer.blocks),
        referenceTitle: 'Đáp án tham khảo từ bài học'
      };
    }
    if (isCode && item.studyFlow?.[3]?.length) {
      const practice = item.sections[item.studyFlow[3][0]];
      const reference = item.sections[item.studyFlow[4]?.[0]];
      if (practice?.blocks?.some(meaningful)) return {
        prompt: practice.blocks.filter(meaningful),
        reference: (reference?.blocks || []).filter(meaningful),
        referenceTitle: 'Đáp án hoặc tiêu chí đối chiếu của bài (tự đánh giá)'
      };
    }
    // Use the actual exercise from the original Banking lesson when available.
    const original = section(item, /^B\.\s*Nội dung giáo trình Banking/i);
    const originalText = (original?.blocks || []).map(b => b.text || '').find(t => /Bài tập\s*:/i.test(t));
    const bankingTask = originalText?.match(/Bài tập\s*:\s*([\s\S]+)/i)?.[1]?.trim();
    const practice = section(item, /^D\.\s*Luyện/i) || section(item, /check understanding/i) ||
      section(item, /interview question/i) || section(item, /exercise/i) ||
      section(item, /thực hành|bài tập|kiểm tra|lab|homework/i);
    const ref = section(item, /^C\.\s*Ví dụ/i) || section(item, /đáp án|answer key/i) ||
      section(item, /simple example|concept explanation|ví dụ/i);
    const candidates = (practice?.blocks || []).filter(b => meaningful(b) && !/heading/i.test(b.type || ''));
    return {
      prompt: bankingTask ? [{ type: 'Paragraph', text: bankingTask }] : candidates.slice(0, 1),
      reference: (ref?.blocks || []).filter(meaningful).slice(0, 4),
      referenceTitle: 'Ví dụ hoặc gợi ý của bài (tự đối chiếu, không phải đáp án chấm tự động)'
    };
  }
  function reviewCard(item) {
    const key = id(item), card = el('section', 'study-finish daily-review-card');
    card.append(el('h3', '', (isCode ? '' : 'Bài ' + item.number + ' · ') + item.title));
    card.append(el('p', 'study-stage-help', 'Tự làm trước khi xem đáp án hoặc gợi ý. Đây là phần tự đối chiếu, app không tự chấm câu trả lời mở.'));
    const content = material(item);
    const question = el('div', 'study-prose');
    if (content.prompt.length) question.innerHTML = renderBlocks(content.prompt);
    else question.append(el('p', '', 'Không có câu hỏi ngắn phù hợp trong bài. Hãy tóm tắt kiến thức chính và làm lại một ví dụ của bài.'));
    card.append(question);
    const label = el('label', '', 'Câu trả lời của bạn');
    const input = el('textarea');
    input.rows = 4;
    input.placeholder = isCode ? 'Viết câu trả lời, ví dụ hoặc các bước kiểm thử…' : 'Viết câu trả lời; bạn cũng có thể nói thành tiếng trước…';
    input.value = state.dailyReviewDrafts?.[key] || '';
    input.addEventListener('input', () => {
      (state.dailyReviewDrafts ||= {})[key] = input.value;
      persist();
    });
    label.append(input);
    card.append(label);
    const actions = el('div', 'study-actions');
    const reveal = el('button', 'secondary', 'Xem đáp án / gợi ý');
    reveal.type = 'button';
    const status = el('p', 'study-stage-help');
    status.setAttribute('role', 'status');
    const ref = el('div', 'daily-review-reference');
    ref.hidden = true;
    ref.append(el('h4', '', content.referenceTitle));
    const body = el('div', 'study-prose');
    if (content.reference.length) body.innerHTML = renderBlocks(content.reference);
    else body.append(el('p', '', 'Mở lại bài để đối chiếu với phần lý thuyết, ví dụ và tiêu chí hoàn thành.'));
    ref.append(body);
    const ratings = el('div', 'study-actions');
    const saveRating = understood => {
      const day = today(), old = reviews()[key], sameDay = old?.date === day;
      const stage = understood ? Math.min((old?.understood && !sameDay ? old.stage : old?.understood && sameDay ? old.stage - 1 : 0) + 1, 5) : 0;
      const days = [1, 3, 7, 14, 30];
      const record = { date: day, next: understood ? plusDays(day, days[stage - 1]) : day, stage, understood, answer: input.value.trim() };
      const store = (state.dailyReview ||= {});
      const oldRecord = store[key];
      const oldDraft = state.dailyReviewDrafts?.[key];
      const oldHistory = state.dailyReviewHistory;
      store[key] = record;
      state.dailyReviewHistory = [...(oldHistory || []), { lesson: key, ...record }];
      if (state.dailyReviewDrafts) delete state.dailyReviewDrafts[key];
      if (!persist()) {
        if (oldRecord) store[key] = oldRecord; else delete store[key];
        state.dailyReviewHistory = oldHistory;
        if (oldDraft !== undefined) (state.dailyReviewDrafts ||= {})[key] = oldDraft;
        status.textContent = 'Không lưu được kết quả. Hãy kiểm tra bộ nhớ trình duyệt và thử lại.';
        return;
      }
      status.textContent = understood ? `Đã lưu: tự đánh giá đã nắm. Lần ôn tiếp theo từ ${record.next}.` : 'Đã lưu: cần ôn lại. Bài này vẫn được ưu tiên trong lượt ôn tiếp theo.';
      ratings.querySelectorAll('button').forEach(button => { button.disabled = true; });
    };
    const retry = el('button', 'secondary', 'Cần ôn lại'); retry.type = 'button';
    const pass = el('button', 'study-primary', 'Tự đánh giá đã nắm'); pass.type = 'button';
    retry.addEventListener('click', () => saveRating(false));
    pass.addEventListener('click', () => saveRating(true));
    ratings.append(retry, pass);
    ref.append(el('p', 'study-stage-help', 'So sánh câu trả lời với tài liệu rồi tự chọn mức độ nắm bài.'), ratings);
    reveal.addEventListener('click', () => {
      if (!input.value.trim()) { status.textContent = 'Hãy viết câu trả lời trước khi xem gợi ý.'; input.focus(); return; }
      ref.hidden = false;
      status.textContent = '';
      reveal.hidden = true;
    });
    actions.append(reveal);
    card.append(actions, ref, status);
    const last = reviews()[key];
    if (last) card.append(el('small', '', `Lần gần nhất: ${last.date} · ${last.understood ? 'tự đánh giá đã nắm' : 'cần ôn lại'} · Lượt kế tiếp: ${last.next}.`));
    return card;
  }
  function lessonPanel(item) {
    const details = el('details', 'study-disclosure');
    details.append(el('summary', '', 'Kiểm tra lại bài này · tự làm và đối chiếu'));
    details.append(reviewCard(item));
    return details;
  }
  function show() {
    const box = el('div', 'lp-page daily-review-page');
    box.append(el('h2', '', 'Kiểm tra bài đã học'), el('p', '', 'Ôn trước bài mới: tự trả lời, xem đáp án hoặc ví dụ, rồi tự đánh giá. Các bài cần ôn được chọn từ bài bạn đã đánh dấu hoàn thành trên thiết bị này.'));
    const done = completed(), due = dueItems(), list = due.slice(0, 3);
    if (!done.length) {
      box.append(el('p', 'study-finish', 'Chưa có bài hoàn thành. Hãy học bài đầu tiên, tự kiểm tra ở cuối bài rồi đánh dấu hoàn thành.'));
    } else if (!due.length) {
      box.append(el('p', 'study-finish', 'Chưa có bài đến hạn hôm nay. Bạn có thể luyện lại bài gần đây bên dưới.'));
      list.push(...done.slice(-1));
    } else if (due.length > list.length) {
      box.append(el('p', '', `Còn ${due.length - list.length} bài đến hạn sau lượt này. Quay lại trang này để tiếp tục.`));
    }
    list.forEach(item => box.append(reviewCard(item)));
    const history = state.dailyReviewHistory || [];
    if (history.length) {
      const details = el('details', 'study-disclosure');
      details.append(el('summary', '', 'Lịch sử kiểm tra gần đây'));
      [...history].reverse().slice(0, 10).forEach(entry => {
        const item = items.find(value => id(value) === entry.lesson);
        const p = el('p', '', `${entry.date} · ${item?.title || entry.lesson} · ${entry.understood ? 'tự đánh giá đã nắm' : 'cần ôn lại'}`);
        details.append(p);
      });
      box.append(details);
    }
    const back = el('a', 'secondary', '← Về lộ trình'); back.href = '#lo-trinh'; box.append(back);
    root.append(box);
  }
  window.DailyReview = { homePanel, lessonPanel, show };
})();
