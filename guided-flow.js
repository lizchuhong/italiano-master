/* Guided lesson interface: navigation, traceable knowledge, mobile-first learning. */
(function(){
'use strict';
const C=typeof all!=='undefined'&&Array.isArray(all);
const items=C?all:lessons;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=()=>items[current], id=x=>C?x.id:'I'+x.number;
const labels=['Bắt đầu','Học kiến thức','Xem ví dụ','Làm bài','Đối chiếu'];
const help=['Mục tiêu và cách học','Đọc các khái niệm cần thiết','Quan sát cách giải từng bước','Viết lời giải ngay dưới câu hỏi','So sánh, tự sửa và kết thúc'];
function kind(title){
 const s=String(title).toLowerCase();
 if(/học trước khi làm bài|học trước khi làm fde|nội dung giáo trình banking gốc/i.test(s))return 1;
 if(/answer key|risposte|soluzioni|đáp án|lời giải|tự đánh giá|autovalutazione|check understanding|definition of done|review schedule|error log|dialogo modello|model dialogue|kiểm tra kết quả|tiêu chí đạt/i.test(s))return 4;
 if(/exercise|esercizi|homework|luyện|thực hành|lab|speaking|role.play|role-play|produzione|bài tập|portfolio|hybrid practice|output bắt buộc|debugging|testing exercise|qa-first questions|luận bài/i.test(s))return 3;
 if(/example|esempio|ví dụ|scenario|model|reading|copywriting|hội thoại mẫu|c\. ví dụ/i.test(s))return 2;
 if(/introduction|giới thiệu|mục tiêu|obiettivi|roadmap/i.test(s))return 0;
 return 1;
}
function order(item){
 const groups=[[],[],[],[],[]];
 item.sections.forEach((s,i)=>{groups[kind(s.title)].push(i)});
 return groups;
}
const jump=n=>{section=n;C?renderDay():renderLesson()};
const open=i=>{if(i<0||i>=items.length)return;C?openDay(items[i].id):openLesson(i)};
function showLanding(){
 document.body.classList.remove('guided-lesson','reading-mode');
 const pulse=root.querySelector('.lp-home-pulse');
 root.querySelectorAll('.resume-banner').forEach(b=>b.remove());
 root.querySelector(':scope > h2')?.remove();
 if(pulse)pulse.remove();
 const intro=document.createElement('section');intro.className='guide-intro';intro.innerHTML='<span class="guide-eyebrow">HỌC THEO TỪNG BƯỚC</span><h2>Học gì hôm nay?</h2><p>① Mở bài → ② Đọc kiến thức → ③ Xem mẫu → ④ Làm từng câu → ⑤ Đối chiếu và ôn.</p>';
 const actions=document.createElement('div');actions.className='guide-row';
 const btn=(t,fn)=>{const b=document.createElement('button');b.textContent=t;b.addEventListener('click',fn);actions.append(b)};
 const r=state.reading;
 btn('▶ Tiếp tục bài đang học',()=>{let i=items.findIndex(x=>id(x)===r?.id);if(i<0)i=items.findIndex(x=>!state.done?.[C?x.id:x.number]);if(i<0)i=0;open(i)});
 btn('✍ Bắt đầu từ bài đầu',()=>open(0));
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
   if(v.length<2)return;
   const matches=items.map((x,i)=>({x,i})).filter(({x,i})=>(x.title+' '+(i+1)+' '+id(x)+' bài '+(i+1)).toLocaleLowerCase('vi').includes(v)).slice(0,20);
   matches.forEach(({x,i})=>{const b=document.createElement('button');b.className='guide-result';b.textContent=(i+1)+'. '+x.title;b.addEventListener('click',()=>open(i));results.append(b)});
   if(!matches.length)results.textContent='Không thấy tên bài phù hợp. Thử từ khóa khác.';
  });
  search.append(label,input,results);
  intro.insertAdjacentElement('afterend',search);
 }
}
function trustedSource(item,s){
 const t=s.title.toLowerCase();
 if(C&&/^QA/.test(item.id)){
  if(/nội dung giáo trình banking gốc/i.test(t))return ['Tài liệu người học cung cấp','Nội dung giáo trình Banking 30 ngày; các ngưỡng và quy tắc trong bài có thể là ví dụ đào tạo, không phải chính sách ngân hàng hiện hành.'];
  if(/từ số 0|luyện 3 cấp|ví dụ|banking qa/i.test(t))return ['Giải thích biên soạn thêm','Bài học hỗ trợ và tình huống ngân hàng giả lập; không đại diện hệ thống thật.'];
 }
 if(C&&/^W4[1-4]D/.test(item.id))return ['Bài FDE biên soạn mở rộng','Các bài lab là mô phỏng triển khai sản phẩm, kiểm tra bằng code/thử nghiệm của chính bạn.'];
 if(!C&&item.number>18&&!/laboratorio ampliato|economia|học trước khi/i.test(t))return ['Giáo trình mở rộng tháng 11–12','Ví dụ hội thoại và dữ liệu tour là tình huống học tập. Xác minh thông tin địa điểm, giá và lịch trước khi dùng thực tế.'];
 if(/lab mở rộng|laboratorio ampliato|học trước khi|economia del turismo/i.test(t))return ['Phần bổ sung để luyện tập','Ví dụ và bài tập mô phỏng; chỉ ghi nhận là hoàn thành sau khi đã thực hành.'];
 return ['Nội dung của giáo trình đang học','Bài tập và phần lý thuyết hiện tại lấy từ cùng một bài.'];
}
function cleanSection(s){return s.title.replace(/^\d+\.\s*/, '').replace(/^([A-E])\.\s*/, '')}
function related(item,groups){
 const concept=groups[1],examples=groups[2];
 const taught=concept.filter(i=>/Học trước khi làm/i.test(item.sections[i].title));
 const manual=concept.filter(i=>/giáo trình Banking gốc|Grammatica|Concept explanation|Beginner Deep Dive|từ số 0/i.test(item.sections[i].title));
 const picks=[...taught,...manual.slice(0,2),...examples.slice(0,2),...concept.slice(0,2)];
 return [...new Set(picks)].filter(i=>i!==section).slice(0,5);
}
function lessonView(){
 const item=get();if(!item)return;
 document.body.classList.add('guided-lesson','reading-mode');
 const card=[...root.querySelectorAll('.card')].find(e=>e.querySelector('.lesson-nav,.navdays'));
 if(!card)return;
 const groups=order(item),stage=kind(item.sections[section].title),allOrder=groups.flat();
 const pos=allOrder.indexOf(section);
 const hero=document.createElement('section');hero.className='guide-lesson-hero';
 hero.innerHTML='<span class="guide-eyebrow">BÀI '+(current+1)+' / '+items.length+'</span><h2>'+esc(item.title)+'</h2><p>Học đúng chủ đề của bài này. Mỗi câu được nhập và lưu riêng; bạn có thể quay lại kiến thức ngay trong lúc làm.</p>';
 const tabs=document.createElement('div');tabs.className='guide-steps';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','5 bước học bài');
 labels.forEach((label,i)=>{
  const b=document.createElement('button');b.className='guide-step'+(stage===i?' active':'');
  b.innerHTML='<span>'+(i+1)+'</span><strong>'+esc(label)+'</strong><small>'+esc(help[i])+'</small>';
  b.disabled=!groups[i].length;b.addEventListener('click',()=>jump(groups[i][0]));tabs.append(b);
 });
 hero.append(tabs);
 // Put a simple section dropdown and explain where the learning material lives.
 const top=document.createElement('div');top.className='guide-location';
 const select=document.createElement('select');select.setAttribute('aria-label','Chọn mục trong bước đang học');
 groups[stage].forEach(i=>{const option=document.createElement('option');option.value=i;option.textContent=cleanSection(item.sections[i]);option.selected=i===section;select.append(option)});
 select.addEventListener('change',()=>jump(Number(select.value)));
 const label=document.createElement('label');label.textContent='Mục hiện tại:';
 top.append(label,select);hero.append(top);
 const sourceSection=item.sections.find(x=>/^Học trước khi làm/i.test(x.title));
 if(sourceSection){
   const allText=(sourceSection.blocks||[]).map(b=>b.text||'').join(' ');
   const url=allText.match(/https:\/\/(?:docs\.python\.org|developer\.mozilla\.org|git-scm\.com|www\.postgresql\.org|fastapi\.tiangolo\.com|react\.dev|docs\.docker\.com|platform\.openai\.com|www\.treccani\.it|api-security\.owasp\.org)\/[^\s;]+/i)?.[0];
   if(url){const ref=document.createElement('a');ref.href=url;ref.target='_blank';ref.rel='noopener noreferrer';ref.className='guide-reference-link';ref.textContent='↗ Mở tài liệu chính thức để đối chiếu';hero.append(ref)}
 }
 const map=document.createElement('div');map.className='guide-source';
 const [origin,warning]=trustedSource(item,item.sections[section]);
 map.innerHTML='<strong>'+esc(origin)+'</strong><p>'+esc(warning)+'</p>';
 hero.append(map);
 if(stage===4){
   const reviewTools=document.createElement('details');reviewTools.className='guide-outline';
   reviewTools.innerHTML='<summary>Quiz 3 câu nền tảng của nhóm học (khác bài tập đang học)</summary><p>Chỉ dùng để tự ôn khái niệm chung. Không thay thế đáp án và bài tập của bài hiện tại.</p>';
   const btn=document.createElement('button');btn.className='secondary';btn.textContent='Mở quiz kiến thức nền';btn.addEventListener('click',()=>window.LearningPlus?.quizView?.(item));reviewTools.append(btn);hero.append(reviewTools);
 }
 // Show knowledge links before exercise. Do not claim every existing exercise is solvable if it isn't.
 if(stage===3){
  const prep=document.createElement('div');prep.className='guide-prereq';
  prep.innerHTML='<strong>📚 Cần xem trước khi làm bài này</strong><p>Đây là các mục lý thuyết/ví dụ có trong <em>chính bài hiện tại</em>. Đọc chúng rồi quay lại câu hỏi; nếu yêu cầu thêm kiến thức chưa giảng, đừng đoán, hãy ghi “cần nguồn bổ sung”.</p>';
  const row=document.createElement('div');row.className='guide-row';
  related(item,groups).forEach(i=>{const b=document.createElement('button');b.textContent=cleanSection(item.sections[i]);b.className='secondary';b.addEventListener('click',()=>jump(i));row.append(b)});
  if(!row.children.length){const p=document.createElement('p');p.textContent='Bài chưa có phần lý thuyết hoặc ví dụ riêng. Đừng coi bài này là đủ kiến thức để tự làm; kiểm tra học phần trước hoặc tài liệu tham chiếu.';prep.append(p)}
  else prep.append(row);
  hero.append(prep);
 }
 const nav=card.querySelector('.lesson-nav,.navdays');
 if(nav){
  const details=document.createElement('details');details.className='guide-outline';
  const summary=document.createElement('summary');summary.textContent='Mở mục lục chi tiết ('+item.sections.length+' mục)';
  nav.parentNode.insertBefore(details,nav);details.append(summary,nav);
  nav.classList.add('guide-toc-list');
 }
 const source=card.querySelector('h2');if(source)source.classList.add('guide-old-heading');
 const otherAction=card.querySelector('.lp-inline-actions');if(otherAction)otherAction.remove();
 const inserted=card.previousElementSibling;
 if(inserted&&inserted.classList.contains('row'))inserted.insertAdjacentElement('afterend',hero);
 else card.insertAdjacentElement('beforebegin',hero);
 const footer=document.createElement('div');footer.className='guide-footer';
 const left=document.createElement('button');left.className='secondary';left.textContent='← Mục trước';left.disabled=pos<=0;left.addEventListener('click',()=>jump(allOrder[pos-1]));
 const count=document.createElement('div');count.className='guide-count';count.textContent='Mục '+(pos+1)+' / '+allOrder.length;
 const next=document.createElement('button');next.textContent=pos===allOrder.length-1?'Hoàn thành, sang bài tiếp →':'Mục tiếp →';next.addEventListener('click',()=>pos===allOrder.length-1?open(Math.min(items.length-1,current+1)):jump(allOrder[pos+1]));
 footer.append(left,count,next);document.body.append(footer);
 document.querySelectorAll('body > .guide-footer').forEach((f,i,a)=>{if(i<a.length-1)f.remove()});
 const standalone=root.querySelector('#work')?.closest('.card');
 if(standalone&&!standalone.closest('details')){const details=document.createElement('details');details.className='guide-legacy';details.innerHTML='<summary>Ghi chú hoặc chạy thử HTML/JS (tùy chọn)</summary>';standalone.parentElement.insertBefore(details,standalone);details.append(standalone)}
}
function topNav(){
 const nav=document.querySelector('header nav');if(!nav||nav.querySelector('.guide-mainnav'))return;
 const extras=document.createElement('details');extras.className='guide-extras';
 extras.innerHTML='<summary>☰ Thêm công cụ</summary>';
 const contents=document.createElement('div');contents.className='guide-extra-content';
 while(nav.firstChild)contents.append(nav.firstChild);
 extras.append(contents);
 const basic=document.createElement('div');basic.className='guide-mainnav';
 function navBtn(text,cb){const b=document.createElement('button');b.textContent=text;b.addEventListener('click',cb);basic.append(b)}
 navBtn('🏠 Khóa học',()=>home());
 navBtn('▶ Học tiếp',()=>{const i=items.findIndex(x=>id(x)===state.reading?.id);open(i>=0?i:0)});
 navBtn('✍ Làm bài',()=>{const item=get()||items[0];const groups=order(item);const i=groups[3][0]??0;if(C)openDay(item.id,i);else openLesson(items.indexOf(item),i)});
 navBtn('🔁 Ôn tập',()=>window.LearningPlus?.srsView?.());
 nav.append(basic,extras);
}
function cleanFooter(){for(const f of document.querySelectorAll('body > .guide-footer'))f.remove();document.body.classList.remove('guided-lesson')}
const oldHome=home;home=function(){cleanFooter();oldHome();showLanding()};
if(C){
 const origWeek=weekView;weekView=function(i){cleanFooter();origWeek(i)};
 const oldRender=renderDay;renderDay=function(){cleanFooter();oldRender();lessonView()};
}else{
 const oldRender=renderLesson;renderLesson=function(){cleanFooter();oldRender();lessonView()};
}
topNav();home();
window.GuidedStudy={order,kind,lessonView};
})();