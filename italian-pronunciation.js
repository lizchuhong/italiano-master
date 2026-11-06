/* Lesson speech practice. Recordings stay in this browser; optional recognition uses the browser's speech service. */
(function () {
  'use strict';

  const listeners = new Set();
  let active;
  let database;

  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function button(text, action, primary = false) {
    const control = node('button', text, primary ? 'study-primary' : 'secondary');
    control.type = 'button';
    control.addEventListener('click', action);
    return control;
  }

  function words(text) {
    return text.normalize('NFC')
      .replace(/(\p{L})\s*['’]\s*(?=\p{L})/gu, "$1'")
      .match(/\p{L}+(?:'\p{L}+)*|\d+/gu) || [];
  }

  const wordKey = text => text.toLocaleLowerCase('it').normalize('NFD').replace(/\p{M}/gu, '');

  function phraseFor(item) {
    const text = item.sections.find(section => section.sampleText)?.sampleText || '';
    const phrases = (text.match(/[^.!?]+[.!?]*/g) || [])
      .map(phrase => phrase.trim())
      .filter(phrase => !/^(?:Errore|Motivo)\s*:/i.test(phrase))
      .map(phrase => phrase.replace(/^(?:Ospite|Guida|Oggetto|H1|Introduzione|CTA|Domanda|Risposta|Prima|Dopo|Titolo|Correzione)\s*:\s*/i, ''))
      .filter(phrase => !/\d/.test(phrase) && words(phrase).length >= 3);
    const noPlace = phrase => !/\b(?:Hanoi|Hue|Hoi An|Hoan Kiem|Ninh Binh|Vietnam)\b/i.test(phrase);
    return phrases.find(phrase => noPlace(phrase) && words(phrase).length >= 6) ||
      phrases.find(noPlace) || phrases[0] || text;
  }

  function matchWords(expected, transcript) {
    const target = words(expected);
    const heard = words(transcript).map(wordKey);
    const keys = target.map(wordKey);
    // A matching sequence keeps one extra or missed word from shifting the rest of the feedback.
    const grid = Array.from({ length: keys.length + 1 }, () => new Uint16Array(heard.length + 1));
    for (let i = keys.length - 1; i >= 0; i--) {
      for (let j = heard.length - 1; j >= 0; j--) {
        grid[i][j] = keys[i] === heard[j] ? 1 + grid[i + 1][j + 1] : Math.max(grid[i + 1][j], grid[i][j + 1]);
      }
    }
    const matched = new Set();
    let i = 0;
    let j = 0;
    while (i < keys.length && j < heard.length) {
      if (keys[i] === heard[j]) {
        matched.add(i++);
        j++;
      } else if (grid[i + 1][j] >= grid[i][j + 1]) {
        i++;
      } else {
        j++;
      }
    }
    return { count: matched.size, total: target.length, retry: [...new Set(target.filter((_, index) => !matched.has(index)))] };
  }

  function withClips(mode, operation) {
    database ||= new Promise((resolve, reject) => {
      const request = indexedDB.open('italiano-master-recordings', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('latest');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Recording database blocked'));
    });
    return database.then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction('latest', mode);
      const request = operation(transaction.objectStore('latest'));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error);
      transaction.onerror = () => reject(transaction.error);
    }));
  }

  function updateEntry(lesson, value) {
    (state.pronunciation ||= {})[lesson] = value;
    try {
      save();
      return true;
    } catch {
      return false;
    }
  }

  function speak(text, rate, status) {
    status.textContent = '';
    say(text, rate, () => {
      status.textContent = 'Thiết bị chưa phát được mẫu tiếng Ý. Bạn vẫn có thể đọc và nghe lại bản thu.';
    });
  }

  function speechError(code) {
    const messages = {
      'no-speech': 'Trình duyệt chưa bắt được lời. Nghe lại bản thu rồi thử đọc chậm và rõ hơn.',
      'audio-capture': 'Trình duyệt chưa lấy được âm thanh để đối chiếu.',
      'not-allowed': 'Trình duyệt chưa cho phép nhận diện giọng nói.',
      'service-not-allowed': 'Dịch vụ nhận diện của trình duyệt đang tắt.',
      'language-not-supported': 'Dịch vụ nhận diện trên thiết bị chưa hỗ trợ tiếng Ý.',
      network: 'Dịch vụ nhận diện đang mất kết nối. Bạn vẫn nghe lại được bản thu.',
      timeout: 'Dịch vụ nhận diện chưa trả kết quả. Bạn vẫn nghe lại được bản thu.'
    };
    return messages[code] || 'Chưa có kết quả đối chiếu. Bạn có thể nghe lại bản thu và tự đánh giá.';
  }

  function microphoneError(error) {
    if (['NotAllowedError', 'SecurityError'].includes(error.name)) {
      return 'Hãy cấp quyền micro cho Italiano Master trong trình duyệt rồi thử lại.';
    }
    if (error.name === 'NotFoundError') return 'Chưa tìm thấy micro trên thiết bị.';
    if (error.name === 'NotReadableError') return 'Micro đang bận hoặc trình duyệt chưa mở được. Thử kiểm tra thiết bị âm thanh.';
    return 'Chưa bắt đầu được bản ghi. Thử kiểm tra micro rồi thu lại.';
  }

  function recorderPanel(lesson, { phrase, onClip, onResult } = {}) {
    const guided = Boolean(phrase);
    const box = node('div', '', 'study-recorder');
    const controls = node('div', '', 'study-actions');
    const status = node('p', '', 'study-muted speech-status');
    status.setAttribute('role', 'status');
    const playback = node('audio');
    playback.controls = true;
    playback.hidden = true;
    playback.setAttribute('aria-label', guided ? 'Nghe lại bản thu câu mẫu' : 'Nghe lại bản ghi');
    const download = node('a', guided ? 'Tải bản thu câu mẫu' : 'Tải bản ghi', 'secondary');
    download.hidden = true;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const supported = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
    const record = button(guided ? 'Thu câu mẫu' : 'Bắt đầu ghi âm', () => toggle(false), true);
    const check = guided && SpeechRecognition ? button('Thu và đối chiếu từ', () => toggle(true)) : null;
    const erase = guided ? button('Xóa bản thu', removeClip) : null;
    const files = node('div', '', 'study-actions speech-files');
    if (!guided) {
      record.id = 'recbtn';
      status.id = 'recstatus';
      playback.id = 'playback';
      download.id = 'rec-download';
      box.append(node('h4', 'Ghi âm để nghe lại'),
        node('p', 'Tự nói một lượt, nghe lại và sửa một điểm trước khi nói lần hai. Bạn có thể tải bản ghi để lưu minh chứng.'));
    }
    if (guided && supported) {
      box.append(node('p', check
        ? 'Khi chọn thu và đối chiếu, trình duyệt có thể xử lý giọng nói qua dịch vụ trực tuyến.'
        : 'Thu giọng rồi dùng các gợi ý bên dưới để tự đối chiếu.'));
      box.append(node('p', 'App giữ bản thu câu mẫu mới nhất của bài trên trình duyệt này. Mỗi lượt tối đa 30 giây.', 'study-muted'));
    }
    controls.append(record);
    if (check) controls.append(check);
    files.append(download);
    if (erase) {
      erase.hidden = true;
      files.append(erase);
    }
    box.append(controls, status, playback, files);

    let task;
    let currentUrl;
    let disposed = false;
    let clipChanged = false;
    let erasing = false;

    if (!supported) status.textContent = 'Thiết bị chưa hỗ trợ ghi âm trong app. Bạn có thể nghe mẫu và dùng mục tự đối chiếu.';
    refreshButtons();
    if (guided && supported) {
      withClips('readonly', store => store.get(lesson)).then(saved => {
        if (!disposed && !clipChanged && saved?.phrase === phrase && saved.blob?.size) {
          showClip(saved.blob);
        }
      }).catch(() => {});
    }

    function refreshButtons() {
      const recording = task?.phase === 'recording';
      record.textContent = recording ? guided ? 'Dừng thu câu mẫu' : 'Dừng ghi âm' :
        guided ? 'Thu câu mẫu' : currentUrl ? 'Ghi âm lại' : 'Bắt đầu ghi âm';
      record.disabled = !supported || erasing || Boolean(task && !recording);
      if (check) check.disabled = !supported || erasing || Boolean(task);
      if (erase) erase.disabled = erasing || Boolean(task);
    }

    function clearClip() {
      if (!currentUrl) return;
      playback.pause();
      playback.removeAttribute('src');
      playback.load();
      URL.revokeObjectURL(currentUrl);
      currentUrl = undefined;
      download.removeAttribute('href');
      playback.hidden = true;
      download.hidden = true;
      if (erase) erase.hidden = true;
    }

    function showClip(blob) {
      clearClip();
      currentUrl = URL.createObjectURL(blob);
      playback.src = currentUrl;
      playback.hidden = false;
      const format = blob.type.match(/^audio\/([a-z0-9]+)/i)?.[1];
      download.href = currentUrl;
      download.download = 'italiano-bai-' + lesson + (guided ? '-phat-am' : '') +
        '.' + (format === 'mp4' ? 'm4a' : format || 'audio');
      download.hidden = false;
      if (erase) erase.hidden = false;
      refreshButtons();
    }

    async function removeClip() {
      if (task || erasing) return;
      erasing = true;
      clipChanged = true;
      refreshButtons();
      try {
        await withClips('readwrite', store => store.delete(lesson));
        if (disposed) return;
        clearClip();
        status.textContent = 'Đã xóa bản thu trên thiết bị này.';
      } catch {
        status.textContent = 'Chưa xóa được bản thu đã lưu. Thử lại.';
      } finally {
        erasing = false;
        refreshButtons();
      }
    }

    function releaseInput(current) {
      current.input?.getTracks().forEach(track => track.stop());
    }

    function endTask(current) {
      clearTimeout(current.limit);
      clearTimeout(current.wait);
      releaseInput(current);
      if (active === current) active = undefined;
      if (task === current) task = undefined;
      refreshButtons();
    }

    function cancel() {
      const current = task;
      if (!current) return;
      endTask(current);
      try { current.recognition?.abort(); } catch {}
      if (current.recorder?.state === 'recording') current.recorder.stop();
    }

    function complete(current) {
      if (task !== current || !current.recorded || !current.recognized) return;
      const transcript = current.parts.join(' ').trim().slice(0, 700);
      status.textContent = current.blob.size
        ? 'Đã thu xong. Bạn có thể nghe lại và tải bản ghi.'
        : 'Bản ghi chưa có dữ liệu. Thử thu lại và nói trọn câu.';
      endTask(current);
      if (current.blob.size) onResult?.(transcript, current.message);
    }

    function recognize(current) {
      try {
        const engine = new SpeechRecognition();
        current.recognition = engine;
        engine.lang = 'it-IT';
        engine.continuous = true;
        engine.interimResults = false;
        engine.onstart = () => {
          if (task === current && current.phase === 'recording') {
            status.textContent = 'Đang ghi âm và nhận diện. Bạn có thể đọc câu mẫu.';
          }
        };
        engine.onresult = event => {
          for (let index = event.resultIndex; index < event.results.length; index++) {
            const result = event.results[index];
            if (result.isFinal && result[0]) current.parts[index] = result[0].transcript;
          }
        };
        engine.onerror = event => {
          current.message = speechError(event.error);
        };
        engine.onend = () => {
          current.recognized = true;
          if (task === current && current.phase === 'recording') {
            status.textContent = 'Đang ghi âm. Bấm dừng khi đọc xong.';
          }
          complete(current);
        };
        engine.start(current.input.getAudioTracks()[0]);
      } catch {
        current.recognized = true;
        current.message = speechError();
        status.textContent = 'Đang ghi âm để nghe lại.';
      }
    }

    function stop(current) {
      if (task !== current || current.phase !== 'recording') return;
      current.phase = 'finishing';
      refreshButtons();
      status.textContent = current.recognized ? 'Đang lưu bản thu…' : 'Đang lưu bản thu và đối chiếu từ…';
      if (!current.recognized) {
        current.wait = setTimeout(() => {
          if (task !== current) return;
          current.message = speechError('timeout');
          current.recognized = true;
          try { current.recognition?.abort(); } catch {}
          complete(current);
        }, 5500);
        try { current.recognition.stop(); } catch {}
      }
      if (current.recorder.state === 'recording') current.recorder.stop();
    }

    async function toggle(automatic) {
      if (task?.phase === 'recording') {
        stop(task);
        return;
      }
      if (task || !supported) return;
      if (active) {
        status.textContent = 'Hãy dừng lượt thu đang chạy trong bài rồi bắt đầu lượt mới.';
        return;
      }
      const offline = automatic && navigator.onLine === false;
      const current = { phase: 'opening', parts: [], recognized: !automatic || offline, cancel };
      if (offline) current.message = 'Bạn đang offline. Hãy nghe lại bản thu và dùng các mục tự đối chiếu.';
      task = active = current;
      refreshButtons();
      status.textContent = 'Đang mở micro…';
      playback.pause();
      window.speechSynthesis?.cancel();

      try {
        current.input = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (task !== current || disposed) {
          releaseInput(current);
          return;
        }
        const session = new MediaRecorder(current.input);
        const chunks = [];
        current.recorder = session;
        session.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
        session.onerror = () => {
          if (task !== current) return;
          cancel();
          status.textContent = 'Bản ghi bị gián đoạn. Bạn có thể thu lại.';
        };
        session.onstop = () => {
          if (task !== current) return;
          if (current.phase === 'recording') stop(current);
          releaseInput(current);
          current.blob = new Blob(chunks, { type: session.mimeType || chunks[0]?.type });
          current.recorded = true;
          if (current.blob.size) {
            clipChanged = true;
            showClip(current.blob);
            onClip?.(current.blob);
          }
          complete(current);
        };
        session.start();
        current.phase = 'recording';
        status.textContent = current.recognized ? 'Đang ghi âm…' : 'Đang bật nhận diện. Chờ báo sẵn sàng rồi đọc.';
        if (!current.recognized) recognize(current);
        if (guided) current.limit = setTimeout(() => stop(current), 30000);
        refreshButtons();
      } catch (error) {
        if (task !== current) return;
        endTask(current);
        status.textContent = microphoneError(error);
      }
    }

    listeners.add(() => {
      disposed = true;
      cancel();
      clearClip();
    });
    return box;
  }

  function practicePanel(item) {
    const phrase = phraseFor(item);
    const lesson = item.number;
    const box = node('section', '', 'study-part speech-practice');
    const title = node('h3', 'Ghi âm và luyện phát âm', 'study-part-heading');
    const sample = node('p', phrase, 'speech-phrase');
    sample.lang = 'it';
    const speechStatus = node('p', '', 'study-muted speech-status');
    speechStatus.setAttribute('role', 'status');
    const actions = node('div', '', 'study-actions');
    actions.append(button('Nghe câu luyện', () => speak(phrase, 0.9, speechStatus)),
      button('Nghe câu luyện chậm', () => speak(phrase, 0.68, speechStatus)));
    box.append(title, sample, actions, speechStatus);

    const result = node('div', '', 'speech-feedback');
    result.setAttribute('role', 'status');
    result.hidden = true;
    const storageStatus = node('small', '', 'speech-status');
    storageStatus.setAttribute('role', 'status');
    const saved = state.pronunciation?.[lesson];
    const feedback = saved?.phrase === phrase ? saved : {};

    function showResult(transcript, message) {
      result.replaceChildren();
      result.hidden = false;
      if (!transcript) {
        result.append(node('p', message || 'Nghe lại bản thu và tự đối chiếu theo các gợi ý dưới đây.'));
        return;
      }
      const match = matchWords(phrase, transcript);
      result.append(node('h4', 'Đối chiếu lời đọc'),
        node('p', 'Khớp ' + match.count + '/' + match.total + ' từ theo thứ tự trong câu mẫu.'));
      const heard = node('p', transcript, 'speech-heard');
      heard.lang = 'it';
      result.append(node('p', 'Trình duyệt nghe được'), heard);
      if (message) result.append(node('p', message));
      if (match.retry.length) {
        result.append(node('p', 'Nghe và đọc lại các từ chưa khớp.'));
        const retry = node('div', '', 'study-actions');
        for (const word of match.retry) {
          const play = button(word, () => speak(word, 0.68, speechStatus));
          play.lang = 'it';
          play.setAttribute('aria-label', 'Nghe từ ' + word);
          retry.append(play);
        }
        result.append(retry);
      }
      result.append(node('small', 'So khớp từ phản ánh điều trình duyệt nghe được. Dùng bản thu và giọng mẫu để tự kiểm trọng âm, âm và nhịp câu.'));
    }

    const recorder = recorderPanel(lesson, {
      phrase,
      onClip(blob) {
        feedback.phrase = phrase;
        feedback.recorded = true;
        feedback.transcript = '';
        result.hidden = true;
        storageStatus.textContent = updateEntry(lesson, feedback) ? '' : 'Chưa lưu được tiến độ trên trình duyệt này.';
        withClips('readwrite', store => store.put({ phrase, blob }, lesson)).catch(() => {
          if (box.isConnected) storageStatus.textContent = 'Chưa lưu được tệp âm thanh. Bạn có thể tải bản thu để giữ lại.';
        });
      },
      onResult(transcript, message) {
        if (transcript) {
          feedback.transcript = transcript;
          if (!updateEntry(lesson, feedback)) {
            storageStatus.textContent = 'Chưa lưu được kết quả trên trình duyệt này.';
          }
        }
        showResult(transcript, message);
      }
    });
    box.append(recorder, result, storageStatus);
    if (feedback.transcript) showResult(feedback.transcript);

    const compare = node('details', '', 'study-disclosure speech-compare');
    const doubles = [...new Set(words(phrase).filter(word => /([bdflmnprstv])\1/i.test(word)))];
    compare.append(node('summary', 'Tự đánh giá sau khi nghe lại'),
      node('p', 'Nghe câu mẫu rồi nghe bản thu một lượt. Chọn một điểm cần chỉnh và thu lại câu.'));
    const criteria = [
      ['rhythm', 'Trọng âm và chỗ ngắt gần với câu mẫu.'],
      ['endings', 'Nghe rõ âm cuối và từng cụm từ.'],
      ['focus', doubles.length ? 'Nghe rõ phụ âm đôi trong ' + doubles.join(', ') + '.' : 'Nghe rõ từ chính trong câu khi nói ở tốc độ tự nhiên.']
    ];
    const checkList = node('div', '', 'speech-checks');
    const note = node('textarea');
    note.id = 'speech-note-' + lesson;
    note.rows = 2;
    note.maxLength = 1500;
    note.value = feedback.note || '';
    const noteLabel = node('label', 'Điểm mình sẽ sửa ở lượt sau');
    noteLabel.htmlFor = note.id;
    const saveStatus = node('small');
    saveStatus.setAttribute('role', 'status');
    const saveFeedback = () => {
      feedback.phrase = phrase;
      saveStatus.textContent = updateEntry(lesson, feedback) ? 'Đã lưu theo bài.' : 'Chưa lưu được tự đánh giá.';
    };
    for (const [key, labelText] of criteria) {
      const label = node('label', '', 'lp-option');
      const check = node('input');
      check.type = 'checkbox';
      check.checked = Boolean(feedback.checks?.[key]);
      check.addEventListener('change', () => {
        (feedback.checks ||= {})[key] = check.checked;
        saveFeedback();
      });
      label.append(check, document.createTextNode(labelText));
      checkList.append(label);
    }
    note.addEventListener('input', () => {
      feedback.note = note.value;
      saveFeedback();
    });
    compare.append(checkList, noteLabel, note, saveStatus);
    box.append(compare);
    return box;
  }

  function progress(number) {
    const entry = state.pronunciation?.[number];
    if (!entry?.recorded && !entry?.note?.trim() && !Object.values(entry?.checks || {}).some(Boolean)) return '';
    const checks = Object.values(entry.checks || {}).filter(Boolean).length;
    return 'Phát âm · ' + (entry.recorded ? 'Đã thu câu mẫu. ' : '') + checks + '/3 mục tự đối chiếu.';
  }

  function dispose() {
    for (const cleanup of listeners) cleanup();
    listeners.clear();
  }

  window.addEventListener('pagehide', () => active?.cancel());
  window.ItalianPronunciation = { practicePanel, recorderPanel, progress, dispose };
})();
