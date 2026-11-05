/* Guided lesson navigation. Section indices also identify saved answers. */
(function () {
  'use strict';

  const C = typeof all !== 'undefined' && Array.isArray(all);
  const items = C ? all : lessons;
  const labels = ['Bắt đầu', 'Kiến thức', C ? 'Xem ví dụ' : 'Xem và nghe', 'Làm bài', 'Đối chiếu'];
  const italianStages = [0, 1, 1, 1, 2, 3, 3, 3, 3, 4, 4, 3, 4, 4];
  const italianLabels = [
    'Mục tiêu', 'Ngữ pháp', 'Từ vựng', 'Phát âm', 'Nghe và nhắc lại',
    'Luyện nói', 'Đọc hiểu và viết', 'Nhập vai', 'Bài tập', 'Đáp án',
    'Hội thoại mẫu', 'Bài về nhà', 'Lịch ôn', 'Sổ lỗi'
  ];
  const id = item => C ? item.id : 'I' + item.number;
  const sectionNumber = value => Number(/^([0-9]+)\.\s/.exec(value.title)?.[1]) - 1;
  const cleanTitle = value => value.title.replace(/^\d+\.\s*|^[A-E]\.\s*/g, '');
  const sectionLabel = value => value.guideLabel ||
    (!C && italianLabels[sectionNumber(value)]) || cleanTitle(value);
  const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);

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
    const groups = labels.map(() => []);
    item.sections.forEach((value, index) => groups[stageOf(value)]?.push(index));
    if (!C) {
      const prioritize = (stage, first) => {
        const index = groups[stage].findIndex(i => first(item.sections[i]));
        if (index > 0) groups[stage].unshift(...groups[stage].splice(index, 1));
      };
      prioritize(2, value => Boolean(value.sampleText));
      prioritize(3, value => sectionNumber(value) === 8);
    }
    return groups;
  }

  function hasExercises(item, index) {
    const value = item.sections[index];
    if (value.practice || order(item)[3].includes(index)) return true;
    const title = cleanTitle(value);
    if (!C) return /^1[56]\. /.test(value.title);
    return /^(Thực hành hai ứng dụng|Mẫu và bài tập nâng cao|Hướng dẫn từ số 0|Lab mở rộng)/i.test(title);
  }

  function open(index, target) {
    const item = items[index];
    if (!item) return;
    if (C) openDay(item.id, target);
    else openLesson(index, target);
  }

  function resume() {
    const reading = state.reading;
    const index = items.findIndex(item => id(item) === reading?.id);
    if (index < 0) {
      const first = items.findIndex(item => !state.done?.[C ? item.id : item.number]);
      open(Math.max(first, 0));
      return;
    }
    const primary = order(items[index]).flat();
    open(index, primary.includes(reading.section) ? reading.section : primary[0]);
  }

  function jump(index) {
    if (index === section) return;
    section = index;
    if (C) renderDay();
    else renderLesson();
  }

  function button(text, action, className = '') {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = className;
    element.textContent = text;
    element.addEventListener('click', action);
    return element;
  }

