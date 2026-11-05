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
const unlock =()=>{document.body.classList.remove('reading-mode');};
const panel=(title,body)=>'<section class="lp-panel"><h2>'+title+'</h2>'+body+'</section>';
const button=(text,fn,cls='')=>{const b=document.createElement('button');b.textContent=text;b.className=cls;b.addEventListener('click',fn);return b};
function sync(){try{save()}catch(e){alert('Bộ nhớ thiết bị đầy hoặc bị chặn. Hãy sao lưu dữ liệu trước khi tiếp tục. '+e.message)}}
function page(markup){unlock();root.innerHTML='<div class="lp-page">'+markup+'</div>';root.scrollIntoView({block:'start'})}
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
function quizView(item=items[current]){
 const key=labelItem(item),questions=quizQuestions(item);
 page('<h2>Kiểm tra kiến thức nền</h2><p class="lp-muted"><strong>'+E(item.title)+'</strong> — 3 câu trắc nghiệm chấm tự động bằng đáp án cố định. Đây chỉ là kiểm tra kiến thức nền, không thay thế đánh giá code hoặc bài viết.</p><div id="lp-quiz"></div>');
 const target=qs('#lp-quiz');
 questions.forEach((q,i)=>{const section=document.createElement('section');section.className='lp-panel';const h=document.createElement('h3');h.textContent=(i+1)+'. '+q.q;section.append(h);
 q.options.forEach((opt,j)=>{const label=document.createElement('label');label.className='lp-option';const inp=document.createElement('input');inp.type='radio';inp.name='lp-q'+i;inp.value=j;label.append(inp,document.createTextNode(' '+opt));section.append(label)});target.append(section)});
 const footer=document.createElement('div');footer.className='lp-panel';const grade=button('Chấm 3 câu',()=>{
   const selected=questions.map((q,i)=>{const el=target.querySelector('input[name="lp-q'+i+'"]:checked');return el?Number(el.value):null});
   if(selected.includes(null)){alert('Hãy chọn đáp án cho cả 3 câu.');return}
   const score=questions.reduce((s,q,i)=>s+(selected[i]===q.correct?1:0),0);
   state.lpQuiz[key]={score,total:3,date:today()};sync();
   const out=document.createElement('div');out.className='lp-feedback';out.innerHTML='<h3>Kết quả: '+score+'/3</h3>'+questions.map((q,i)=>'<p><strong>Câu '+(i+1)+': '+(selected[i]===q.correct?'Đúng':'Cần xem lại')+'</strong>. Đáp án: '+E(q.options[q.correct])+'. '+E(q.explain)+'</p>').join('')+'<p>Đạt từ 2/3 để đánh dấu đã kiểm tra nền tảng; không tự đánh dấu hoàn thành bài học.</p>';footer.querySelector('.lp-feedback')?.remove();footer.append(out);
 },'');footer.append(grade,button('Quay lại bài',()=>{const i=items.findIndex(x=>labelItem(x)===key);if(C)openDay(items[i].id);else openLesson(i)},'secondary'));target.append(footer);
}
const stages=C?[
['QA trái ngành — nền tảng',1,2,'Biết viết test case, bug report, phân biệt Expected/Actual và mô tả luồng dữ liệu'],
['QA Banking & Automation',3,6,'Làm được SQL/API cơ bản, test tự động mẫu và mô tả rủi ro nghiệp vụ ngân hàng'],
['Lập trình ứng dụng',7,22,'Hiểu Python, HTTP, SQL và backend đủ để tạo API dữ liệu mẫu'],
['Full-stack, AI, triển khai',23,46,'Có sản phẩm chạy được, test và README triển khai'],
['FDE, khách hàng & bàn giao',47,50,'Có demo, runbook, tài liệu yêu cầu, checklist UAT và kế hoạch vận hành']
]:[
['Tiếng Ý nền tảng + giao tiếp',1,14,'Dùng câu giới thiệu, chỉ đường, ngữ pháp nền và hội thoại tối thiểu 90 giây'],
['Hướng dẫn tour & kinh doanh',15,28,'Thuyết minh có nguồn, xử lý khách, báo giá giả lập và mô tả điểm đến'],
['SEO & booking tiếng Ý',29,38,'Viết email, FAQ, trang tour và phản hồi review'],
['Thuyết minh nâng cao & portfolio',39,58,'Thuyết minh dài, xử lý tình huống và có portfolio nội dung']
];
function readiness(){
 const records=Object.entries(state.lpQuiz);
 const strong=records.filter(([k,v])=>v.score>=2).length;
 const tot=items.length;
 page('<h2>Lộ trình năng lực & điều kiện chuyển cấp</h2><p>Khóa học vẫn mở tự do để xem lại bài. Mốc chuyển cấp là checklist hỗ trợ, <strong>không tự động khóa kiến thức hay đổi tiến độ cũ.</strong></p><p class="lp-muted">Đã kiểm tra kiến thức nền đạt từ 2/3: '+strong+' bài trên '+tot+'.</p><div id="lp-stages"></div>');
 const area=qs('#lp-stages');
 stages.forEach((s,i)=>{const key='stage-'+i;const checked=!!state.lpReadiness[key];const el=document.createElement('section');el.className='lp-panel';el.innerHTML='<h3>'+E(s[0])+'</h3><p>'+E(C?'Tuần '+s[1]+'–'+s[2]:'Bài '+s[1]+'–'+s[2])+': '+E(s[3])+'</p><p class="lp-muted">Chuẩn bị: đọc lý thuyết → thực hành → bài kiểm tra → tự giải thích không nhìn đáp án.</p>';const label=document.createElement('label');label.className='lp-option';const inp=document.createElement('input');inp.type='checkbox';inp.checked=checked;inp.addEventListener('change',()=>{state.lpReadiness[key]=inp.checked;sync()});label.append(inp,document.createTextNode(' Tôi đã hoàn thành minh chứng chuyển cấp này'));el.append(label);area.append(el)});
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
function annotateCurrent(){
 const item=items[current];if(!item)return;
 const id=labelItem(item);const buttonRow=document.createElement('div');buttonRow.className='lp-row lp-inline-actions';
 buttonRow.append(button('Kiểm tra 3 câu',()=>quizView(item),'secondary'),button('Ôn thẻ bài này',()=>{srsView()},'secondary'));
 const target=root.querySelector('.card .navdays,.card .lesson-nav');
 if(target)target.insertAdjacentElement('beforebegin',buttonRow);
 // Offer a transparent feedback check for free-text answers.
 root.querySelectorAll('.inline-answer').forEach((div,i)=>{
  if(div.querySelector('.lp-check'))return;
  const field=div.querySelector('textarea');if(!field)return;
  const inspect=button('Kiểm tra & gợi ý sửa',()=>{
    const txt=field.value.trim(),out=div.querySelector('.lp-feedback')||document.createElement('div');
    out.className='lp-feedback';const explain=C?[
      'Bài QA/code: có đầu vào và kết quả mong đợi rõ ràng chưa?',
      'Đã xét đường đi hợp lệ, không hợp lệ và dữ liệu biên chưa?',
      'Đã có code chạy thử, test report hoặc minh chứng phù hợp chưa?'
    ]:[
      'Tiếng Ý: kiểm tra chia động từ, mạo từ và giống/số.',
      'Câu có tự nhiên, lịch sự và phù hợp tình huống khách du lịch chưa?',
      'Thông tin lịch sử, giá hoặc thời gian có cần xác minh nguồn không?'
    ];
    if(!txt){out.textContent='Hãy nhập câu trả lời trước khi kiểm tra.'}
    else{
      // Unambiguous answers from the original Italian lesson 1 grammar drill.
      const exact=!C&&item.number===1&&section===8&&i<5?['sono','chiamo','abbiamo','ha','sta'][i]:null;
      if(exact){const norm=s=>s.toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[.,!?\s]/g,'').trim();const ok=norm(txt)===norm(exact);out.innerHTML='<strong>'+(ok?'✓ Đúng':'Cần sửa')+'</strong> — Đáp án: '+E(exact)+'. '+(ok?'Bạn đã chọn đúng dạng từ.':'Xem lại chủ ngữ và động từ trong ví dụ.') }
      else out.innerHTML='<strong>Phản hồi theo checklist (không phải chấm AI)</strong><p>'+E('Độ dài: '+txt.length+' ký tự. '+(txt.length<20?'Câu trả lời có thể quá ngắn; hãy bổ sung dẫn chứng hoặc ví dụ.':'Đã có nội dung; hãy đối chiếu từng tiêu chí.'))+'</p><ul>'+explain.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul><p>Đối chiếu phần đáp án mẫu, sửa lại và nộp lại. Không thể xác nhận đúng/sai tự động với câu hỏi mở.</p>';
    }
    if(!out.parentNode)div.append(out)
  },'secondary lp-check');
  div.querySelector('.answer-actions')?.append(inspect);
 });
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
const projects=[
{key:'tour',name:'AI Tourism Platform',phases:[
['Discovery & phạm vi','Mô tả khách du lịch, hướng dẫn viên, operator; 5 user stories và KPI chuyển đổi.'],
['Dữ liệu điểm đến','Bộ 10 điểm đến có nguồn, 5 tour giả, 2 tuyến tour mẫu, ghi rõ thông tin cần xác minh.'],
['UX & trang bán tour','Landing page responsive gồm lịch trình, bao gồm/không bao gồm, FAQ, CTA, accessibility.'],
['Backend & booking','API catalog, booking có validation, tránh đặt chỗ trùng; DB tours/departures/bookings.'],
['Kinh doanh & economics','Giá giả, chi phí, commission, gross margin, conversion funnel, phân tích rủi ro.'],
['Nội dung tiếng Ý & SEO','Tour page, 5 câu FAQ, email xác nhận bằng tiếng Ý, script thuyết minh 5 phút.'],
['QA và phát hành','Test matrix 15 trường hợp, 3 negative, 2 edge, staging, CI, backup và rollback.'],
['FDE bàn giao','Demo 8 phút, ADR, README, runbook, UAT, phản hồi operator và kế hoạch cải tiến.']
]},
{key:'stock',name:'AI Stock & Market Dashboard',phases:[
['Requirements & rủi ro','Xác định đối tượng sử dụng, dữ liệu chậm/đúng thời gian và giới hạn phân tích.'],
['Data ingestion','CSV/mock API dữ liệu giá, timezone, validation, giá âm/null, dữ liệu stale.'],
['Watchlist & biểu đồ','UI responsive, lọc mã, biểu đồ mẫu và trạng thái loading/empty/error.'],
['API, database & alert','Schema assets/prices/watchlists, API CRUD, cảnh báo dựa trên dữ liệu mẫu.'],
['Financial literacy','Biến động, lợi suất quá khứ, rủi ro, phí mẫu và phân biệt dữ liệu với lời khuyên đầu tư.'],
['Blockchain demo','Mô phỏng ledger hash-linked để hiểu tính toàn vẹn, khác biệt với cơ sở dữ liệu thông thường; không giao dịch tài sản thật.'],
['QA, bảo mật và AI','Test data/API/UI, kiểm tra phân quyền, AI grounded response có nguồn và biết giới hạn.'],
['Deployment & FDE','Staging, CI, monitoring, runbook, demo, tài liệu vận hành và bàn giao sản phẩm.']
]}];
function capstones(){
 page('<h2>Hai dự án tốt nghiệp · theo dõi bằng minh chứng</h2><p class="lp-muted">Mỗi mốc là một sản phẩm nhỏ có kiểm thử hoặc tài liệu. Đánh dấu hoàn thành do bạn tự xác nhận; không tự sinh code hay xác nhận đã deploy.</p><div id="lp-capstones"></div>');
 const container=qs('#lp-capstones');
 projects.forEach(p=>{
  const done=p.phases.filter((_,i)=>state.lpMilestones[p.key+'-'+i]).length;
  const wrap=document.createElement('section');wrap.className='lp-panel';wrap.innerHTML='<h3>'+E(p.name)+'</h3><p>'+done+'/'+p.phases.length+' mốc có minh chứng</p><progress value="'+done+'" max="'+p.phases.length+'"></progress>';
  p.phases.forEach((x,i)=>{const k=p.key+'-'+i;const details=document.createElement('details');details.className='lp-milestone';details.innerHTML='<summary>'+(i+1)+'. '+E(x[0])+(state.lpMilestones[k]?' ✓':'')+'</summary><p>'+E(x[1])+'</p><label>Link commit / đường dẫn demo / mô tả evidence</label>';const ta=document.createElement('textarea');ta.rows=3;ta.value=state.lpEvidence[k]||'';ta.addEventListener('input',()=>{state.lpEvidence[k]=ta.value;sync()});const lb=document.createElement('label');lb.className='lp-option';const inp=document.createElement('input');inp.type='checkbox';inp.checked=!!state.lpMilestones[k];inp.addEventListener('change',()=>{if(inp.checked&&!ta.value.trim()){alert('Hãy thêm đường dẫn hoặc mô tả bằng chứng trước khi đánh dấu hoàn thành.');inp.checked=false;return}state.lpMilestones[k]=inp.checked;sync();capstones()});lb.append(inp,document.createTextNode(' Đã thực hành và kiểm thử mốc này'));details.append(ta,lb);wrap.append(details)});container.append(wrap)});
}
function backup(){
 page('<h2>Trung tâm dữ liệu học & sao lưu</h2>'+panel('Dữ liệu hiện lưu trên thiết bị','<p>Bài làm từng câu, ghi chú cũ, trạng thái học, quiz, thẻ ôn và minh chứng dự án đều nằm trong dữ liệu JSON của app. Không có máy chủ đồng bộ hoặc chấm AI.</p><p><strong>Không xóa bộ nhớ trình duyệt hay gỡ PWA khi chưa có bản sao lưu.</strong></p><p>Để chuyển sang máy khác: Xuất JSON ở thiết bị cũ → chuyển file bằng kênh bạn tin cậy → nhập qua Tiến độ ở máy mới. File có thể chứa thông tin riêng tư.</p>'));
 const target=qs('.lp-page');target.append(button('Tải bản sao lưu JSON',()=>exportData()),button('Mở Tiến độ để nhập JSON',()=>progressView(),'secondary'));
 const date=state.lpBackupReminder||'';const p=document.createElement('p');p.className='lp-muted';p.textContent='Lần nhắc sao lưu gần nhất: '+(date||'chưa có');target.append(p);target.append(button('Đánh dấu đã sao lưu hôm nay',()=>{state.lpBackupReminder=today();sync();p.textContent='Đã ghi nhận hôm nay: '+today()},'secondary'));
}
function homePulse(){
 const due=cards.filter(dueCard).length,ready=Object.values(state.lpQuiz).filter(q=>q.score>=2).length;
 const box=document.createElement('div');box.className='lp-home-pulse';box.innerHTML='<strong>🎓 Góc học chủ động</strong><p>Đến hạn / chưa học: '+due+' thẻ · '+ready+' bài qua mini quiz · Học đúng nhịp: kiến thức → thực hành → kiểm thử → ôn lại.</p>';
 const row=document.createElement('div');row.className='lp-row';row.append(button('Ôn thẻ',srsView,'secondary'),button('Dự án tốt nghiệp',capstones,'secondary'),button('Lộ trình',readiness,'secondary'));box.append(row);root.prepend(box);
}
const nav=document.querySelector('header nav');
for(const [name,fn] of [['Ôn tập',srsView],['Kiểm tra cấp độ',readiness],['Điểm đến VN',trips],['Dự án tốt nghiệp',capstones],['Sao lưu',backup]])nav?.append(button(name,fn,'secondary lp-nav'));
const beforeHome=home;home=function(){beforeHome();homePulse()};
if(C){const before=renderDay;renderDay=function(){before();annotateCurrent()}}
else{const before=renderLesson;renderLesson=function(){before();annotateCurrent()}}
window.LearningPlus={quizView,srsView,trips,capstones,backup,readiness};
home();
})();
