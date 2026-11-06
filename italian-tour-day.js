/* Full-day speaking practice for a simulated Italian-language city tour. */
(function () {
  'use strict';

  const scenarios = [
    {
      id: 'pickup', time: '08:30', title: 'Đón khách và chốt điểm hẹn', lesson: 1,
      task: 'Chào một khách lịch sự, rồi thông báo cho cả đoàn. Xác nhận tên, số người, giờ và vị trí. Nhờ khách nhắc lại điểm hẹn.',
      followUps: ['Se gli altri non arrivano entro quell’ora, partiamo lo stesso?', 'Come riconosciamo la biglietteria dalla strada?'],
      cases: [
        ['Scusi, è lei la guida del gruppo Rossi? Siamo in quattro, ma due persone non sono ancora arrivate.',
          'Buongiorno, sì, sono la vostra guida. Mi conferma che siete in quattro? Aspettiamo qui, davanti all’ingresso principale. Alle otto e quaranta vi aggiorno sulla partenza.'],
        ['Siamo davanti a un altro ingresso. Può dirci come raggiungervi?',
          'Mi dica che cosa vede vicino a voi, per favore. Noi siamo davanti all’ingresso principale, accanto alla biglietteria. Le mando anche il punto sulla mappa.']
      ]
    },
    {
      id: 'small-talk', time: '09:00', title: 'Trò chuyện trên đường đi', lesson: 3,
      task: 'Hỏi mở, nghe câu trả lời và hỏi tiếp dựa vào một chi tiết. Kể một điều ngắn có liên quan, rồi mời khách khác góp chuyện.',
      followUps: ['Ci può raccontare cosa si mangia di solito a colazione qui?', 'Ci sono ancora botteghe che lavorano come una volta?'],
      cases: [
        ['È la nostra prima volta in Vietnam. Ci piace conoscere i posti dove mangiano le persone del quartiere.',
          'Che cosa vi piace assaggiare quando viaggiate? Durante il percorso possiamo osservare come cambia la strada all’ora di pranzo. Qualcuno del gruppo ha già provato un piatto che gli è piaciuto?'],
        ['Scusi, non ho capito l’ultima parola. Può ripeterla più lentamente?',
          'Certo. Dicevo “bottega”, cioè un piccolo negozio o laboratorio. Guardate quella vetrina. È un esempio di quello che intendevo.']
      ]
    },
    {
      id: 'story', time: '09:45', title: 'Thuyết minh và trả lời câu hỏi lịch sử', lesson: 22,
      task: 'Dẫn khách nhìn một chi tiết. Tách quan sát, dữ kiện có nguồn và truyền thuyết. Hẹn kiểm lại điều chưa biết rồi quay lại mạch kể.',
      followUps: ['E perché la spada doveva essere restituita?', 'Che cosa possiamo osservare da qui senza entrare?'],
      cases: [
        ['La storia della spada è un fatto storico? In che anno sarebbe successa?',
          'È una leggenda legata al lago. Posso raccontarvi la versione più conosciuta. Per una data precisa, verificherei prima le fonti. Ora guardate la torre al centro del lago.'],
        ['Quella torre è contemporanea agli eventi che ci ha appena raccontato?',
          'Mi chiede se risale allo stesso periodo, giusto? Vorrei verificare la data di costruzione. Intanto possiamo osservare la posizione della torre e capire perché è un punto di riferimento.']
      ]
    },
    {
      id: 'tickets', time: '10:30', title: 'Vé, giờ mở cửa và thay đổi tại điểm đến', lesson: 34,
      task: 'Xác nhận điều kiện tại quầy hoặc với điều phối. Giải thích phần chắc chắn, một phương án thay thế và giờ cập nhật.',
      followUps: ['Per la visita alternativa serve un altro biglietto?', 'Se torniamo dopo pranzo, quanto tempo dobbiamo prevedere?'],
      cases: [
        ['La sala che volevamo vedere è chiusa. Abbiamo già il biglietto. Che cosa possiamo visitare?',
          'Verifico con il personale quali sale sono accessibili con questo biglietto. Nel frattempo restiamo qui. Tra cinque minuti vi confermo il percorso alternativo.'],
        ['Possiamo comprare i biglietti adesso e tornare nel pomeriggio?',
          'Controllo se il biglietto vale anche per un ingresso nel pomeriggio. Appena ho conferma, vi dico dove ritirarlo e a che ora conviene tornare.']
      ]
    },
    {
      id: 'meeting-point', time: '11:15', title: 'Chỉ đường và tập hợp đoàn', lesson: 5,
      task: 'Xác nhận khách đang ở đâu bằng vật mốc. Đưa từng chỉ dẫn, xác nhận lại vị trí và giờ, rồi báo cho điều phối nếu có người chưa liên lạc được.',
      followUps: ['Qui ci sono due uscite laterali. Le mando la mia posizione?', 'Intende la biglietteria all’ingresso principale?'],
      cases: [
        ['Sono uscito dalla porta laterale e non trovo il gruppo. Vedo una farmacia dall’altra parte della strada.',
          'Resti vicino all’uscita, per favore. Mi conferma il nome della farmacia? Le indico il percorso sul telefono o ci incontriamo vicino alla porta laterale.'],
        ['Possiamo fermarci a comprare qualcosa? A che ora ci ritroviamo?',
          'Sì, ci ritroviamo alle undici e quaranta davanti alla biglietteria. Vi chiedo di ripetermi l’orario e il punto d’incontro, così siamo tutti d’accordo.']
      ]
    },
    {
      id: 'lunch', time: '12:15', title: 'Ăn trưa và hỏi về dị ứng', lesson: 26,
      task: 'Nhắc lại thực phẩm khách cần tránh. Kiểm với quán về thành phần và tiếp xúc chéo. Chỉ truyền đạt điều quán xác nhận, rồi đưa phương án khác nếu cần.',
      followUps: ['Può chiedere anche se usano olio di arachidi?', 'Possiamo aspettare qui mentre chiama l’altro locale?'],
      cases: [
        ['Sono allergica alle arachidi. Sa se questo piatto contiene arachidi o se viene preparato con gli stessi utensili?',
          'Mi conferma che deve evitare anche il contatto con utensili usati per le arachidi? Chiedo alla cucina ingredienti e preparazione. Aspettiamo la loro risposta prima di ordinare.'],
        ['Il ristorante non può confermare gli ingredienti. Abbiamo un’altra opzione?',
          'Cerchiamo un’alternativa. Le propongo di contattare un altro locale e di chiedere direttamente come preparano il piatto prima di scegliere.']
      ]
    },
    {
      id: 'access', time: '13:15', title: 'Nhịp đi và nhu cầu hỗ trợ', lesson: 47,
      task: 'Hỏi khách cần gì, trao đổi riêng nếu phù hợp. Xác nhận đoạn có bậc, chỗ nghỉ hoặc tuyến thay thế. Chốt thời gian và cách báo lại cho đoàn.',
      followUps: ['Se mia madre si ferma, come ci raggiunge dopo?', 'Possiamo aspettare al coperto durante la pausa?'],
      cases: [
        ['Mia madre fa fatica a camminare a lungo. Ci sono molte scale nella prossima tappa?',
          'Controllo quanti gradini ci sono e se c’è un accesso alternativo. Preferite fare una breve sosta mentre verifico? Vi confermo poi quale percorso è più adatto.'],
        ['Io vorrei proseguire, ma alcuni del gruppo hanno bisogno di una pausa.',
          'Organizziamo una breve sosta e fissiamo un punto in cui ritrovarci. Prima di dividerci, confermo con tutti il percorso, l’orario e chi li accompagnerà.']
      ]
    },
    {
      id: 'weather', time: '14:00', title: 'Mưa hoặc sự cố buộc đổi tuyến', lesson: 46,
      task: 'Nêu việc đã biết, điều sẽ kiểm và hai lựa chọn khả thi. Xác nhận lại điểm hẹn, thời lượng, chi phí nếu có và giờ cập nhật.',
      followUps: ['Possiamo portare gli ombrelli nella sala?', 'Dobbiamo avvisare noi l’albergo del nuovo orario?'],
      cases: [
        ['Con questa pioggia preferiremmo stare al coperto. Il programma cambia?',
          'Verifico con l’organizzazione se possiamo sostituire la tappa all’aperto con una visita al coperto. Vi confermo entro le quattordici e quindici il nuovo punto d’incontro e gli eventuali costi.'],
        ['Se cambiamo percorso, riusciremo comunque a rientrare entro le cinque?',
          'Controllo i tempi di trasferimento. Se il rientro entro le cinque è prioritario, possiamo valutare un percorso più breve. Vi aggiorno appena confermo il mezzo.']
      ]
    },
    {
      id: 'price', time: '14:45', title: 'Giá, khoản phát sinh và cách thanh toán', lesson: 32,
      task: 'Xác nhận đồng tiền và giá mỗi người hay mỗi đoàn. Tách phần đã bao gồm, khoản trả riêng và điều chưa xác minh.',
      followUps: ['Possiamo pagare separatamente l’ingresso?', 'Chi ci confermerà l’importo prima del pagamento?'],
      cases: [
        ['I 120 euro sono a persona o per tutto il gruppo? L’ingresso è compreso?',
          'Nel vostro preventivo, i 120 euro si riferiscono all’intero gruppo. L’ingresso si paga a parte. Prima di confermare, verifico anche quale modalità di pagamento è disponibile.'],
        ['Ci hanno chiesto un supplemento. Era previsto nella conferma?',
          'Controlliamo insieme la conferma e la voce del supplemento. Le dico quale servizio è compreso e chiedo all’operatore di verificare la differenza.']
      ]
    },
    {
      id: 'complaint', time: '15:15', title: 'Phàn nàn và yêu cầu hoàn tiền', lesson: 43,
      task: 'Ghi nhận vấn đề, hỏi chi tiết, làm việc trong phạm vi được giao và hẹn mốc phản hồi. Tra điều khoản trước khi xác nhận hoàn tiền.',
      followUps: ['Se non ha una risposta oggi, quando possiamo aspettarci un aggiornamento?', 'Possiamo parlarne in albergo, dopo il rientro?'],
      cases: [
        ['Abbiamo aspettato mezz’ora e abbiamo perso una tappa. Possiamo avere un rimborso?',
          'Mi dispiace per l’attesa. Mi conferma quale tappa avete perso? Verifico con l’operatore il programma e le condizioni della prenotazione. Vi do un primo aggiornamento prima del rientro.'],
        ['Preferirei non parlarne davanti agli altri. Possiamo sentirci dopo?',
          'Certamente. Possiamo parlarne in privato dopo la visita. Mi dica quale canale preferisce per ricevere un aggiornamento.']
      ]
    },
    {
      id: 'help', time: '16:00', title: 'Yêu cầu hỗ trợ khi có sự cố', lesson: 45,
      task: 'Xác nhận vị trí, chuyện vừa xảy ra và người cần hỗ trợ. Báo điều phối hoặc yêu cầu hỗ trợ khẩn cấp theo quy trình khi cần. Nói rõ việc bạn đang làm.',
      followUps: ['Come facciamo a farci trovare da chi viene ad aiutarci?', 'Chi rimane qui con il resto del gruppo?'],
      cases: [
        ['Un signore del gruppo si sente male e ha bisogno di aiuto. Siamo vicino all’uscita.',
          'Mi conferma vicino a quale uscita siete e che cosa è successo? Chiedo subito assistenza e avviso l’organizzazione. Le dico dove far arrivare chi deve intervenire.'],
        ['Una persona manca all’appello e non risponde al telefono.',
          'Verifico subito dove e quando l’abbiamo vista l’ultima volta. Avviso il coordinatore. Il resto del gruppo resta al punto d’incontro mentre ci organizziamo.']
      ]
    },
    {
      id: 'farewell', time: '16:30', title: 'Trả khách, tiễn đoàn và bàn giao', lesson: 52,
      task: 'Xác nhận điểm trả, kiểm đoàn đã đủ, nhắc đồ cá nhân. Hỏi một nhận xét và ghi việc còn phải theo dõi.',
      followUps: ['Se l’autista trova la borsa più tardi, chi mi contatterà?', 'Nel riepilogo può indicare anche quali luoghi si visitano senza biglietto?'],
      cases: [
        ['Ci lasciate davanti all’albergo o al punto di partenza? Credo di aver lasciato una borsa sul mezzo.',
          'Il rientro previsto è davanti all’albergo. Verifico subito con l’autista se ha trovato la borsa. Mi può descrivere com’è fatta? Vi aggiorno prima di salutarci.'],
        ['Grazie per la visita. Possiamo ricevere un riepilogo dei luoghi che abbiamo visto?',
          'Certo. Vi mando il riepilogo tramite il canale concordato. Prima di salutarci, c’è un momento del percorso che vi è piaciuto particolarmente?']
      ]
    }
  ];

  function create(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function action(text, callback, primary = false) {
    const button = create('button', text, primary ? 'study-primary' : 'secondary');
    button.type = 'button';
    button.addEventListener('click', callback);
    return button;
  }

  function savedField(container, logs, key, labelText) {
    const field = create('textarea');
    field.id = 'tour-day-' + key;
    field.value = logs[key] || '';
    field.rows = 3;
    const label = create('label', labelText);
    label.htmlFor = field.id;
    const status = create('small');
    status.setAttribute('role', 'status');
    field.addEventListener('input', () => {
      logs[key] = field.value;
      try {
        save();
        status.textContent = 'Đã lưu trên thiết bị này.';
      } catch {
        status.textContent = 'Không lưu được trên thiết bị này.';
      }
    });
    container.append(label, field, status);
  }

  function scenarioCard(scenario, logs) {
    const box = create('details', '', 'lp-panel');
    box.append(create('summary', scenario.time + ' · ' + scenario.title), create('p', scenario.task));
    const actions = create('div', '', 'study-actions');
    const speechStatus = create('small');
    speechStatus.setAttribute('role', 'status');
    const prompt = create('details', '', 'study-disclosure');
    const guest = create('p');
    guest.lang = 'it';
    prompt.append(create('summary', 'Xem lời khách'), guest);
    const answer = create('details', '', 'study-disclosure');
    const sample = create('p');
    sample.lang = 'it';
    answer.append(create('summary', 'Mở phản hồi mẫu sau khi đã trả lời'), sample);
    const followUp = create('details', '', 'study-disclosure');
    const nextPrompt = create('details', '', 'study-disclosure');
    const nextGuest = create('p');
    nextGuest.lang = 'it';
    nextPrompt.append(create('summary', 'Xem lời khách ở lượt 2'), nextGuest);
    let version = 0;
    function showCase(next) {
      if (next !== version) window.speechSynthesis?.cancel();
      version = next;
      guest.textContent = scenario.cases[version][0];
      sample.textContent = scenario.cases[version][1];
      nextGuest.textContent = scenario.followUps[version];
      prompt.open = false;
      answer.open = false;
      followUp.open = false;
      nextPrompt.open = false;
      speechStatus.textContent = version ? 'Đã chuyển sang tình huống bất ngờ.' : '';
    }
    const hear = (rate, text = scenario.cases[version][0]) => {
      speechStatus.textContent = 'Giọng đọc của thiết bị.';
      say(text, rate, () => {
        speechStatus.textContent = 'Không phát được âm thanh. Bạn có thể mở lời khách và luyện cùng người đối thoại.';
      });
    };
    actions.append(action('Nghe câu khách', () => hear(0.95), true),
      action('Nghe chậm', () => hear(0.72)),
      action('Đổi tình huống', () => showCase(1 - version)));
    followUp.append(create('summary', 'Lượt 2 · Khách hỏi tiếp'),
      action('Nghe câu hỏi tiếp', () => hear(0.95, scenario.followUps[version]), true), nextPrompt);
    showCase(0);
    box.append(actions, speechStatus, prompt, followUp);
    savedField(box, logs, scenario.id, 'Câu trả lời của bạn hoặc nhận xét khi tập nói');
    box.append(answer);
    const lesson = create('a', 'Ôn bài ' + scenario.lesson, 'study-text-link');
    lesson.href = '#bai/I' + scenario.lesson;
    box.append(lesson);
    return { box, showCase };
  }

  function showTourDay() {
    const logs = state.tourDayNotes ||= {};
    const page = create('div', '', 'lp-page');
    page.innerHTML = '<h1>Luyện dẫn tour tiếng Ý cả ngày</h1>' +
      '<p>Đi qua một lịch tour giả lập từ đón khách đến tiễn đoàn. Với mỗi chặng, nghe câu khách, trả lời thành tiếng rồi xử lý câu hỏi tiếp. Sau đó mới mở mẫu để đối chiếu.</p>' +
      '<p>Nếu đang lấy lại phản xạ, luyện ba chặng đón khách, trò chuyện và tập hợp đoàn trước. Mỗi lượt, thử hỏi lại một chi tiết, trả lời ngắn rồi hỏi khách một câu hoặc xác nhận bước tiếp theo.</p>' +
      '<p class="lp-muted">Khi tập cùng người đối thoại, nhờ họ đổi chi tiết, hỏi nối hoặc ngắt lời. Xen lúc thuyết minh với lúc để khách quan sát, hỏi và nghỉ. Giờ trên màn hình là giờ của lịch mẫu.</p>';
    const cards = scenarios.map(scenario => scenarioCard(scenario, logs));
    let last = -1;
    page.append(action('Bốc tình huống bất ngờ', () => {
      let index = Math.floor(Math.random() * (cards.length - (last >= 0 ? 1 : 0)));
      if (last >= 0 && index >= last) index++;
      last = index;
      const selected = cards[index];
      selected.showCase(1);
      selected.box.open = true;
      const heading = selected.box.querySelector('summary');
      heading.focus({ preventScroll: true });
      selected.box.scrollIntoView({ block: 'start' });
    }, true));
    for (const card of cards) page.append(card.box);

    const rehearsal = create('section', '', 'lp-panel');
    rehearsal.innerHTML = '<h2>Thử với người nói tiếng Ý</h2>' +
      '<ol><li><strong>60–90 phút.</strong> Dẫn 2–3 điểm, trò chuyện lúc di chuyển và xử lý một câu hỏi chưa chuẩn bị.</li>' +
      '<li><strong>3–4 giờ.</strong> Thêm giờ nghỉ, bữa ăn hoặc đổi một chặng. Nhờ người đối thoại đưa hai tình huống bất ngờ.</li>' +
      '<li><strong>6–8 giờ.</strong> Dẫn thử theo giờ thật, có di chuyển và nghỉ. Tập ít nhất 8 lượt tương tác rải từ sáng tới chiều, gồm câu hỏi nối, điều phối giờ/điểm hẹn và một sự cố cần chuyển điều phối.</li></ol>' +
      '<h3>Tiêu chí tổng duyệt của app</h3><p>Dùng bản đồ, lịch và số liệu làm ghi chú. Tự nói từng lượt. Người đóng vai khách hiểu và nhắc lại đúng giờ, điểm hẹn và chi phí đã chốt. Bạn hỏi lại được khi nghe thiếu, trả lời theo nguồn hoặc hẹn xác minh, và báo đúng người khi có sự cố. Cuối ngày vẫn trao đổi rõ ràng và hoàn thành việc còn treo.</p>' +
      '<p>Chọn ít nhất ba chặng sáng, trưa và chiều để người đối thoại nhận xét về nghe hiểu, độ dễ hiểu, cách xử lý phát sinh và nhịp dẫn. Ghi một ví dụ cụ thể cho mỗi nhận xét.</p>' +
      '<p><a href="#bai/I58/11">Mở chỗ ghi âm và tải bản ghi ở bài 58</a> · <a href="#tot-nghiep">Mở hồ sơ thực hành</a></p>';
    savedField(rehearsal, logs, 'rehearsal', 'Minh chứng buổi tập. Ghi thời lượng, nhận xét và việc cần luyện lại.');
    page.append(rehearsal);

    const references = create('section', '', 'lp-panel');
    references.innerHTML = '<h2>Nghe giọng thật và đối chiếu điều kiện hành nghề</h2>' +
      '<p>Nghe hội thoại thật rồi kể lại chi tiết bằng lời của bạn. Dùng mô tả tương tác B2 của CEFR làm mốc tham khảo khi tập với người nói tiếng Ý.</p>' +
      '<ul><li><a href="https://www.raiscuola.rai.it/percorsi/livellob1" target="_blank" rel="noopener">Rai Scuola · Các bài nghe tiếng Ý B1</a></li>' +
      '<li><a href="https://www.raiscuola.rai.it/italianoperstranieri/articoli/2021/06/Per-usare-litaliano-a-tavola-a2870992-9eba-46f6-adf9-efda575d5364.html" target="_blank" rel="noopener">Rai Scuola · Tiếng Ý trong bữa ăn</a></li>' +
      '<li><a href="https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale" target="_blank" rel="noopener">Hội đồng châu Âu · Mô tả CEFR</a></li></ul>' +
      '<p>Để hành nghề hướng dẫn khách quốc tế tại Việt Nam, đối chiếu riêng thẻ hướng dẫn viên, giấy tờ nghiệp vụ, ngoại ngữ và điều kiện hành nghề. Bằng ngành tiếng Ý phù hợp có thể dùng làm một trong các loại giấy tờ chứng minh ngoại ngữ.</p>' +
      '<p><a href="https://vpcp.dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-hanh-chinh.html?ma_thu_tuc=1.004628" target="_blank" rel="noopener">Cổng Dịch vụ công Quốc gia · Cấp thẻ hướng dẫn viên du lịch quốc tế</a></p>';
    page.append(references);
    root.append(page);
  }

  window.ItalianTourDay = { show: showTourDay };
})();
