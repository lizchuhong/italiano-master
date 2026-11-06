/* Course catalog and lesson reader. The curriculum's section indices also identify saved work. */
(function () {
  'use strict';

  const C = typeof all !== 'undefined';
  const items = C ? all : lessons;
  const tracks = C ? [
    { title: 'QA Banking', range: 'Tuần 1–6', start: 0, end: 30 },
    { title: 'Lập trình & dự án', range: 'Tuần 7–46', start: 30, end: 230 },
    { title: 'FDE', range: 'Tuần 47–50', start: 230, end: 250 }
  ] : [
    { title: 'Giao tiếp & ngữ pháp', range: 'Bài 1–14', start: 0, end: 14 },
    { title: 'Dẫn tour & thuyết minh', range: 'Bài 15–28', start: 14, end: 28 },
    { title: 'Đặt tour, email & SEO', range: 'Bài 29–38', start: 28, end: 38 },
    { title: 'Ứng biến & portfolio', range: 'Bài 39–58', start: 38, end: 58 }
  ];
  const stages = C ? [
    { label: 'Học bài', title: 'Kiến thức & ví dụ' },
    { label: 'Thực hành', title: 'Thực hành' },
    { label: 'Tự kiểm tra', title: 'Tự kiểm tra' }
  ] : [
    { label: 'Học bài', title: 'Từ vựng & ngữ pháp' },
    { label: 'Nghe & nói', title: 'Nghe mẫu và luyện nói' },
    { label: 'Làm bài', title: 'Làm bài' },
    { label: 'Đối chiếu', title: 'Đối chiếu' }
  ];
  const italianStages = [0, 1, 1, 1, 2, 3, 3, 3, 3, 4, 4, 3, 4, 4];
  const italianLabels = [
    'Mục tiêu', 'Ngữ pháp', 'Từ vựng', 'Phát âm', 'Nghe và nhắc lại',
    'Luyện nói', 'Đọc hiểu và viết', 'Nhập vai', 'Bài tập', 'Đáp án',
    'Hội thoại mẫu', 'Bài về nhà', 'Lịch ôn', 'Sổ lỗi'
  ];
  const codeLabels = {
    'What are we learning?': 'Mục tiêu',
    'Why does it matter?': 'Vì sao cần học?',
    'Concept explanation': 'Giải thích khái niệm',
    'Giải thích từ số 0 (Beginner Deep Dive)': 'Giải thích từ số 0',
    'Simple example': 'Ví dụ đơn giản',
    'Project example': 'Ví dụ trong dự án',
    'Example': 'Ví dụ',
    'Exercise': 'Bài tập chính',
    'Debugging exercise': 'Bài tập tìm lỗi',
    'Testing exercise': 'Bài tập kiểm thử',
    'QA-first questions': 'Câu hỏi về kiểm thử',
    'Hybrid practice': 'Thực hành tổng hợp',
    'Hybrid tasks': 'Bài tập tổng hợp',
    'Interview question': 'Câu hỏi phỏng vấn',
    'Interview + check understanding': 'Phỏng vấn và tự kiểm tra',
    'Check understanding': 'Câu hỏi tự kiểm tra',
    'Definition of Done': 'Tiêu chí hoàn thành',
    'Cloud/Git setup': 'Cài đặt Cloud và Git'
  };
  const practiceStage = stages.length - 2;
  const reviewStage = stages.length - 1;
  const id = item => C ? item.id : 'I' + item.number;
  const doneKey = item => C ? item.id : item.number;
  const isDone = item => Boolean(state.done[doneKey(item)]);
  const lessonIndex = new Map(items.map((item, index) => [id(item), index]));
  const trackIndex = index => tracks.findIndex(track => index >= track.start && index < track.end);
  const lessonTitle = item => C ? item.title.replace(/^Banking \d+:\s*/, '') : item.title;
  const sectionNumber = value => Number(/^(\d+)\.\s/.exec(value.title)?.[1]) - 1;
  const cleanTitle = value => value.title.replace(/^\d+\.\s*|^[A-E]\.\s*/g, '');
  const sectionLabel = value => value.guideLabel ||
    (C ? codeLabels[cleanTitle(value)] : italianLabels[sectionNumber(value)]) || cleanTitle(value);
  const normalize = value => value.toLocaleLowerCase('vi').normalize('NFD')
    .replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd').trim();

  let selectedTrack;
  let activeLesson;
  let nav;
  let toolsMenu;

  function element(tag, className, markup) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (markup) node.innerHTML = markup;
    return node;
  }

  function button(text, action, className = 'secondary') {
    const node = element('button', className);
    node.type = 'button';
    node.textContent = text;
    node.addEventListener('click', action);
    return node;
  }

  function disclosure(label, className) {
    const box = element('details', className);
    const summary = element('summary');
    summary.textContent = label;
    box.append(summary);
    return box;
  }

  function stageOf(value) {
    if (value.guideStage !== undefined) return value.guideStage;
    if (!C) return italianStages[sectionNumber(value)] ?? -1;
    const title = cleanTitle(value);
    if (/^(Học trước khi làm bài|Lab mở rộng|Finance\/Economics)/i.test(title)) return -1;
    if (/^Giới thiệu|^What are we learning\?|^Why does it matter\?|^Mục tiêu/i.test(title)) return 0;
    if (/check understanding|definition of done|^Đáp án|^Tự đánh giá/i.test(title)) return 4;
    if (/example|ví dụ|^Code \/ cấu trúc mẫu/i.test(title)) return 2;
    if (/exercise|lab|hybrid|interview question|qa-first questions|bài tập/i.test(title)) return 3;
    return 1;
  }

  function order(item) {
    if (item.studyFlow) return item.studyFlow;
    const groups = Array.from({ length: 5 }, () => []);
    item.sections.forEach((value, index) => groups[stageOf(value)]?.push(index));
    const prioritize = (stage, first) => {
      const index = groups[stage].findIndex(i => first(item.sections[i]));
      if (index > 0) groups[stage].unshift(...groups[stage].splice(index, 1));
    };
    if (C) {
      prioritize(3, value => /^Exercise$/i.test(cleanTitle(value)));
    } else {
      prioritize(2, value => Boolean(value.sampleText));
      prioritize(3, value => sectionNumber(value) === 8);
    }
    return groups;
  }

  function hasExercises(item, index) {
    const value = item.sections[index];
    if (value.practice || order(item)[3].includes(index)) return true;
    if (!C) return /^1[56]\. /.test(value.title);
    return /^(Thực hành hai ứng dụng|Mẫu và bài tập nâng cao|Hướng dẫn từ số 0|Lab mở rộng)/i.test(cleanTitle(value));
  }

  function pagesFor(item) {
    const [goals, theory, examples, practice, review] = order(item);
    if (C) return [[...goals, ...theory, ...examples], practice, review];

    const belongsTo = (index, numbers) => numbers.includes(sectionNumber(item.sections[index]));
    return [
      [...goals, ...theory.filter(index => !belongsTo(index, [3]))],
      [...examples, ...theory.filter(index => belongsTo(index, [3])),
        ...practice.filter(index => belongsTo(index, [5, 7]))],
      practice.filter(index => !belongsTo(index, [5, 7])),
      review
    ];
  }

  function persist() {
    try {
      save();
      return true;
    } catch {
      return false;
    }
  }

  function remember(item, index, stage) {
    if (!C) state.started[item.number] ||= new Date().toISOString().slice(0, 10);
    if (stage >= 0) state.reading = { id: id(item), index: current, section: index };
    persist();
  }

  function lessonHash(index, target) {
    const item = items[index];
    const part = Number.isInteger(target) && item.sections[target] ? target : pagesFor(item).flat()[0];
    return '#bai/' + id(item) + '/' + part;
  }

  function lessonLink(text, index, target, className = 'secondary') {
    return link(text, lessonHash(index, target), className);
  }

  function link(text, href, className) {
    const node = element('a', className);
    node.href = href;
    node.textContent = text;
    return node;
  }

  function suggestion() {
    const index = lessonIndex.get(state.reading?.id);
    if (index !== undefined && !isDone(items[index])) {
      const part = state.reading.section;
      return { index, part: pagesFor(items[index]).flat().includes(part) ? part : undefined, resume: true };
    }
    const next = items.findIndex((item, i) => i > (index ?? -1) && !isDone(item));
    const unfinished = next >= 0 ? next : items.findIndex(item => !isDone(item));
    return { index: unfinished >= 0 ? unfinished : index ?? 0, resume: false };
  }

  function statusText(item) {
    if (isDone(item)) return 'Đã hoàn thành';
    if (state.reading?.id === id(item)) return 'Đang học';
    if (C || state.started[item.number]) return 'Chưa hoàn thành';
    return 'Chưa học';
  }

  function progressBar(count, total, label) {
    const meter = element('progress', 'study-meter');
    meter.max = total;
    meter.value = count;
    meter.setAttribute('aria-label', label);
    return meter;
  }

  function lessonRow(index) {
    const item = items[index];
    const row = lessonLink('', index, undefined, 'study-lesson-row');
    row.dataset.lessonId = id(item);
    row.classList.toggle('is-done', isDone(item));
    if (activeLesson === item) row.setAttribute('aria-current', 'page');
    row.innerHTML = '<span class="study-lesson-number" aria-hidden="true">' +
      (isDone(item) ? '✓' : String(index + 1).padStart(2, '0')) + '</span>' +
      '<span class="study-lesson-name"><strong>' + esc(lessonTitle(item)) + '</strong>' +
      '<small>Bài ' + (index + 1) + ' · <span data-lesson-status>' + statusText(item) + '</span></small></span>' +
      '<span class="study-arrow" aria-hidden="true">›</span>';
    return row;
  }

  function appendRows(container, start, end) {
    for (let index = start; index < end; index++) container.append(lessonRow(index));
  }

  function codeWeeks(track, resumeIndex) {
    const list = element('div', 'study-weeks');
    const currentWeek = items[resumeIndex].week;
    for (let start = track.start; start < track.end;) {
      const week = weeks[items[start].week - 1];
      const end = start + week.days.length;
      const count = items.slice(start, end).filter(isDone).length;
      const box = element('details', 'study-week');
      const summary = element('summary', '', '<span class="study-week-number">Tuần ' + week.number +
        '</span><strong>' + esc(week.title) + '</strong><small>' + count + '/' + (end - start) +
        ' bài</small><span class="study-arrow" aria-hidden="true">›</span>');
      box.open = week.number === currentWeek || (currentWeek < items[track.start].week ||
        currentWeek > items[track.end - 1].week) && start === track.start;
      box.append(summary);
      if (week.intro?.length) {
        const intro = disclosure('Giới thiệu tuần', 'study-week-intro');
        intro.append(element('div', '', renderBlocks(week.intro)));
        box.append(intro);
      }
      appendRows(box, start, end);
      list.append(box);
      start = end;
    }
    return list;
  }

  function catalog(resumeIndex) {
    const catalog = element('section', 'study-catalog',
      '<div class="study-catalog-heading"><div><p class="study-kicker">MỤC LỤC KHÓA HỌC</p>' +
      '<h2 id="study-catalog">Chọn bài học</h2></div><div class="study-search">' +
      '<label for="study-search">Tìm bài theo tên hoặc số bài</label>' +
      '<input id="study-search" type="search" autocomplete="off" placeholder="' +
      (C ? 'VD: SQL, Python, Bug Report' : 'VD: ngữ pháp, đặt tour, SEO') + '"></div></div>');
    catalog.setAttribute('aria-labelledby', 'study-catalog');
    const input = catalog.querySelector('input');
    const filters = element('div', 'study-tracks');
    const listing = element('div', 'study-listing');
    const message = element('p', 'study-results-count');
    message.setAttribute('role', 'status');
    const trackButtons = tracks.map((track, index) => {
      const tab = button('', () => {
        selectedTrack = index;
        input.value = '';
        renderList();
      }, 'study-track');
      const count = items.slice(track.start, track.end).filter(isDone).length;
      tab.innerHTML = '<span class="study-track-order" aria-hidden="true">' + String(index + 1).padStart(2, '0') +
        '</span><span><strong>' + esc(track.title) + '</strong><small>' +
        esc(track.range) + ' · ' + count + '/' + (track.end - track.start) + ' đã học</small></span>';
      filters.append(tab);
      return tab;
    });

    function renderList() {
      const query = normalize(input.value);
      const track = tracks[selectedTrack];
      trackButtons.forEach((tab, index) => tab.setAttribute('aria-pressed', String(!query && index === selectedTrack)));
      listing.replaceChildren();
      if (!query) {
        message.textContent = '';
        if (C) listing.append(codeWeeks(track, resumeIndex));
        else appendRows(listing, track.start, track.end);
        return;
      }

      const number = /^(?:bai\s+)?(\d+)$/.exec(query);
      const matches = [];
      items.forEach((item, index) => {
        const words = [item.title, id(item), tracks[trackIndex(index)].title];
        if (C) words.push('tuần ' + item.week, item.weekTitle);
        const title = normalize(words.join(' '));
        if (number ? index + 1 === Number(number[1]) : title.includes(query)) matches.push(index);
      });
      message.textContent = matches.length
        ? matches.length + ' bài phù hợp trong toàn khóa'
        : 'Không tìm thấy bài. Thử tên, từ khóa hoặc số bài khác.';
      matches.forEach(index => listing.append(lessonRow(index)));
    }

    input.addEventListener('input', renderList);
    catalog.append(filters, message, listing);
    renderList();
    return catalog;
  }

  function showHome() {
    const next = suggestion();
    const item = items[next.index];
    const count = items.filter(isDone).length;
    selectedTrack ??= trackIndex(next.index);
    const hero = element('section', 'study-hero',
      '<div class="study-hero-copy"><p class="study-kicker">' + (C ? 'LẬP TRÌNH · QA · FDE' : 'TIẾNG Ý CHO DU LỊCH') +
      '</p><h1>' + (C ? 'Học code theo lộ trình' : 'Học tiếng Ý qua tình huống') + '</h1><p>' +
      (C ? 'Xem kiến thức và ví dụ, sau đó thực hành với bài tập của từng chủ đề.'
        : 'Học từ và mẫu câu, nghe và luyện nói, rồi áp dụng vào bài tập của từng tình huống.') +
      '</p><div class="study-course-progress"><span>Tiến độ toàn khóa</span><strong>' +
      count + '/' + items.length + ' bài</strong></div></div>');
    hero.firstElementChild.append(progressBar(count, items.length, 'Tiến độ toàn khóa'));
    const resume = element('div', 'study-resume',
      '<p class="study-kicker">' + (next.resume ? 'BÀI ĐANG HỌC' : count === items.length ? 'ÔN LẠI' : 'BÀI GỢI Ý') +
      '</p><h2>' + esc(lessonTitle(item)) + '</h2>');
    const step = pagesFor(item).findIndex(indices => indices.includes(next.part));
    const position = next.resume && step >= 0 ? ' · ' + stages[step].label : '';
    resume.append(element('p', 'study-resume-meta', 'Bài ' + (next.index + 1) + position),
      lessonLink(next.resume ? 'Tiếp tục bài này →' : count === items.length ? 'Mở lại bài →' : 'Bắt đầu bài ' +
        (next.index + 1) + ' →', next.index, next.part, 'study-primary'));
    hero.append(resume);
    root.append(hero, catalog(next.index));
  }

  function lessonSidebar(item) {
    const track = tracks[selectedTrack];
    const week = C ? weeks[item.week - 1] : undefined;
    const caption = C ? 'Bài trong tuần ' + item.week : 'Bài trong chặng';
    const box = disclosure(caption, 'study-syllabus');
    const list = element('nav', 'study-syllabus-list');
    list.setAttribute('aria-label', caption);
    list.append(element('p', 'study-sidebar-title', esc(week?.title ?? track.title)));
    if (C) week.days.forEach(day => list.append(lessonRow(lessonIndex.get(day.id))));
    else appendRows(list, track.start, track.end);
    box.append(list);
    const showActive = () => {
      const row = list.querySelector('[aria-current="page"]');
      if (!box.open || !row) return;
      const overflow = row.getBoundingClientRect().bottom - list.getBoundingClientRect().bottom;
      if (overflow > 0) list.scrollTop += overflow;
    };
    box.addEventListener('toggle', showActive);
    const wide = window.matchMedia('(min-width: 1000px)');
    box.open = wide.matches;
    const updateWidth = () => { box.open = wide.matches; };
    wide.addEventListener('change', updateWidth);
    return { box, showActive, dispose: () => wide.removeEventListener('change', updateWidth) };
  }

  function practiceLab(item) {
    if (!C) return;
    const topic = item.title + ' ' + item.weekTitle;
    const labs = [
      [/\b(sql|postgres(?:ql)?|database|join|constraint|query)\b/i, 'lab.html#sql', 'Mở phòng thực hành SQL'],
      [/\b(python|pytest)\b/i, 'lab.html#python', 'Mở phòng thực hành Python'],
      [/\b(api|http|rest|postman|newman|fastapi|endpoint)\b/i, 'lab.html#api', 'Mở phòng API giả lập'],
      [/watchlist|stock dashboard|tourism platform|react|javascript|frontend/i, 'product-demo.html', 'Mở demo sản phẩm']
    ];
    const match = labs.find(([pattern, path]) => pattern.test(topic) &&
      (!item.studyFlow || path.startsWith('lab.html')));
    if (match) return link(match[2] + ' ↗', './' + match[1], 'study-lab-link secondary');
  }

  function listeningSample(value, markup) {
    const box = element('div', 'study-listening',
      '<p class="study-kicker">MẪU TIẾNG Ý</p><p>Nghe một lượt để nắm ý, sau đó mở lời thoại và đọc theo.</p>');
    const actions = element('div', 'study-actions');
    const status = element('small');
    status.setAttribute('role', 'status');
    const play = rate => {
      status.textContent = '';
      say(value.sampleText, rate, () => {
        status.textContent = 'Không phát được giọng đọc của thiết bị. Bạn có thể mở lời thoại hoặc dùng video của bài.';
      });
    };
    actions.append(button('Nghe mẫu', () => play(0.9), 'study-primary'),
      button('Nghe chậm', () => play(0.68)));
    const transcript = disclosure('Xem lời thoại và giải thích', 'study-disclosure');
    transcript.append(element('div', 'study-prose', markup));
    box.append(actions, status, element('small', 'study-voice-label', 'Giọng đọc của thiết bị'), transcript);
    return box;
  }

  function recorderPanel() {
    const box = element('div', 'study-recorder',
      '<h4>Ghi âm để nghe lại</h4><p>Tự nói một lượt, nghe lại và sửa một điểm trước khi nói lần hai.</p>' +
      '<p class="study-muted">Bản ghi có thể phát lại trong phiên này.</p>' +
      '<div class="study-actions"><span id="recstatus" role="status"></span></div>' +
      '<audio id="playback" controls aria-label="Nghe lại bản ghi"></audio>');
    const start = button('Bắt đầu ghi âm', record);
    start.id = 'recbtn';
    box.querySelector('.study-actions').prepend(start);
    return box;
  }

  function isAnswer(item, index, stage) {
    const value = item.sections[index];
    return C ? Boolean(item.studyFlow && stage === reviewStage) || /^Đáp án/i.test(cleanTitle(value))
      : [9, 10].includes(sectionNumber(value));
  }

  function lessonPart(item, index, stage, first) {
    const value = item.sections[index];
    const answer = isAnswer(item, index, stage);
    const optional = stage === practiceStage && !first;
    const part = answer || optional ? disclosure(sectionLabel(value), 'study-disclosure study-part') :
      element('section', 'study-part');
    part.id = 'muc-' + index;
    const body = element('div', 'study-prose');
    const markup = renderBlocks(value.blocks);
    if (!C && value.sampleText) body.append(listeningSample(value, markup));
    else body.innerHTML = markup;
    window.StudyAnswers.render(body, item, index);
    for (const table of body.querySelectorAll('.tablewrap')) {
      table.tabIndex = 0;
      table.setAttribute('aria-label', 'Bảng trong mục ' + sectionLabel(value));
    }

    if (answer || optional) part.append(body);
    else {
      const heading = element('h3', 'study-part-heading');
      heading.textContent = sectionLabel(value);
      part.append(heading, body);
    }
    const [goals, , examples] = order(item);
    if (goals.includes(index)) part.classList.add('study-objective');
    if (C && examples.includes(index)) part.classList.add('study-example');
    if (!C && [5, 11].includes(sectionNumber(value))) part.append(recorderPanel());
    if (C && stage < 0) {
      const url = value.blocks.map(block => block.text || '').join(' ')
        .match(/https:\/\/(?:docs\.python\.org|developer\.mozilla\.org|git-scm\.com|www\.postgresql\.org|fastapi\.tiangolo\.com|react\.dev|docs\.docker\.com|platform\.openai\.com|api-security\.owasp\.org)\/[^\s;]+/i)?.[0];
      if (url) {
        const reference = link('Mở tài liệu tham khảo ↗', url, 'secondary');
        reference.target = '_blank';
        reference.rel = 'noopener noreferrer';
        part.append(reference);
      }
    }
    return part;
  }

  function notesPanel(item, indices, target) {
    const box = disclosure('Ghi chú theo mục' + (C ? ' · Xem thử HTML' : ''), 'study-disclosure study-notes');
    const label = element('label', '', 'Mục đang ghi chú');
    const select = element('select');
    const field = element('textarea');
    field.id = 'study-note';
    field.placeholder = 'Ghi lại điều muốn nhớ ở mục này…';
    const fieldLabel = element('label', '', 'Ghi chú của bạn');
    fieldLabel.htmlFor = field.id;
    const status = element('small');
    status.setAttribute('role', 'status');
    for (const index of indices) {
      const option = element('option');
      option.value = index;
      option.textContent = sectionLabel(item.sections[index]);
      select.append(option);
    }
    label.append(select);
    const key = () => (C ? item.id + '-' : 'lesson-' + item.number + '-') + select.value;
    const load = () => {
      field.value = state.notes[key()] || '';
      status.textContent = '';
    };
    select.value = target;
    load();
    select.addEventListener('change', load);
    field.addEventListener('input', () => {
      state.notes[key()] = field.value;
      status.textContent = persist() ? 'Đã lưu trên thiết bị này.' : 'Không lưu được trên thiết bị này.';
    });
    box.append(label, fieldLabel, field, status);
    if (C) {
      const preview = element('iframe');
      preview.title = 'Kết quả HTML/CSS/JS';
      preview.setAttribute('sandbox', 'allow-scripts');
      preview.hidden = true;
      box.append(element('p', 'study-muted', 'Có thể chạy HTML, CSS và JavaScript tĩnh từ ô ghi chú.'),
        button('Xem thử HTML/CSS/JS', () => {
          if (!field.value.trim()) {
            status.textContent = 'Hãy nhập HTML trước khi xem thử.';
            field.focus();
            return;
          }
          preview.srcdoc = field.value;
          preview.hidden = false;
        }), preview);
    }
    return box;
  }

  function resources(item, primary, target) {
    const extras = item.sections.map((_, index) => index).filter(index => !primary.includes(index));
    if (!extras.length) return;
    const box = disclosure('Tài liệu và bài luyện thêm', 'study-disclosure study-resources');
    box.open = extras.includes(target);
    const groups = new Map();
    for (const index of extras) {
      const value = item.sections[index];
      let label = '';
      if (C && item.studyFlow) {
        if (/^Hướng dẫn từ số 0/.test(value.title)) label = 'IT nền tảng';
        else if (/^[BD]\. /.test(value.title)) label = 'Giáo trình và thực hành Banking';
        else label = 'QA tổng quát';
      }
      if (!groups.has(label)) groups.set(label, element('div', 'study-resource-list'));
      const resource = lessonLink(sectionLabel(value), current, index, 'study-resource-link');
      if (index === target) resource.setAttribute('aria-current', 'page');
      groups.get(label).append(resource);
    }
    for (const [label, list] of groups) {
      if (label) box.append(element('h3', 'study-resource-label', label));
      box.append(list);
    }
    return box;
  }

  function focusPart(index) {
    const part = document.getElementById('muc-' + index);
    if (!part) return;
    if (part.matches('details')) part.open = true;
    const heading = part.firstElementChild;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    part.scrollIntoView({ block: 'start' });
  }

  function partNav(item, indices, stage, target) {
    const box = element('nav', 'study-part-nav');
    box.setAttribute('aria-label', 'Mục lục phần đang học');
    const list = element('ul');
    for (const index of indices) {
      const jump = lessonLink(sectionLabel(item.sections[index]), current, index, 'study-part-link');
      if (target === index) jump.setAttribute('aria-current', 'location');
      jump.addEventListener('click', event => {
        if (!plainClick(event)) return;
        event.preventDefault();
        history.replaceState(null, '', jump.href);
        remember(item, index, stage);
        list.querySelector('[aria-current]')?.removeAttribute('aria-current');
        jump.setAttribute('aria-current', 'location');
        focusPart(index);
      });
      const entry = element('li');
      entry.append(jump);
      list.append(entry);
    }
    box.append(list);
    const compact = stage === practiceStage || indices.length > 4;
    if (!compact) {
      box.prepend(element('strong', '', 'Trong phần này'));
      return box;
    }
    const toc = disclosure(stage === practiceStage ? 'Các mục thực hành' : 'Trong phần này',
      'study-disclosure study-part-menu');
    toc.open = stage !== practiceStage && window.matchMedia('(min-width: 661px)').matches;
    toc.append(box);
    return toc;
  }

  function reviewTools(item, pages) {
    const box = element('section', 'study-finish');
    const heading = element('h3', '', 'Hoàn thành bài');
    const label = element('label', 'study-complete');
    const check = element('input');
    check.type = 'checkbox';
    check.checked = isDone(item);
    check.id = C ? 'done' : 'completed';
    label.append(check, document.createTextNode(' Tôi đã làm bài và đối chiếu kết quả'));
    const status = element('small');
    status.setAttribute('role', 'status');
    check.addEventListener('change', () => {
      state.done[doneKey(item)] = check.checked;
      status.textContent = persist() ? 'Đã cập nhật tiến độ.' : 'Không lưu được tiến độ trên thiết bị này.';
      const row = root.querySelector('.study-syllabus [aria-current="page"]');
      if (row) row.replaceWith(lessonRow(current));
      root.querySelector('.study-lesson-status').textContent = statusText(item);
    });
    box.append(heading, label, status);
    if (C) {
      const levelLabel = element('label', '', 'Mức độ thành thạo tự đánh giá');
      const level = element('select', '', '<option value="">Chưa đánh giá</option>' +
        ['Learned', 'Practiced', 'Built', 'Tested', 'Debugged', 'Explained'].map(value =>
          '<option>' + value + '</option>').join(''));
      level.value = state.levels[item.id] || '';
      level.addEventListener('change', () => {
        state.levels[item.id] = level.value;
        status.textContent = persist() ? 'Đã lưu mức độ thành thạo.' : 'Không lưu được trên thiết bị này.';
      });
      levelLabel.append(level);
      box.append(levelLabel);
    }
    const checkList = disclosure('Tiêu chí tự kiểm tra và quiz theo nhóm', 'study-disclosure');
    const hints = C ? ['Đầu vào và kết quả mong đợi có rõ ràng?', 'Đã xét trường hợp hợp lệ, lỗi và dữ liệu biên?',
      'Có kết quả chạy thử hoặc bằng chứng phù hợp?'] :
      ['Kiểm tra chia động từ, mạo từ, giống và số.', 'Câu có tự nhiên và hợp tình huống du lịch?',
        'Có thông tin lịch sử, giá hoặc thời gian cần xác minh?'];
    const list = element('ul', '', hints.map(hint => '<li>' + hint + '</li>').join(''));
    checkList.append(list, link('Mở quiz kiến thức nền', '#quiz/' + id(item), 'secondary'));
    box.prepend(checkList);
    const actions = element('div', 'study-actions');
    actions.append(lessonLink('← Quay lại bài tập', current, pages[practiceStage][0]));
    if (current + 1 < items.length) {
      actions.append(lessonLink('Mở bài ' + (current + 2) + ' →', current + 1, undefined, 'study-primary'));
      box.append(element('p', 'study-next-name', '<strong>Bài tiếp theo</strong> · ' + esc(lessonTitle(items[current + 1]))));
    } else {
      actions.append(link('Về lộ trình', '#lo-trinh', 'study-primary'));
    }
    box.append(actions);
    return box;
  }

  function renderLesson(item, target, focus) {
    activeLesson = item;
    selectedTrack = trackIndex(current);
    const pages = pagesFor(item);
    const stage = pages.findIndex(indices => indices.includes(target));
    const indices = pages[stage] ?? [target];
    remember(item, target, stage);
    const workspace = element('div', 'study-workspace');
    const trail = element('div', 'study-breadcrumb');
    trail.append(link('← Lộ trình', '#lo-trinh', 'study-text-link'),
      element('span', '', esc(C ? 'Tuần ' + item.week + ' · ' + tracks[selectedTrack].title : tracks[selectedTrack].title)));
    const pane = element('div', 'study-lesson-pane');
    const title = element('div', 'study-lesson-title',
      '<div class="study-lesson-meta"><span>BÀI ' + (current + 1) + ' / ' + items.length +
      '</span><span class="study-lesson-status">' + statusText(item) + '</span></div>' +
      '<h1 tabindex="-1">' + esc(lessonTitle(item)) + '</h1>');
    const stageNav = element('nav', 'study-stages');
    stageNav.setAttribute('aria-label', 'Các bước trong bài');
    for (const [index, step] of stages.entries()) {
      const tab = lessonLink('', current, pages[index][0], 'study-step');
      tab.innerHTML = '<span aria-hidden="true">' + (index + 1) + '</span><strong>' + step.label + '</strong>';
      if (stage === index) tab.setAttribute('aria-current', 'step');
      stageNav.append(tab);
    }

    const article = element('article', 'study-article',
      '<h2 tabindex="-1">' + (stages[stage]?.title ?? 'Tài liệu bổ sung') + '</h2>');
    if (stage === practiceStage) {
      article.append(element('p', 'study-stage-help',
        'Bản nháp tự lưu khi bạn gõ. Bạn có thể quay lại xem bài và tiếp tục làm.'));
    }
    if (stage === reviewStage) {
      article.append(element('p', 'study-stage-help', 'So lại lời giải và đánh dấu hoàn thành khi đã làm xong.'));
    }
    if (indices.length > 1) article.append(partNav(item, indices, stage, target));
    if (stage === practiceStage) {
      const lab = practiceLab(item);
      if (lab) article.append(lab);
    }
    indices.forEach((index, position) => article.append(lessonPart(item, index, stage, position === 0)));
    if (C && stage === 0) {
      const lab = practiceLab(item);
      if (lab) article.append(lab);
    }
    article.append(notesPanel(item, indices, target));

    if (stage === reviewStage) {
      article.append(reviewTools(item, pages));
    } else {
      const footer = element('div', 'study-lesson-footer');
      if (stage < 0) {
        const previous = state.reading?.id === id(item) ? state.reading.section : pages[0][0];
        footer.append(lessonLink('← Về nội dung bài', current, previous));
      } else {
        if (stage > 0) footer.append(lessonLink('← ' + stages[stage - 1].label, current, pages[stage - 1][0]));
        footer.append(lessonLink(stages[stage + 1].label + ' →', current, pages[stage + 1][0], 'study-primary'));
      }
      article.append(footer);
    }
    const extra = resources(item, pages.flat(), target);
    const sidebar = lessonSidebar(item);
    pane.append(title, stageNav, article);
    if (extra) pane.append(extra);
    workspace.append(sidebar.box, pane);
    root.append(trail, workspace);
    sidebar.showActive();
    if (target !== indices[0]) focusPart(target);
    else if (focus) title.querySelector('h1').focus({ preventScroll: true });
    return sidebar.dispose;
  }

  function plainClick(event) {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }

  function navigate(hash) {
    if (location.hash !== hash) history.pushState(null, '', hash);
    showRoute(true);
  }

  function buildHeader() {
    const header = document.querySelector('.site-header');
    const bar = element('div', 'study-header-inner');
    const brand = link('', '#lo-trinh', 'study-brand');
    brand.innerHTML = '<span class="study-brand-mark" aria-hidden="true">' + (C ? '&lt;/&gt;' : 'IT') +
      '</span><strong>' + (C ? 'Code Master Academy' : 'Italiano Master') + '</strong>';
    nav = element('nav', 'study-nav');
    nav.setAttribute('aria-label', 'Điều hướng chính');
    nav.append(link('Lộ trình', '#lo-trinh', 'study-nav-link'), link('Ôn tập', '#on-tap', 'study-nav-link'),
      link('Tiến độ', '#tien-do', 'study-nav-link'));
    toolsMenu = disclosure('Công cụ', 'study-menu');
    const menu = element('div', 'study-menu-links');
    const options = C ? [
      ['Phòng thực hành', './lab.html'], ['Bài tập 2 dự án', './projects.html'],
      ['Demo 2 sản phẩm', './product-demo.html'], ['Tài liệu FDE', './fde.html']
    ] : [['Lịch ôn D1–D30', '#lich-on'], ['Sổ lỗi tiếng Ý', '#so-loi']];
    options.push(['Kế hoạch và phương pháp', '#ke-hoach'], ['Sổ tay', '#so-tay'],
      ['Kiểm tra cấp độ', '#cap-do'], ['Điểm đến Việt Nam', '#diem-den'],
      ['Dự án tốt nghiệp', '#tot-nghiep'], ['Sao lưu', '#sao-luu']);
    for (const [label, href] of options) menu.append(link(label, href, 'study-menu-link'));
    toolsMenu.append(menu);
    bar.append(brand, nav, toolsMenu);
    header.append(bar);
    document.addEventListener('click', event => {
      if (!toolsMenu.contains(event.target)) toolsMenu.open = false;
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor || event.defaultPrevented || !plainClick(event)) return;
      const hash = anchor.getAttribute('href');
      if (!isRoute(hash)) return;
      event.preventDefault();
      navigate(hash);
    });
    toolsMenu.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !toolsMenu.open) return;
      toolsMenu.open = false;
      toolsMenu.querySelector('summary').focus();
    });
  }

  const routes = {
    '#lo-trinh': showHome,
    '#on-tap': window.LearningPlus.srsView,
    '#tien-do': progressView,
    '#so-tay': notes,
    '#ke-hoach': C ? overview : plan,
    '#cap-do': window.LearningPlus.readiness,
    '#diem-den': window.LearningPlus.trips,
    '#tot-nghiep': window.LearningPlus.capstones,
    '#sao-luu': window.LearningPlus.backup
  };
  if (!C) Object.assign(routes, { '#lich-on': reviews, '#so-loi': errors });

  const lessonRoute = /^#bai\/([A-Z0-9]+)(?:\/(\d+))?$/;
  const quizRoute = /^#quiz\/([A-Z0-9]+)$/;
  const isRoute = hash => Object.hasOwn(routes, hash) || lessonRoute.test(hash) || quizRoute.test(hash);
  let disposeLesson;

  function showRoute(focus) {
    const hash = location.hash;
    const [, lesson, target] = lessonRoute.exec(hash) || [];
    const quiz = quizRoute.exec(hash)?.[1];
    const index = lessonIndex.get(lesson);
    disposeLesson?.();
    disposeLesson = undefined;
    if (!C) {
      if (recorder?.state === 'recording') recorder.stop();
      const audio = root.querySelector('#playback')?.getAttribute('src');
      if (audio) URL.revokeObjectURL(audio);
      if (activeLesson) window.speechSynthesis?.cancel();
    }
    activeLesson = undefined;
    toolsMenu.open = false;
    const navHash = index !== undefined || !isRoute(hash) ? '#lo-trinh' :
      hash === '#lich-on' ? '#on-tap' : hash;
    nav.querySelectorAll('a').forEach(anchor => {
      if (anchor.getAttribute('href') === navHash) anchor.setAttribute('aria-current', 'page');
      else anchor.removeAttribute('aria-current');
    });

    root.replaceChildren();
    root.classList.toggle('study-reader', index !== undefined);
    window.scrollTo(0, 0);
    if (index !== undefined) {
      current = index;
      const item = items[index];
      const part = Number(target);
      disposeLesson = renderLesson(item, item.sections[part] ? part : pagesFor(item).flat()[0], focus);
    } else if (lessonIndex.has(quiz)) {
      window.LearningPlus.quizView(items[lessonIndex.get(quiz)]);
    } else {
      (routes[hash] ?? showHome)();
    }
    if (focus && index === undefined) {
      const heading = root.querySelector('h1, h2');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
  }

  window.GuidedStudy = { hasExercises };
  window.home = () => navigate('#lo-trinh');
  if (C) window.openDay = (lessonId, part) => {
    const index = lessonIndex.get(lessonId);
    if (index !== undefined) navigate(lessonHash(index, part));
  };
  else window.openLesson = (index, part) => {
    if (items[index]) navigate(lessonHash(index, part));
  };

  buildHeader();
  window.addEventListener('hashchange', () => showRoute(true));
  showRoute(false);
})();