function showLanding(){
 document.body.classList.remove('guided-lesson','reading-mode');
 const pulse=root.querySelector('.lp-home-pulse');
 root.querySelectorAll('.resume-banner').forEach(b=>b.remove());
 root.querySelector(':scope > h2')?.remove();
 if(pulse)pulse.remove();
 const intro=document.createElement('section');intro.className='guide-intro';intro.innerHTML='<span class="guide-eyebrow">HỌC THEO TỪNG BƯỚC</span><h2>Học gì hôm nay?</h2><p>Xem kiến thức và ví dụ, sau đó làm từng câu rồi đối chiếu.</p>';
 const actions=document.createElement('div');actions.className='guide-row';
 const btn=(t,fn)=>{const b=document.createElement('button');b.textContent=t;b.addEventListener('click',fn);actions.append(b)};
 if(state.reading) btn('Tiếp tục bài đang học',resume);
 else btn('Bắt đầu bài 1',()=>open(0));
 intro.append(actions);
 root.prepend(intro);
 if(pulse){
   const stats=document.createElement('details');stats.className='guide-overview';
   stats.innerHTML='<summary>📊 Xem tiến độ, thẻ ôn và dự án</summary>';
   stats.append(pulse);intro.insertAdjacentElement('afterend',stats);
 }
 const allGrid=root.querySelector(':scope > .grid');
 if(allGrid){
  const nodes=[...allGrid.children];
  const groups=C?[
   ['01 · QA cho người trái ngành',0,6],
   ['02 · Lập trình & hai dự án',6,46],
   ['03 · FDE & bàn giao',46,50]
  ]:[
   ['01 · Giao tiếp, ngữ pháp nền',0,14],
   ['02 · Hướng dẫn và giới thiệu tour',14,28],
   ['03 · SEO, email, bán tour',28,38],
   ['04 · Thuyết minh và portfolio',38,58]
  ];
  const container=document.createElement('div');container.className='guide-groups';
  groups.forEach(([name,start,end],idx)=>{
   const details=document.createElement('details');details.className='guide-group';details.open=idx===0;
   const done=C?nodes.slice(start,end).reduce((a,x)=>a+Number(x.querySelector('progress')?.value||0),0):items.slice(start,end).filter(x=>state.done?.[x.number]).length;
   const summary=document.createElement('summary');summary.innerHTML='<strong>'+esc(name)+'</strong><span>'+done+'/'+(C?(end-start)*5:end-start)+' bài hoàn thành</span>';details.append(summary);
   const grid=document.createElement('div');grid.className='guide-grid';
   nodes.slice(start,end).forEach(x=>grid.append(x));details.append(grid);container.append(details);
  });
  allGrid.replaceWith(container);
  const search=document.createElement('div');search.className='guide-search';
  const label=document.createElement('label');label.textContent='Tìm nhanh bài học';
  const input=document.createElement('input');input.type='search';input.placeholder=C?'Nhập SQL, QA, FastAPI, React…':'Nhập ngữ pháp, Huế, đặt tour, SEO…';input.setAttribute('aria-label','Tìm bài học');
  const results=document.createElement('div');results.className='guide-results';
  input.addEventListener('input',()=>{
   const v=input.value.toLocaleLowerCase('vi').trim();results.innerHTML='';
   if(!v)return;
   const matches=items.map((x,i)=>({x,i})).filter(({x,i})=>/^\d+$/.test(v)
     ? i+1===Number(v)
     : (x.title+' '+id(x)+' bài '+(i+1)).toLocaleLowerCase('vi').includes(v)).slice(0,20);
   matches.forEach(({x,i})=>{const b=document.createElement('button');b.className='guide-result';b.textContent=(i+1)+'. '+x.title;b.addEventListener('click',()=>open(i));results.append(b)});
   if(!matches.length)results.textContent='Không thấy tên bài phù hợp. Thử từ khóa khác.';
  });
  search.append(label,input,results);
  intro.insertAdjacentElement('afterend',search);
 }
}

  function resources(item, primary, card) {
    const extras = item.sections.map((_, index) => index).filter(index => !primary.includes(index));
    if (!extras.length) return;
    const details = document.createElement('details');
    details.className = 'guide-resources';
    details.open = extras.includes(section);
    const summary = document.createElement('summary');
    summary.textContent = 'Tài liệu và bài luyện thêm';
    details.append(summary);

    const groups = new Map();
    for (const index of extras) {
      const value = item.sections[index];
      let label = 'Bổ sung';
      if (C && item.studyFlow) {
        if (/^Hướng dẫn từ số 0/.test(value.title)) label = 'IT nền tảng';
        else if (/^[BD]\. /.test(value.title)) label = 'Giáo trình và thực hành Banking';
        else label = 'QA tổng quát · ' + item.sections[0].blocks[0].text;
      }
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(index);
    }
    for (const [label, indices] of groups) {
      const list = document.createElement('div');
      list.className = 'guide-row';
      if (groups.size > 1) {
        const name = document.createElement('p');
        name.className = 'guide-resource-label';
        name.textContent = label;
        details.append(name);
      }
      for (const index of indices) {
        const link = button(sectionLabel(item.sections[index]), () => jump(index), 'secondary');
        if (section === index) link.setAttribute('aria-current', 'true');
        list.append(link);
      }
      details.append(list);
    }
    card.insertAdjacentElement('afterend', details);
  }

  function addFooter(item, groups, stage) {
    const footer = document.createElement('div');
    footer.className = 'guide-footer';
    if (stage < 0) {
      const previous = state.reading?.id === id(item) ? state.reading.section : undefined;
      const primary = groups.flat();
      footer.append(button('← Về bài học', () => jump(primary.includes(previous) ? previous : primary[0]), 'secondary'));
    } else {
      const primary = groups.flat();
      const position = primary.indexOf(section);
      const previous = button('← Mục trước', () => jump(primary[position - 1]), 'secondary');
      previous.disabled = position === 0;
      const count = document.createElement('span');
      count.className = 'guide-count';
      count.textContent = 'Bước ' + (stage + 1) + ' / ' + labels.length;
      const upcoming = primary[position + 1];
      const upcomingStage = groups.findIndex(group => group.includes(upcoming));
      const nextLabel = upcoming === undefined ? 'Cuối bài' :
        upcomingStage === stage ? 'Mục tiếp →' : labels[upcomingStage] + ' →';
      const next = button(nextLabel, () => jump(upcoming));
      next.disabled = upcoming === undefined;
      footer.append(previous, count, next);
      if (next.disabled && current + 1 < items.length) {
        const panel = document.createElement('section');
        panel.className = 'guide-end-lesson';
        const index = current + 1;
        panel.append(button('Bài tiếp theo · ' + items[index].title, () => open(index)));
        root.append(panel);
      }
    }
    document.body.append(footer);
  }

  function addPracticeLab(item, card) {
    if (!C) return;
    const topic = item.title + ' ' + item.weekTitle;
    let target;
    if (/\b(sql|postgres|database|join|constraint|query)\b/i.test(topic)) {
      target = ['lab.html#sql', 'Thử trong phòng SQL'];
    } else if (/\b(python|pytest)\b/i.test(topic)) {
      target = ['lab.html#python', 'Thử trong phòng Python'];
    } else if (/\b(api|http|rest|postman|newman|fastapi|endpoint)\b/i.test(topic)) {
      target = ['lab.html#api', 'Thử API giả lập'];
    } else if (!item.studyFlow && /watchlist|stock dashboard|tourism platform|react|javascript|frontend/i.test(topic)) {
      target = ['product-demo.html', 'Mở demo sản phẩm'];
    }
    if (!target) return;
    const link = document.createElement('a');
    link.href = './' + target[0];
    link.textContent = target[1];
    link.className = 'guide-lab-link';
    card.append(link);
  }

  function lessonView() {
    const item = items[current];
    const value = item?.sections[section];
    const legacyNav = root.querySelector('.card > .navdays, .card > .lesson-nav');
    if (!value || !legacyNav) return;
    const card = legacyNav.parentElement;
    const groups = order(item);
    const stage = groups.findIndex(group => group.includes(section));
    document.body.classList.add('guided-lesson', 'reading-mode');

    const hero = document.createElement('section');
    hero.className = 'guide-lesson-hero';
    hero.innerHTML = '<div class="guide-lesson-meta"><span class="guide-eyebrow">Bài ' +
      (current + 1) + ' / ' + items.length + '</span></div><h2>' + e(item.title) + '</h2>';
    hero.firstElementChild.append(button(C ? 'Về tuần ' + item.week : 'Danh sách bài', () => {
      if (C) weekView(item.week);
      else home();
    }, 'guide-back'));

    const steps = document.createElement('nav');
    steps.className = 'guide-steps';
    steps.setAttribute('aria-label', 'Các bước trong bài');
    labels.forEach((label, index) => {
      const step = button('', () => jump(groups[index][0]), 'guide-step');
      step.innerHTML = '<span>' + (index + 1) + '</span><strong>' + e(label) + '</strong>';
      step.disabled = !groups[index].length;
      if (index === stage) step.setAttribute('aria-current', 'step');
      steps.append(step);
    });
    hero.append(steps);

    if (stage >= 0) {
      state.reading = { id: id(item), index: current, section };
      save();
      if (groups[stage].length > 1) {
        const nav = document.createElement('nav');
        nav.className = 'guide-section-nav';
        nav.setAttribute('aria-label', 'Các mục trong bước ' + labels[stage]);
        for (const index of groups[stage]) {
          const link = button(sectionLabel(item.sections[index]), () => jump(index), 'secondary');
          if (section === index) link.setAttribute('aria-current', 'true');
          nav.append(link);
        }
        hero.append(nav);
      }
    }

    if (root.firstElementChild?.matches('.row, .controls')) root.firstElementChild.remove();
    root.prepend(hero);
    legacyNav.remove();
    card.querySelector('.lp-inline-actions')?.remove();
    const sectionHeading = C ? card.querySelector(':scope > h3') : card.querySelectorAll(':scope > h2')[1];
    card.querySelector(':scope > h2')?.remove();
    card.querySelectorAll(':scope > .eyebrow').forEach(element => element.remove());
    const heading = document.createElement('h3');
    heading.className = 'guide-section-heading';
    heading.tabIndex = -1;
    heading.textContent = sectionLabel(value);
    sectionHeading?.remove();
    if (stage < 0) {
      const badge = document.createElement('p');
      badge.className = 'guide-eyebrow';
      badge.textContent = 'Tài liệu bổ sung';
      card.prepend(badge);
      badge.after(heading);
    } else {
      card.prepend(heading);
    }

    if (value.sampleText && 'speechSynthesis' in window) {
      card.append(button('Nghe câu mẫu', () => say(value.sampleText), 'secondary guide-listen'));
    }
    if (stage === 3) addPracticeLab(item, card);
    if (stage === 4 && section === groups[4].at(-1)) {
      const tools = document.createElement('details');
      tools.className = 'guide-resources';
      tools.innerHTML = '<summary>Ôn thêm theo nhóm chủ đề</summary>';
      tools.append(button('Mở quiz kiến thức nền', () => window.LearningPlus?.quizView?.(item), 'secondary'));
      card.append(tools);
    }
    if (stage < 0) {
      const text = value.blocks.map(block => block.text || '').join(' ');
      const url = text.match(/https:\/\/(?:docs\.python\.org|developer\.mozilla\.org|git-scm\.com|www\.postgresql\.org|fastapi\.tiangolo\.com|react\.dev|docs\.docker\.com|platform\.openai\.com|api-security\.owasp\.org)\/[^\s;]+/i)?.[0];
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Mở tài liệu tham khảo';
        link.className = 'guide-lab-link';
        card.append(link);
      }
    }

    const complete = root.querySelector('#done, #completed')?.closest('.card');
    if (complete) {
      complete.hidden = stage !== 4;
      if (C) complete.querySelector('.row')?.remove();
    }
    resources(item, groups.flat(), card);
    addFooter(item, groups, stage);
    heading.focus({ preventScroll: true });
    hero.scrollIntoView({ block: 'start' });
  }

  function cleanLesson() {
    document.querySelector('body > .guide-footer')?.remove();
    document.body.classList.remove('guided-lesson', 'reading-mode');
    if (!C) {
      if (recorder?.state === 'recording') recorder.stop();
      const recording = root.querySelector('#playback')?.getAttribute('src');
      if (recording) URL.revokeObjectURL(recording);
    }
  }

  function topNav() {
    const nav = document.querySelector('header nav');
    if (!nav || nav.querySelector('.guide-mainnav')) return;
    const extras = document.createElement('details');
    extras.className = 'guide-extras';
    extras.innerHTML = '<summary>Thêm công cụ</summary>';
    const contents = document.createElement('div');
    contents.className = 'guide-extra-content';
    contents.addEventListener('click', event => {
      if (!event.target.closest('button, a')) return;
      extras.open = false;
      cleanLesson();
    }, true);
    while (nav.firstChild) contents.append(nav.firstChild);
    extras.append(contents);
    const basic = document.createElement('div');
    basic.className = 'guide-mainnav';
    basic.append(
      button('Khóa học', () => home()),
      button('Học tiếp', resume),
      button('Làm bài', () => {
        const index = items.findIndex(item => id(item) === state.reading?.id);
        const target = Math.max(index, 0);
        open(target, order(items[target])[3][0]);
      }),
      button('Ôn tập', () => { cleanLesson(); window.LearningPlus?.srsView?.(); })
    );
    nav.append(basic, extras);
  }

  function firstSection(item, target) {
    if (Number.isInteger(target) && item.sections[target]) return target;
    return order(item).flat()[0] ?? 0;
  }

  const originalHome = home;
  home = function () { cleanLesson(); originalHome(); showLanding(); };
  const originalNotes = notes;
  notes = function () { cleanLesson(); return originalNotes(); };
  const originalProgress = progressView;
  progressView = function () { cleanLesson(); return originalProgress(); };

  if (C) {
    const originalWeek = weekView;
    weekView = function (index) { cleanLesson(); return originalWeek(index); };
    const originalOverview = overview;
    overview = function () { cleanLesson(); return originalOverview(); };
    const originalOpen = openDay;
    openDay = function (lessonId, target) {
      const item = items.find(item => item.id === lessonId);
      if (item) return originalOpen(lessonId, firstSection(item, target));
    };
    const originalRender = renderDay;
    renderDay = function () { cleanLesson(); originalRender(); lessonView(); };
  } else {
    const originalPlan = plan;
    plan = function () { cleanLesson(); return originalPlan(); };
    const originalReviews = reviews;
    reviews = function () { cleanLesson(); return originalReviews(); };
    const originalErrors = errors;
    errors = function () { cleanLesson(); return originalErrors(); };
    const originalOpen = openLesson;
    openLesson = function (index, target) {
      if (items[index]) return originalOpen(index, firstSection(items[index], target));
    };
    const originalRender = renderLesson;
    renderLesson = function () { cleanLesson(); originalRender(); lessonView(); };
  }

  window.GuidedStudy = { order, hasExercises };
  topNav();
  home();
})();
