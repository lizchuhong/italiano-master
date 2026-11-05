/* Progressive UX: inline question answers, persistent drafts, mobile navigation. */
(function(){
  'use strict';
  const codeApp=typeof all!=='undefined'&&typeof renderDay==='function';
  const getItems=()=>codeApp?all:lessons;
  const getItem=()=>getItems()[current];
  const getSections=()=>getItem().sections||[];
  const getId=()=>codeApp?getItem().id:'I'+getItem().number;
  const getTitle=()=>getItem().title;
  const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const go=(i)=>{if(codeApp)openDay(getItems()[i].id);else openLesson(i)};
  const goSection=(i)=>{section=i;if(codeApp)renderDay();else renderLesson()};
  function store(key,value,status){
    state.answers||={};
    const prev=state.answers[key]||{};
    state.answers[key]={text:value,status:status||prev.status||'draft',updated:new Date().toISOString()};
    save();
  }
  function buildAnswer(key,index,prompt){
    const p=document.createElement('div');p.className='inline-answer';
    const old=state.answers?.[key];const id='ans-'+key.replace(/[^a-zA-Z0-9]/g,'-');
    p.innerHTML='<label for="'+id+'">✍️ Trả lời câu '+index+' <span class="answer-status"></span></label>'+
       '<textarea id="'+id+'" rows="3" placeholder="Viết đáp án ngay tại câu này; nội dung tự lưu trên thiết bị." aria-label="Trả lời câu '+index+'"></textarea>'+
       '<div class="answer-actions"><button type="button" class="secondary submit-answer">Nộp câu (lưu trên máy)</button><small class="save-status" aria-live="polite"></small></div>';
    const textarea=p.querySelector('textarea'),statusEl=p.querySelector('.answer-status'),hint=p.querySelector('.save-status');
    textarea.value=old?.text||'';
    const setLabel=()=>{const a=state.answers?.[key];statusEl.textContent=a?.status==='submitted'?'✓ Đã nộp':'• Bản nháp';};
    setLabel();
    textarea.addEventListener('input',()=>{store(key,textarea.value,'draft');hint.textContent='Đã tự lưu';setLabel()});
    p.querySelector('button').addEventListener('click',()=>{
      if(!textarea.value.trim()){hint.textContent='Hãy viết câu trả lời trước khi nộp.';textarea.focus();return}
      store(key,textarea.value,'submitted');setLabel();hint.textContent='Đã nộp và lưu cục bộ. Chưa có chấm điểm tự động.';
    });
    return p;
  }
  function addQuestions(card,item,sec){
    if(/^Học trước khi làm|^Mục tiêu và chuẩn bị FDE/i.test(sec.title))return; // Chương đọc trước, không tự thêm ô nộp vào lý thuyết.
    const blocks=sec.blocks||[];
    const isExercise=/(bài tập|thực hành|homework|esercizi|exercises?|exercise|lab|speaking|role.play|writing|reading|question|luyện|kiểm tra|test|portfolio|pratica|produzione|output|debugging)/i.test(sec.title);
    let total=0;
    const bulletTypes=new Set(['number','List Number','bullet','List Bullet']);
    const bulletEntries=blocks.map((b,i)=>({b,i})).filter(({b})=>bulletTypes.has(b.type));
    const bulletNodes=[...card.querySelectorAll(':scope > .number, :scope > .bullet')];
    bulletEntries.forEach(({b,i},k)=>{
      if(total>=24||!bulletNodes[k])return;
      if(!isExercise&&!/(\?|hãy|viết|tạo|lập|thử|giải|mô tả|so sánh|nêu|dịch|scrivi|completa|rispondi|crea|calcola|câu \d|interview)/i.test(b.text||''))return;
      if(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(b.text||''))return;
      const key='q:'+getId()+':s'+section+':b'+i;
      bulletNodes[k].insertAdjacentElement('afterend',buildAnswer(key,++total,b.text));
    });
    // Some original coursebook questions are compressed into one text block:
    // "1) ... 2) ... 3) ...". Split them into separately saved answers.
    if(isExercise){
      const textEntries=blocks.map((b,i)=>({b,i})).filter(({b})=>['text','Normal','Paragraph'].includes(b.type));
      const textNodes=[...card.querySelectorAll(':scope > .block')];
      textEntries.forEach(({b,i},k)=>{
        if(total>=35||!textNodes[k])return;
        const source=String(b.text||'').trim();
        if(!source||source.length>1400)return;
        const matches=[...source.matchAll(/(?:^|\s)(\d{1,2})\)\s*/g)];
        const prompts=[];
        if(matches.length>=2){
          for(let j=0;j<matches.length;j++){
            const a=matches[j].index+matches[j][0].length;
            const z=j+1<matches.length?matches[j+1].index:source.length;
            const q=source.slice(a,z).trim();
            if(q)prompts.push({code:'p'+j,prompt:q});
          }
        }else if(!matches.length&&source.length<=420&&!/^(ví dụ|example|gợi ý|solution|đáp án)/i.test(source)){
          prompts.push({code:'p0',prompt:source});
        }
        if(!prompts.length)return;
        const group=document.createElement('div');group.className='practice-panel';
        group.innerHTML='<strong>Làm lần lượt từng câu trong đoạn trên</strong>';
        prompts.slice(0,15).forEach(({code,prompt})=>{
          if(total>=35)return;
          const iQuestion=++total;
          const t=document.createElement('div');t.className='question-prompt';
          t.textContent=iQuestion+'. '+prompt;
          group.append(t);
          group.append(buildAnswer('q:'+getId()+':s'+section+':b'+i+':'+code,iQuestion,prompt));
        });
        textNodes[k].insertAdjacentElement('afterend',group);
      });
    }
    // Preserve access to answers from the earlier generic three-question interface.
    if(total>0){
      const prefix='extra:'+getId()+':s'+section+':';
      const oldKeys=Object.keys(state.answers||{}).filter(k=>k.startsWith(prefix)&&state.answers[k]?.text);
      if(oldKeys.length){
        const archive=document.createElement('details');
        archive.className='optional-notes';
        archive.innerHTML='<summary>🗂 Bài làm cũ đã lưu trước khi chia câu hỏi</summary><p class="muted">Giữ nguyên câu trả lời cũ để bạn xem và sao chép; các ô mới có mã lưu riêng.</p>';
        oldKeys.sort().forEach((key,i)=>{
          archive.append(buildAnswer(key,i+1,'Bài làm cũ '+(i+1)));
        });
        card.append(archive);
      }
    }
    if(!total&&isExercise){
      const prompts=codeApp?[
        'Giải thích khái niệm chính của '+item.title+' và đưa một ví dụ đầu vào/đầu ra.',
        'Thực hiện một ví dụ thực tế trong AI Tourism hoặc AI Stock với dữ liệu mẫu.',
        'Viết một trường hợp kiểm thử bình thường, một trường hợp lỗi và điều rút ra.'
      ]:[
        'Viết 3 câu tiếng Ý sử dụng nội dung của phần '+sec.title+'.',
        'Tạo hội thoại 4 lượt trong tình huống hướng dẫn khách Ý tại Việt Nam.',
        'Tự sửa ít nhất 2 lỗi diễn đạt, nêu lý do bằng tiếng Việt.'
      ];
      const wrapper=document.createElement('div');wrapper.className='practice-panel';
      wrapper.innerHTML='<h3>Thực hành bổ sung • từng câu</h3><p class="muted">Bài tập mở rộng; không thay thế bài trong giáo trình.</p>';
      prompts.forEach((q,i)=>{
        const t=document.createElement('div');t.className='question-prompt';t.textContent=(i+1)+'. '+q;
        wrapper.append(t);wrapper.append(buildAnswer('extra:'+getId()+':s'+section+':q'+i,i+1,q));
      });
      card.append(wrapper);
    }
  }
  function addHighlights(card,sec){
    if(/(đáp án|answer key|soluzioni|lời giải)/i.test(sec.title))return;
    const b=(sec.blocks||[]).find(x=>typeof x.text==='string'&&x.text.length>70&&!/https?:\/\//.test(x.text)&&!['Code Block'].includes(x.type));
    if(!b)return;
    let v=b.text.replace(/\s+/g,' ').trim();
    const point=v.split(/(?<=[.!?])\s+/)[0]||v;
    v=point.length>230?point.slice(0,225)+'…':point;
    const h=document.createElement('div');h.className='reading-highlight';
    h.innerHTML='<strong>Điểm cần nhớ</strong><p>'+html(v)+'</p>';
    const nav=card.querySelector('.navdays,.lesson-nav');
    if(nav)nav.insertAdjacentElement('afterend',h);
  }
  function makeControls(item){
    const bar=document.createElement('div');bar.className='learning-toolbar';
    const count=getItems().length,secs=getSections().length;
    const p=Math.round((section+1)/secs*100);
    bar.innerHTML='<div class="learning-progress"><span>📖 '+html(getTitle())+'</span><span>Phần '+(section+1)+'/'+secs+'</span></div>'+
      '<div class="learning-meter"><div style="width:'+p+'%"></div></div>'+
      '<div class="learning-actions"><button type="button" data-act="prevlesson" class="secondary" aria-label="Bài trước">‹ Bài</button>'+
      '<button type="button" data-act="prevsection" class="secondary" aria-label="Phần trước">‹ Phần</button>'+
      '<select aria-label="Chọn bài học" class="learning-jump"></select>'+
      '<button type="button" data-act="nextsection" class="secondary" aria-label="Phần tiếp">Phần ›</button>'+
      '<button type="button" data-act="nextlesson" class="secondary" aria-label="Bài tiếp">Bài ›</button></div>';
    const select=bar.querySelector('select');
    getItems().forEach((d,i)=>{let opt=document.createElement('option');opt.value=i;opt.textContent=(i+1)+'. '+d.title.slice(0,55);if(i===current)opt.selected=true;select.append(opt)});
    select.addEventListener('change',()=>go(Number(select.value)));
    for(const [action,cb,disabled] of [
      ['prevlesson',()=>go(Math.max(0,current-1)),current===0],
      ['prevsection',()=>goSection(section-1),section===0],
      ['nextsection',()=>goSection(section+1),section===secs-1],
      ['nextlesson',()=>go(Math.min(count-1,current+1)),current===count-1]
    ]){const btn=bar.querySelector('[data-act="'+action+'"]');btn.disabled=disabled;btn.addEventListener('click',cb)}
    return bar;
  }
  function enhance(){
    const item=getItem();
    if(!item)return;
    const card=[...root.querySelectorAll('.card')].find(el=>el.querySelector('.lesson-nav,.navdays'));
    if(!card)return;
    document.body.classList.add('reading-mode');
    state.answers||={};
    state.reading={id:getId(),index:current,section:section};
    save();
    const nav=card.querySelector('.lesson-nav,.navdays');
    nav.setAttribute('aria-label','Các phần của bài học');
    [...nav.querySelectorAll('button')].forEach(btn=>{btn.title=btn.textContent});
    const active=nav.querySelector('.active');if(active)active.scrollIntoView({inline:'center',block:'nearest'});
    addHighlights(card,getSections()[section]);
    addQuestions(card,item,getSections()[section]);
    const qaBtn=codeApp&&/^QA\d+D\d+$/.test(item.id)?document.createElement('button'):null;
    if(qaBtn){qaBtn.textContent='📘 Mở nội dung Banking chi tiết';qaBtn.className='secondary banking-shortcut';qaBtn.addEventListener('click',()=>goSection(Math.max(0,item.sections.findIndex(s=>s.title==='A. Giải thích từ số 0 (Banking QA)'))));card.querySelector('h2')?.insertAdjacentElement('afterend',qaBtn)}
    const legacy=root.querySelector('#work')?.closest('.card');
    if(legacy){const disclosure=document.createElement('details');disclosure.className='optional-notes';disclosure.innerHTML='<summary>Ghi chú tự do / xem trước code (tùy chọn)</summary>';legacy.insertAdjacentElement('beforebegin',disclosure);disclosure.append(legacy);legacy.classList.add('legacy-notes')}
    root.append(makeControls(item));
  }
  function resumeHome(){
    document.body.classList.remove('reading-mode');
    const r=state.reading;
    if(!r)return;
    const item=getItems()[r.index];if(!item)return;
    const banner=document.createElement('div');banner.className='resume-banner';
    banner.innerHTML='<div><strong>Tiếp tục bài đang học</strong><p>'+html(item.title)+' • phần '+(r.section+1)+'</p></div><button type="button">Tiếp tục học →</button>';
    banner.querySelector('button').addEventListener('click',()=>{if(codeApp)openDay(item.id,Math.min(r.section,item.sections.length-1));else openLesson(r.index,Math.min(r.section,item.sections.length-1))});
    root.insertAdjacentElement('afterbegin',banner);
  }
 
  const oldPlan=plan;plan=function(){document.body.classList.remove('reading-mode');return oldPlan()};
  const oldReviews=reviews;reviews=function(){document.body.classList.remove('reading-mode');return oldReviews()};
  const oldErrors=errors;errors=function(){document.body.classList.remove('reading-mode');return oldErrors()};
  const oldNotes=notes;notes=function(){
    document.body.classList.remove('reading-mode');oldNotes();
    const oldEntries=Object.entries(state.notes||{}).filter(([key,v])=>/^lesson-(?:1[9]|2\d|3[0-8])-\d+$/.test(key)&&String(v||'').trim());
    if(oldEntries.length){
      const detail=document.createElement('details');detail.className='optional-notes';
      detail.innerHTML='<summary>📚 Ghi chú theo số bài cũ 19–38 ('+oldEntries.length+' mục)</summary><p class="muted">Trước đây các bài tháng 11–12 có số trùng 19–38. Không thể tự biết ghi chú thuộc bài nào; hãy kiểm tra và sao chép khi cần. Không dữ liệu nào bị xóa.</p>';
      for(const [key,value] of oldEntries){const label=document.createElement('label');label.textContent=key;const input=document.createElement('textarea');input.readOnly=true;input.value=String(value);detail.append(label,input)}
      root.append(detail);
    }
  };
  const oldProgressView=progressView;progressView=function(){document.body.classList.remove('reading-mode');return oldProgressView()};

  const originalHome=home;
  home=function(){originalHome();resumeHome()};
  if(codeApp){
    const old=renderDay;renderDay=function(){old();enhance();root.scrollIntoView({behavior:'smooth',block:'start'})};
  }else{
    const old=renderLesson;renderLesson=function(){old();enhance();root.scrollIntoView({behavior:'smooth',block:'start'})};
  }
  home();
})();