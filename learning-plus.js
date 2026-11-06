/* Learning Plus - client-only tools, no secret keys or remote submission. */
(function(){
'use strict';
const C=typeof all!=='undefined' && Array.isArray(all);
const items=C?all:lessons;
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const qs=(s)=>root.querySelector(s);
const today=()=>new Date().toISOString().slice(0,10);
const dayAfter=(n)=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
state.lpQuiz||={};state.lpReview||={};state.lpMilestones||={};state.lpEvidence||={};state.lpTour||={};state.lpReadiness||={};
const labelItem=(d)=>C?d.id:'I'+d.number;
const idOfCurrent=()=>labelItem(items[current]);
const panel=(title,body)=>'<section class="lp-panel"><h2>'+title+'</h2>'+body+'</section>';
const button=(text,fn,cls='')=>{const b=document.createElement('button');b.textContent=text;b.className=cls;b.addEventListener('click',fn);return b};
function sync(){try{save()}catch(e){alert('Bộ nhớ thiết bị đầy hoặc bị chặn. Hãy sao lưu dữ liệu trước khi tiếp tục. '+e.message)}}
function page(markup){root.innerHTML='<div class="lp-page">'+markup+'</div>';root.scrollIntoView({block:'start'})}
const L=(c,sub)=>({c,sub});
const quizBank={
qa:[
['Trong bug report, Expected Result nghĩa là gì?',['Hành vi yêu cầu','Lỗi đang thấy','Mức độ ưu tiên'],0,'Expected phải rút từ yêu cầu kiểm chứng được, khác Actual.'],
['Timeout khi chuyển tiền có luôn đồng nghĩa giao dịch thất bại?',['Có','Không, phải xác minh trạng thái','Chỉ khi dùng Wi-Fi'],1,'Timeout có thể xảy ra sau khi backend xử lý; cần kiểm tra trạng thái/đối soát.'],
['Một test case nên có gì?',['Dữ liệu, bước, kết quả mong đợi','Chỉ ảnh màn hình','Chỉ tên tester'],0,'Expected result phải cụ thể và tái hiện được.']
],
sql:[
['WHERE được dùng để làm gì?',['Lọc dòng','Nhóm dòng','Tạo bảng'],0,'WHERE lọc bản ghi trước khi gom nhóm.'],
['JOIN thường dùng để làm gì?',['Kết nối bảng theo điều kiện','Mã hóa file','Thay đổi font'],0,'JOIN kết hợp dữ liệu qua khóa và điều kiện.'],
['Kiểm thử ràng buộc UNIQUE nên bao gồm trường hợp nào?',['Dữ liệu trùng','Một màu mới','Đổi ngôn ngữ'],0,'UNIQUE giúp từ chối giá trị trùng theo thiết kế bảng.']
],
python:[
['Kiểu dữ liệu của 42 trong Python là gì?',['int','str','bool'],0,'42 là số nguyên; "42" mới là chuỗi.'],
['assert dùng để làm gì trong test?',['Kiểm tra điều kiện','Tạo trang web','Cài hệ điều hành'],0,'assert kiểm tra điều kiện kỳ vọng, sai thì báo thất bại.'],
['Hàm giúp điều gì?',['Tái sử dụng một nhóm xử lý','Tăng tốc Internet tự động','Thay database'],0,'Hàm nhận input và trả output có thể kiểm thử.']
],
web:[
['HTML dùng chủ yếu để làm gì?',['Cấu trúc nội dung','Lưu dữ liệu server','Chạy SQL'],0,'HTML tạo cấu trúc, CSS định dạng và JS xử lý tương tác.'],
['Một input dễ truy cập nên có gì?',['Nhãn label','Chỉ placeholder','Không có tên'],0,'Label giúp người dùng và công cụ hỗ trợ xác định ô nhập.'],
['API trả lỗi HTTP 500 thường biểu thị gì?',['Lỗi phía server','Nhập sai mật khẩu luôn luôn','Thành công'],0,'500 là lỗi máy chủ; cần log, test data và trace ID.']
],
ai:[
['Grounding giúp gì cho trả lời AI?',['Dựa trên nguồn có thể kiểm tra','Bảo đảm không bao giờ sai','Giấu nguồn'],0,'Cần đánh giá câu trả lời và dẫn nguồn.'],
['Dữ liệu nào không nên gửi vào prompt công khai?',['Thông tin cá nhân nhạy cảm','Dữ liệu demo giả','Tên lớp học mẫu'],0,'Áp dụng nguyên tắc tối thiểu dữ liệu.'],
['Khi nguồn dữ liệu không đủ, trợ lý AI nên làm gì?',['Nêu giới hạn và xin xác minh','Bịa số liệu','Khẳng định chắc chắn'],0,'Không suy diễn giá và thông tin không có nguồn.']
],
fde:[
['Discovery của FDE nhằm mục tiêu gì?',['Hiểu bài toán và kết quả khách hàng cần','Chỉ chọn công nghệ mới','Bỏ qua người dùng'],0,'Cần vấn đề, stakeholder, KPI và tiêu chí chấp nhận.'],
['Staging là gì?',['Môi trường thử trước production','Bản sao lưu ảnh','Chỉ là CSS'],0,'Tách môi trường để kiểm thử trước khi phát hành.'],
['Runbook phục vụ điều gì?',['Các bước vận hành, khôi phục và xử lý sự cố','Trang giới thiệu nhân viên','Giá sản phẩm'],0,'Runbook giúp nhân sự tiếp nhận vận hành có căn cứ.']
],
italian:[
['Câu nào đúng để giới thiệu bản thân?',['Mi chiamo Anna.','Io sto Anna.','Io è Anna.'],0,'Mi chiamo dùng để nói tên.'],
['Đâu là lời đề nghị lịch sự với khách?',['Potrebbe confermare la data?','Conferma subito!','Io confermare data.'],0,'Condizionale thể hiện sự lịch sự.'],
['Câu nào diễn tả “Có hai bảo tàng”?',['Ci sono due musei.','C’è due musei.','Sono bisogno di musei.'],0,'Ci sono đi với danh từ số nhiều.']
],
tour:[
['Trước khi báo giá tour cho khách, cần làm gì?',['Xác nhận ngày, số khách và dịch vụ bao gồm','Tự hứa mọi dịch vụ','Bỏ qua điều kiện hủy'],0,'Không tự tạo giá hoặc lịch khi chưa xác minh.'],
['Một tour page rõ ràng cần có gì?',['Lịch trình, giá/điều kiện, CTA, FAQ','Chỉ ảnh nền','Chỉ slogan'],0,'Cung cấp thông tin hữu ích có thể kiểm chứng.'],
['Khi khách hỏi điều chưa rõ, hướng dẫn viên nên?',['Thừa nhận cần kiểm tra và xác minh','Bịa thông tin','Đổi chủ đề'],0,'Tính chính xác quan trọng hơn ứng biến sai.']
]};
function category(item){if(!C){const n=item.number;return n>=15&&n<=18||n>=29&&n<=36||n>=50?'tour':'italian'}
 const t=(item.title+' '+item.weekTitle).toLowerCase();
 if(/^QA/.test(item.id))return 'qa';
 if(/^W4[1-4]D/.test(item.id))return 'fde';
 if(/sql|database|postgres|schema|orm|query|join/.test(t))return 'sql';
 if(/python|function|loop|list|dictionary|variable|error|file|module|class/.test(t))return 'python';
 if(/llm|ai |rag|prompt|retrieval|agent|embedding|model/.test(t))return 'ai';
 if(/deploy|docker|cloud|architecture|stakeholder|ci\/cd|operations|release/.test(t))return 'fde';
 return 'web';
}
function quizQuestions(item){
 let bank=quizBank[category(item)]||quizBank.web;
 // Vary order without changing answer correctness.
 let offset=[...labelItem(item)].reduce((a,c)=>a+c.charCodeAt(0),0)%bank.length;
 return bank.slice(offset).concat(bank.slice(0,offset)).map((q,i)=>({q:q[0],options:q[1],correct:q[2],explain:q[3],id:i}));
}
function quizPanel(item) {
  const key = labelItem(item);
  const questions = quizQuestions(item);
  const target = document.createElement('div');
  const note = document.createElement('p');
  note.className = 'lp-muted';
  note.textContent = 'Ba câu ôn chung của nhóm chủ đề. Dùng đáp án và tiêu chí trong bài để đối chiếu bài tập cụ thể.';
  target.append(note);

  const previous = state.lpQuiz?.[key];
  const inputs = questions.map((question, index) => {
    const section = document.createElement('fieldset');
    section.className = 'lp-panel';
    const legend = document.createElement('legend');
    legend.textContent = (index + 1) + '. ' + question.q;
    section.append(legend);
    const options = question.options.map((option, choice) => {
      const label = document.createElement('label');
      label.className = 'lp-option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'lp-q-' + key + '-' + index;
      input.value = choice;
      input.checked = previous?.answers?.[index] === choice;
      label.append(input, document.createTextNode(' ' + option));
      section.append(label);
      return input;
    });
    target.append(section);
    return options;
  });

  const output = document.createElement('div');
  output.className = 'lp-feedback';
  output.setAttribute('role', 'status');
  if (previous) output.textContent = 'Kết quả đã lưu ' + previous.score + '/' + previous.total + '.';
  const grade = button('Chấm 3 câu', () => {
    const selected = inputs.map(options => options.findIndex(input => input.checked));
    if (selected.includes(-1)) {
      output.textContent = 'Hãy chọn đáp án cho cả 3 câu.';
      return;
    }
    const score = questions.filter((question, index) => selected[index] === question.correct).length;
    (state.lpQuiz ||= {})[key] = { score, total: questions.length, date: today(), answers: selected };
    sync();
    output.innerHTML = '<h4>Kết quả ' + score + '/' + questions.length + '</h4>' +
      questions.map((question, index) =>
        '<p><strong>Câu ' + (index + 1) + ' · ' + (selected[index] === question.correct ? 'Đúng' : 'Cần xem lại') +
        '</strong>. ' + E(question.options[question.correct]) + '. ' + E(question.explain) + '</p>').join('');
  });
  target.append(grade, output);
  return target;
}

function quizView(item=items[current]) {
  page('<h2>Quiz ôn kiến thức nền</h2>');
  const key = labelItem(item);
  qs('.lp-page').append(quizPanel(item), button('Quay lại bài', () => {
    const index = items.findIndex(value => labelItem(value) === key);
    const part = state.reading?.id === key ? state.reading.section : undefined;
    if (C) openDay(items[index].id, part);
    else openLesson(index, part);
  }, 'secondary'));
}
const stages = [
  ['Giao tiếp và ngữ pháp nền', 1, 14, 'Đón khách, giới thiệu và chỉ đường trong 90 giây. Nhờ người đối thoại hỏi ba câu bất ngờ để kiểm nghe hiểu và cách hỏi lại.'],
  ['Điều phối và thuyết minh', 15, 28, 'Dẫn thử tuyến 30 phút theo cue card. Gắn nguồn với dữ kiện chính, xử lý một câu hỏi xen ngang và lưu bản ghi có mốc thời gian.'],
  ['Đặt tour, email và SEO', 29, 38, 'Soạn email và một trang tour cho cùng tuyến. Nhờ người đọc tìm đúng ngày, điểm hẹn, giá theo đơn vị và cách đổi lịch từ nội dung đã viết.'],
  ['Tour dài và portfolio', 39, 58, 'Dẫn thử 60 phút và hỏi đáp 10–15 phút với người đối thoại. Ghi nhận phản hồi cụ thể và hoàn thiện trang tour, bài viết, email và bản ghi sau khi sửa.']
];
function readiness() {
  page('<h2>Mốc ứng dụng thực tế</h2><p>Tự làm lại bằng dữ liệu hoặc tình huống mới rồi đánh dấu khi có đầu ra có thể kiểm.</p>' +
    '<p><a href="#tot-nghiep">Mở trang lưu minh chứng dự án</a></p><div id="lp-stages"></div>');
  const area = qs('#lp-stages');
  stages.forEach(([title, first, last, evidence], index) => {
    const key = 'practical-stage-' + index;
    const wrap = document.createElement('section');
    wrap.className = 'lp-panel';
    wrap.innerHTML = '<h3>' + E(title) + '</h3><p class="lp-muted">' +
      (C ? 'Tuần ' : 'Bài ') + first + '–' + last + '</p><p>' + E(evidence) + '</p>';
    const label = document.createElement('label');
    label.className = 'lp-option';
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = !!state.lpReadiness[key];
    check.addEventListener('change', () => {
      state.lpReadiness[key] = check.checked;
      sync();
    });
    label.append(check, document.createTextNode(' Tôi đã làm được và có minh chứng'));
    wrap.append(label);
    area.append(wrap);
  });
}
function cardDeck(){
 const list=[];
 for(const item of items){
  const id=labelItem(item);
  if(C){let s=item.sections.find(x=>/(concept|lý thuyết|theory|giải thích từ số 0)/i.test(x.title))||item.sections[0];let content=(s?.blocks||[]).find(x=>typeof x.text==='string'&&x.text.length>65)?.text||'Hãy giải thích khái niệm, đưa ví dụ và xác minh bằng thực hành.';list.push({id:id+'-concept',title:item.title,front:'Giải thích khái niệm: '+item.title,back:content.slice(0,380),item})}
  else{const vocab=item.sections.find(x=>/Vocabolario/i.test(x.title))?.blocks.find(x=>x.type==='table')?.rows||[];if(vocab.length>1){for(let j=1;j<Math.min(vocab.length,4);j++){const row=vocab[j];list.push({id:id+'-v'+j,title:item.title,front:'Từ tiếng Ý: '+(row[0]||''),back:'Nghĩa: '+(row[1]||'')+' — '+(row[2]||''),item})}}else{const text=item.sections[1]?.blocks.find(b=>b.text)?.text||item.title;list.push({id:id+'-concept',title:item.title,front:'Tóm tắt: '+item.title,back:text.slice(0,360),item})}}
 }
 return list;
}
const cards=cardDeck();
function dueCard(card){const r=state.lpReview[card.id];return !r||!r.due||r.due<=today()}
function srsView(){
 const due=cards.filter(dueCard),ready=due.slice(0,12);
 page('<h2>Ôn tập thông minh D1–D3–D7–D14–D30</h2><p class="lp-muted">Thẻ dựa trên khái niệm hoặc bảng từ vựng của giáo trình. Hãy tự trả lời trước khi lật. Nhấn “Nhớ” để giãn lịch, “Quên” để xem lại ngày mai; không tự động đánh giá đúng/sai.</p><p><strong>'+due.length+' thẻ cần học hoặc ôn</strong> / '+cards.length+' thẻ.</p><div id="lp-flash"></div>');
 const area=qs('#lp-flash');
 if(!ready.length){area.innerHTML='<p>Hôm nay đã ôn hết! Những thẻ tiếp theo sẽ xuất hiện khi đến hạn.</p>';return}
 const intervals=[1,3,7,14,30];
 ready.forEach(card=>{const wrap=document.createElement('section');wrap.className='lp-panel';wrap.innerHTML='<small>'+E(card.title)+'</small><h3>'+E(card.front)+'</h3>';const back=document.createElement('div');back.className='lp-answer';back.textContent=card.back;back.hidden=true;wrap.append(button('Lật thẻ / xem lời giải',()=>{back.hidden=!back.hidden},'secondary'),back);
 const row=document.createElement('div');row.className='lp-row';
 for(const [txt,pass] of [['Quên',false],['Nhớ',true]])row.append(button(txt,()=>{const old=state.lpReview[card.id]||{level:-1};const lvl=pass?Math.min((Number.isInteger(old.level)?old.level:-1)+1,4):0;state.lpReview[card.id]={level:lvl,due:dayAfter(pass?intervals[lvl]:1),last:today()};sync();wrap.remove()},pass?'':'secondary'));
 wrap.append(row);area.append(wrap)});
}
function trips(){
 const atlas=window.TRAVEL_ATLAS||[];
 page('<h2>Thư viện điểm đến Việt Nam · tiếng Ý và nghề tour</h2><p class="lp-muted">Hồ sơ thực hành có từ vựng, kịch bản dẫn tour, câu hỏi khách, bài viết và nguồn kiểm chứng. Giờ mở cửa, vé, dịch vụ và lịch trình phải xác minh trực tiếp trước khi bán tour.</p><input id="lp-trip-search" placeholder="Tìm địa điểm / vùng / từ khóa…" aria-label="Tìm địa điểm"><div id="lp-trips"></div>');
 const out=qs('#lp-trips');
 const draw=(query)=>{
  out.innerHTML='';
  const results=atlas.filter(d=>(d.name+' '+d.italian+' '+d.region+' '+d.focus).toLowerCase().includes(query.toLowerCase()));
  results.forEach(d=>{
   const wrap=document.createElement('section');wrap.className='lp-panel';
   wrap.innerHTML='<h3>'+E(d.name)+' <small>· '+E(d.region)+'</small></h3><p><strong>Chủ đề:</strong> '+E(d.focus)+'</p><p>'+E(d.fact)+'</p><div class="lp-answer"><strong>Câu mẫu Ý:</strong> '+E(d.phrase)+'</div><details><summary>Từ vựng và kịch bản tour</summary><ul>'+d.words.map(w=>'<li>'+E(w)+'</li>').join('')+'</ul><p>'+E(d.script)+'</p><p><strong>Gợi ý tuyến:</strong> '+E(d.route)+'</p><p><strong>Khách hỏi:</strong> '+d.questions.map(E).join(' / ')+'</p></details>';
   const link=document.createElement('a');link.href=d.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Nguồn tham khảo · xác minh trước khi dùng';wrap.append(link);
   const row=document.createElement('div');row.className='lp-row';row.append(button('Nghe câu mẫu (TTS)',()=>{if(!('speechSynthesis' in window)){alert('Trình duyệt chưa hỗ trợ giọng đọc.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(d.phrase);u.lang='it-IT';u.rate=.82;speechSynthesis.speak(u)},'secondary'));wrap.append(row);
   const l=document.createElement('label');l.textContent='Bài thuyết minh / lời giải của bạn';const ta=document.createElement('textarea');ta.rows=4;ta.placeholder='Soạn đoạn 2 phút, 5 câu Q&A và một CTA bán tour bằng tiếng Ý…';ta.value=state.lpTour[d.slug]||'';ta.addEventListener('input',()=>{state.lpTour[d.slug]=ta.value;sync()});wrap.append(l,ta);out.append(wrap)
  });
  if(!results.length)out.innerHTML='<p>Không có địa điểm phù hợp.</p>';
 };
 qs('#lp-trip-search').addEventListener('input',e=>draw(e.target.value));draw('');
}
const projects = [
  { key: 'italian-tour', name: 'Dẫn thử city tour bằng tiếng Ý', phases: [
    [16, 'Tuyến và nguồn', 'Chuẩn bị cue card cho từng điểm. Ghi nguồn và cách diễn đạt khi chi tiết còn cần xác minh.'],
    [28, 'Dẫn thử 30 phút', 'Lưu bản ghi. Nhờ một người hỏi hai câu bạn chưa chuẩn bị và ghi chỗ cần sửa.'],
    [49, 'Điều phối và ứng biến', 'Dẫn 45 phút, hỏi đáp 10 phút. Mô phỏng khách hỏi ngang hoặc cần đổi điểm hẹn.'],
    [58, 'Buổi tổng duyệt', 'Dẫn 60 phút và hỏi đáp 10–15 phút. Lưu bản ghi, phản hồi của người đối thoại và bản sửa.']
  ] },
  { key: 'italian-portfolio', name: 'Portfolio nội dung và đặt tour', phases: [
    [29, 'Email đặt tour', 'Lưu một cặp thư hỏi và trả lời. Kiểm ngày giờ, giá, điểm hẹn, điều kiện và hành động tiếp.'],
    [50, 'Bài viết tiếng Ý', 'Lưu ba bài với mục tiêu tìm kiếm khác nhau. Ghi nguồn và phần đã kiểm lại.'],
    [51, 'Trang bán tour', 'Lưu hai trang có lịch trình, CTA, FAQ và điều kiện. Nhờ người đọc tìm thông tin trước khi xem hướng dẫn.'],
    [53, 'Chăm sóc khách', 'Lưu phản hồi review và email xử lý thay đổi. Nhờ người biết tiếng Ý rà giọng điệu và độ rõ.']
  ] }
];
function capstones() {
  page('<h2>Minh chứng thực hành tiếng Ý</h2><p>Lưu tên tệp, đường dẫn hoặc mốc thời gian trong bản ghi. Chỉ đánh dấu sau khi đã chạy thử và ghi phản hồi.</p>' +
    '<p><a class="secondary" href="#bai/I58/11">Ghi kết quả tổng duyệt trong bài 58</a></p><div id="lp-capstones"></div>');
  const container = qs('#lp-capstones');
  for (const project of projects) {
    const wrap = document.createElement('section');
    wrap.className = 'lp-panel';
    wrap.innerHTML = '<h3>' + E(project.name) + '</h3><p class="lp-muted"></p>' +
      '<progress max="' + project.phases.length + '" aria-label="' + E(project.name) + '"></progress>';
    const progress = wrap.querySelector('progress');
    const update = () => {
      const done = project.phases.filter((_, i) => state.lpMilestones[project.key + '-' + i]).length;
      progress.value = done;
      wrap.querySelector('p').textContent = done + '/' + project.phases.length + ' mốc có minh chứng';
    };

    project.phases.forEach(([lesson, title, task], index) => {
      const key = project.key + '-' + index;
      const detail = document.createElement('details');
      detail.className = 'lp-milestone';
      detail.innerHTML = '<summary>' + E(title) + '</summary><p>' + E(task) + '</p>' +
        '<p><a href="#bai/I' + lesson + '/11">Mở bài ' + lesson + '</a></p>' +
        '<label for="' + key + '">Tên tệp, đường dẫn hoặc nhận xét</label>' +
        '<textarea id="' + key + '" rows="3"></textarea><p role="status"></p>';
      const field = detail.querySelector('textarea');
      const status = detail.querySelector('[role="status"]');
      field.value = state.lpEvidence[key] || '';
      const label = document.createElement('label');
      label.className = 'lp-option';
      const check = document.createElement('input');
      check.type = 'checkbox';
      const updateTitle = () => {
        check.checked = !!state.lpMilestones[key];
        detail.querySelector('summary').textContent = title + (check.checked ? ' ✓' : '');
      };
      updateTitle();
      field.addEventListener('input', () => {
        state.lpEvidence[key] = field.value;
        if (!field.value.trim() && check.checked) {
          state.lpMilestones[key] = false;
          updateTitle();
          update();
        }
        status.textContent = '';
        sync();
      });
      check.addEventListener('change', () => {
        if (check.checked && !field.value.trim()) {
          check.checked = false;
          status.textContent = 'Hãy ghi lại minh chứng trước khi đánh dấu.';
          field.focus();
          return;
        }
        state.lpMilestones[key] = check.checked;
        status.textContent = '';
        sync();
        updateTitle();
        update();
      });
      label.append(check, document.createTextNode(' Đã thực hành và có minh chứng'));
      detail.append(label);
      wrap.append(detail);
    });
    update();
    container.append(wrap);
  }
}
function backup(){
 page('<h2>Trung tâm dữ liệu học & sao lưu</h2>'+panel('Dữ liệu hiện lưu trên thiết bị','<p>Bài làm từng câu, ghi chú cũ, trạng thái học, quiz, thẻ ôn và minh chứng dự án đều nằm trong dữ liệu JSON của app. Không có máy chủ đồng bộ hoặc chấm AI.</p><p><strong>Không xóa bộ nhớ trình duyệt hay gỡ PWA khi chưa có bản sao lưu.</strong></p><p>Để chuyển sang máy khác: Xuất JSON ở thiết bị cũ → chuyển file bằng kênh bạn tin cậy → nhập qua Tiến độ ở máy mới. File có thể chứa thông tin riêng tư.</p>'));
 const target=qs('.lp-page');target.append(button('Tải bản sao lưu JSON',()=>exportData()),button('Mở Tiến độ để nhập JSON',()=>progressView(),'secondary'));
 const date=state.lpBackupReminder||'';const p=document.createElement('p');p.className='lp-muted';p.textContent='Lần nhắc sao lưu gần nhất: '+(date||'chưa có');target.append(p);target.append(button('Đánh dấu đã sao lưu hôm nay',()=>{state.lpBackupReminder=today();sync();p.textContent='Đã ghi nhận hôm nay: '+today()},'secondary'));
}
window.LearningPlus={quizView,quizPanel,srsView,trips,capstones,backup,readiness};
})();
