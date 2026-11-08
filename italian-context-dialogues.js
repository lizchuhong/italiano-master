/* Situations are fictional language practice, not confirmed itinerary, prices, or policies. */
(function () {
  'use strict';
  const rows = {
    19: [
      ['Ospite', 'Come possiamo conoscere la storia di questo luogo?', 'Làm sao chúng ta có thể tìm hiểu lịch sử nơi này?'],
      ['Guida', 'Partiamo da ciò che vediamo; poi distingueremo le fonti dalle interpretazioni.', 'Ta bắt đầu từ điều nhìn thấy, rồi phân biệt nguồn tư liệu với phần diễn giải.'],
      ['Ospite', 'E le storie tramandate?', 'Còn những câu chuyện truyền miệng thì sao?'],
      ['Guida', 'Le presenterò come racconti, senza confonderle con fatti documentati.', 'Tôi sẽ giới thiệu chúng là những câu chuyện, không nhầm với sự kiện có tư liệu.']
    ],
    20: [
      ['Ospite', 'Che cosa è cambiato nel tempo?', 'Theo thời gian, điều gì đã thay đổi?'],
      ['Guida', 'All’inizio il luogo aveva una funzione; in seguito il suo uso è cambiato.', 'Ban đầu nơi này có một công năng; về sau cách sử dụng đã thay đổi.'],
      ['Ospite', 'E oggi?', 'Còn ngày nay?'],
      ['Guida', 'Oggi possiamo osservarlo così. Per le date precise controllerò la fonte.', 'Ngày nay ta có thể quan sát như thế này. Tôi sẽ kiểm nguồn để nói ngày tháng chính xác.']
    ],
    21: [
      ['Ospite', 'Come convivono tradizione e vita moderna?', 'Truyền thống và cuộc sống hiện đại cùng tồn tại thế nào?'],
      ['Guida', 'Da una parte si conservano alcune attività; dall’altra cambiano i bisogni degli abitanti.', 'Một mặt một số hoạt động được duy trì; mặt khác nhu cầu của cư dân thay đổi.'],
      ['Ospite', 'Può fare un esempio?', 'Bạn có thể cho một ví dụ không?'],
      ['Guida', 'Osserviamo questa bottega e chiediamo al proprietario che cosa produce oggi.', 'Ta hãy quan sát cửa hàng này và hỏi chủ cửa hàng hiện họ làm gì.']
    ],
    22: [
      ['Ospite', 'Che cosa vediamo al centro del lago?', 'Ta thấy gì ở giữa hồ?'],
      ['Guida', 'Da questa riva si vede la Torre della Tartaruga.', 'Từ bờ này có thể thấy Tháp Rùa.'],
      ['Ospite', 'Il nome del lago è legato a una storia?', 'Tên hồ có gắn với một câu chuyện không?'],
      ['Guida', 'Secondo la leggenda, è legato alla restituzione di una spada.', 'Theo truyền thuyết, tên hồ gắn với việc trả lại một thanh kiếm.']
    ],
    23: [
      ['Ospite', 'In quale anno è stato restaurato?', 'Nơi này được trùng tu năm nào?'],
      ['Guida', 'Mi chiede l’anno del restauro, giusto?', 'Quý khách hỏi năm trùng tu, đúng không ạ?'],
      ['Ospite', 'Sì, esatto.', 'Vâng, đúng vậy.'],
      ['Guida', 'Non ricordo l’anno con certezza. Controllo la fonte e le rispondo dopo.', 'Tôi không nhớ chắc năm đó. Tôi sẽ kiểm tra nguồn rồi trả lời quý khách sau.']
    ],
    24: [
      ['Ospite', 'Che cosa sono queste steli?', 'Những tấm bia này là gì?'],
      ['Guida', 'Sono steli di pietra con iscrizioni: testi incisi sulla superficie.', 'Đó là các bia đá có văn khắc: những chữ được khắc trên bề mặt.'],
      ['Ospite', 'Perché sono importanti?', 'Tại sao chúng quan trọng?'],
      ['Guida', 'Aiutano a raccontare la storia degli esami; per i dettagli consultiamo la fonte del sito.', 'Chúng giúp kể về lịch sử thi cử; ta sẽ xem nguồn của địa điểm để biết chi tiết.']
    ],
    25: [
      ['Ospite', 'Dove ci fermiamo per osservare il quartiere?', 'Chúng ta dừng ở đâu để quan sát khu phố?'],
      ['Guida', 'Restiamo sul marciapiede davanti alla bottega, senza bloccare il passaggio.', 'Ta ở trên vỉa hè trước cửa hàng, không chặn lối đi.'],
      ['Ospite', 'Possiamo vedere come lavorano?', 'Chúng tôi có thể xem họ làm việc không?'],
      ['Guida', 'Possiamo chiedere il permesso; poi attraverseremo insieme.', 'Ta có thể xin phép; sau đó cả đoàn sẽ cùng qua đường.']
    ],
    26: [
      ['Ospite', 'Sono allergico alle arachidi. Questo piatto le contiene?', 'Tôi dị ứng lạc. Món này có lạc không?'],
      ['Guida', 'Non posso garantirlo senza verificare. Chiederò al ristorante gli ingredienti e il rischio di contaminazione crociata.', 'Tôi không thể bảo đảm nếu chưa kiểm tra. Tôi sẽ hỏi nhà hàng về thành phần và nguy cơ nhiễm chéo.'],
      ['Ospite', 'Grazie. C’è un’alternativa?', 'Cảm ơn. Có món thay thế không?'],
      ['Guida', 'Chiederò anche quali alternative possono preparare per lei.', 'Tôi cũng sẽ hỏi họ có thể chuẩn bị lựa chọn thay thế nào cho quý khách.']
    ],
    27: [
      ['Ospite', 'È sempre così nelle famiglie vietnamite?', 'Gia đình Việt Nam nào cũng như vậy à?'],
      ['Guida', 'Le abitudini variano. In alcune famiglie può accadere, ma non in tutte.', 'Thói quen khác nhau. Điều đó có thể xảy ra ở một số gia đình, nhưng không phải tất cả.'],
      ['Ospite', 'E qui che cosa è opportuno fare?', 'Vậy ở đây nên làm gì?'],
      ['Guida', 'Possiamo chiedere alla persona che ci ospita, senza dare nulla per scontato.', 'Ta có thể hỏi người đón tiếp, thay vì tự mặc định.']
    ],
    28: [
      ['Ospite', 'Quanto durerà questa prova di tour?', 'Buổi dẫn thử này kéo dài bao lâu?'],
      ['Guida', 'Nel nostro esercizio dura trenta minuti, compresi gli spostamenti.', 'Trong bài tập này là 30 phút, bao gồm thời gian di chuyển.'],
      ['Ospite', 'Quando potremo fare domande?', 'Khi nào chúng tôi có thể đặt câu hỏi?'],
      ['Guida', 'Anche durante il percorso; ho previsto alcuni minuti alla fine.', 'Cả trong lúc đi; tôi cũng đã dành vài phút cuối.']
    ],
    29: [
      ['Cliente', 'Il tour è disponibile per quattro persone?', 'Tour còn chỗ cho bốn người không?'],
      ['Operatrice', 'Può indicarmi la data? Verificherò la disponibilità prima di confermarla.', 'Quý khách cho tôi biết ngày được không? Tôi sẽ kiểm tra trước khi xác nhận còn chỗ.'],
      ['Cliente', 'Vorrei anche sapere il punto d’incontro.', 'Tôi cũng muốn biết điểm hẹn.'],
      ['Operatrice', 'Lo inserirò nel riepilogo, insieme ai servizi e alle condizioni confermati.', 'Tôi sẽ đưa vào bản tóm tắt cùng dịch vụ và điều kiện đã xác nhận.']
    ],
    30: [
      ['Cliente', 'Posso annullare senza penale?', 'Tôi có thể hủy không mất phí không?'],
      ['Operatrice', 'Controllo le condizioni della sua prenotazione prima di rispondere.', 'Tôi kiểm tra điều kiện của đặt chỗ trước khi trả lời.'],
      ['Cliente', 'Quale orario fa fede?', 'Giờ nào được dùng làm mốc?'],
      ['Operatrice', 'Le confermerò la scadenza e il fuso orario indicati nelle condizioni.', 'Tôi sẽ xác nhận hạn chót và múi giờ ghi trong điều kiện.']
    ],
    31: [
      ['Cliente', 'Possiamo spostare l’orario in cui passate a prenderci alle nove?', 'Có thể chuyển giờ đón sang 9 giờ không?'],
      ['Operatrice', 'Verifico con il servizio di trasporto e le confermo se è possibile.', 'Tôi sẽ kiểm tra với bên vận chuyển và xác nhận có thể hay không.'],
      ['Cliente', 'Cambierà il punto d’incontro?', 'Điểm hẹn có thay đổi không?'],
      ['Operatrice', 'Le invierò un riepilogo con ora e luogo dopo la conferma.', 'Sau khi xác nhận, tôi sẽ gửi lại bản tóm tắt giờ và địa điểm.']
    ],
    32: [
      ['Cliente', 'Il prezzo è per persona o per gruppo?', 'Giá tính mỗi người hay mỗi đoàn?'],
      ['Operatrice', 'Nell’esempio è per gruppo; specifichiamo sempre il numero di partecipanti.', 'Trong ví dụ này, giá tính mỗi đoàn; ta luôn ghi rõ số người tham gia.'],
      ['Cliente', 'I biglietti sono inclusi?', 'Giá đã gồm vé chưa?'],
      ['Operatrice', 'In questa simulazione sono esclusi. Prima di inviare un preventivo reale controllerò i servizi inclusi.', 'Trong bài mô phỏng này vé chưa gồm. Trước khi gửi báo giá thật tôi sẽ kiểm tra dịch vụ bao gồm.']
    ],
    33: [
      ['Cliente', 'Come capisco se questo tour fa per me?', 'Làm sao tôi biết tour này có phù hợp không?'],
      ['Operatrice', 'La pagina indica durata, percorso e tipo di esperienza.', 'Trang ghi thời lượng, tuyến đi và loại trải nghiệm.'],
      ['Cliente', 'Dove trovo il punto d’incontro?', 'Tôi tìm điểm hẹn ở đâu?'],
      ['Operatrice', 'Nella sezione pratica; se non è ancora definito, lo indichiamo chiaramente.', 'Trong mục thông tin thực tế; nếu chưa xác định, chúng tôi sẽ ghi rõ.']
    ],
    34: [
      ['Cliente', 'Il tour è adatto ai bambini?', 'Tour có phù hợp với trẻ em không?'],
      ['Operatrice', 'Dipende dal percorso e dalle esigenze della famiglia. Mi dice l’età dei bambini?', 'Còn tùy tuyến và nhu cầu gia đình. Quý khách cho tôi biết độ tuổi của các bé được không?'],
      ['Cliente', 'Dove posso trovare queste informazioni?', 'Tôi tìm thông tin này ở đâu?'],
      ['Operatrice', 'La FAQ dovrebbe indicare ciò che è confermato e come chiedere assistenza.', 'FAQ nên nêu thông tin đã xác nhận và cách liên hệ để được hỗ trợ.']
    ],
    35: [
      ['Redattrice', 'Quale domanda deve soddisfare questa pagina?', 'Trang này cần trả lời câu hỏi nào?'],
      ['Collega', 'Come prenotare una visita in italiano e che cosa comprende.', 'Cách đặt chuyến tham quan bằng tiếng Ý và tour bao gồm gì.'],
      ['Redattrice', 'Basta ripetere molte volte la stessa parola?', 'Chỉ cần lặp lại cùng một từ nhiều lần là đủ à?'],
      ['Collega', 'No. Organizziamo contenuti utili e controlliamo che i dettagli siano corretti.', 'Không. Ta sắp xếp nội dung hữu ích và kiểm tra chi tiết chính xác.']
    ],
    36: [
      ['Ospite', 'Come descriverebbe questa passeggiata?', 'Bạn sẽ mô tả chuyến đi bộ này thế nào?'],
      ['Guida', 'Cominciamo da un dettaglio osservabile, poi spieghiamo che cosa faremo.', 'Ta bắt đầu bằng một chi tiết có thể quan sát, rồi giải thích sẽ làm gì.'],
      ['Ospite', 'Possiamo promettere una visita a un laboratorio?', 'Có thể hứa sẽ thăm một xưởng không?'],
      ['Guida', 'Solo dopo aver verificato accesso e disponibilità per quella data.', 'Chỉ sau khi kiểm tra quyền vào và tình trạng sẵn có cho ngày đó.']
    ],
    37: [
      ['Ospite', 'Chi ha costruito questo edificio?', 'Ai đã xây tòa nhà này?'],
      ['Guida', 'Vuole sapere chi ne ha curato la costruzione?', 'Quý khách muốn biết ai phụ trách xây dựng, đúng không ạ?'],
      ['Ospite', 'Sì, e quando.', 'Vâng, và khi nào nữa.'],
      ['Guida', 'Non ho questi dati verificati. Li controllo e torno sulla domanda.', 'Tôi chưa có dữ liệu đã xác minh. Tôi sẽ kiểm tra và quay lại câu hỏi.']
    ],
    38: [
      ['Ospite', 'Che cosa comprende la prova di oggi?', 'Buổi kiểm tra hôm nay gồm những gì?'],
      ['Guida', 'Nel nostro esercizio presento un percorso di quarantacinque minuti e rispondo alle domande.', 'Trong bài tập này tôi trình bày tuyến 45 phút và trả lời câu hỏi.'],
      ['Ospite', 'Come controlla i dettagli commerciali?', 'Bạn kiểm tra chi tiết thương mại như thế nào?'],
      ['Guida', 'Li confronto con il riepilogo e segnalo ciò che devo ancora verificare.', 'Tôi đối chiếu với bản tóm tắt và đánh dấu những gì còn cần xác minh.']
    ],
    39: [
      ['Ospite', 'Può raccontarcelo senza leggere?', 'Bạn có thể kể mà không đọc không?'],
      ['Guida', 'Sì. Uso poche parole chiave per ricordare l’ordine dei punti.', 'Được. Tôi dùng vài từ khóa để nhớ thứ tự các ý.'],
      ['Ospite', 'E se dimentica un dettaglio?', 'Nếu bạn quên một chi tiết thì sao?'],
      ['Guida', 'Spiego ciò che ricordo con certezza e verifico il resto.', 'Tôi giải thích điều nhớ chắc và kiểm tra phần còn lại.']
    ],
    40: [
      ['Ospite', 'Come passiamo dal monumento alla vita del quartiere?', 'Làm sao chuyển từ di tích sang đời sống khu phố?'],
      ['Guida', 'Dopo aver osservato il monumento, vediamo come viene vissuta oggi questa zona.', 'Sau khi quan sát di tích, ta xem khu vực này hiện được sử dụng thế nào.'],
      ['Ospite', 'E il prossimo punto?', 'Còn điểm tiếp theo?'],
      ['Guida', 'Ora ci spostiamo verso il luogo successivo, dove approfondiremo un altro aspetto.', 'Bây giờ ta chuyển tới điểm tiếp theo để tìm hiểu một khía cạnh khác.']
    ],
    41: [
      ['Ospite', 'Quale dettaglio dovremmo osservare?', 'Chúng tôi nên quan sát chi tiết nào?'],
      ['Guida', 'Guardate la forma dell’ingresso e il modo in cui si apre sul cortile.', 'Hãy nhìn hình dáng lối vào và cách nó mở ra sân.'],
      ['Ospite', 'Che cosa significa?', 'Điều đó có nghĩa gì?'],
      ['Guida', 'Possiamo descrivere ciò che vediamo; per il significato storico controllerò la fonte.', 'Ta có thể mô tả điều nhìn thấy; tôi sẽ kiểm nguồn cho ý nghĩa lịch sử.']
    ],
    42: [
      ['Ospite', 'Come si chiama quell’oggetto?', 'Vật kia tên là gì?'],
      ['Guida', 'Mi sfugge il nome; è un oggetto che serve per misurare.', 'Tôi tạm quên tên; đó là một vật dùng để đo.'],
      ['Ospite', 'Può mostrarci come funziona?', 'Bạn có thể cho xem nó hoạt động thế nào không?'],
      ['Guida', 'Chiediamo a chi lavora qui e verifichiamo anche il nome.', 'Ta hãy hỏi người làm việc ở đây và kiểm tra cả tên gọi.']
    ],
    43: [
      ['Ospite', 'Abbiamo aspettato molto al punto d’incontro.', 'Chúng tôi đã chờ rất lâu ở điểm hẹn.'],
      ['Guida', 'Mi dispiace per l’attesa. A che ora siete arrivati?', 'Tôi rất tiếc vì đã để quý khách chờ. Quý khách đến lúc mấy giờ ạ?'],
      ['Ospite', 'Alle otto e trenta.', 'Lúc 8 giờ 30.'],
      ['Guida', 'Verifico l’orario con l’ufficio e le do un aggiornamento.', 'Tôi sẽ kiểm tra giờ với văn phòng và cập nhật cho quý khách.']
    ],
    44: [
      ['Ospite', 'Possiamo cambiare percorso?', 'Chúng ta có thể đổi tuyến không?'],
      ['Guida', 'Verifico tempi e disponibilità. Preferite camminare meno o visitare un altro luogo?', 'Tôi sẽ kiểm tra thời gian và tình trạng sẵn có. Quý khách muốn đi bộ ít hơn hay thăm nơi khác?'],
      ['Ospite', 'Preferiamo camminare meno.', 'Chúng tôi muốn đi bộ ít hơn.'],
      ['Guida', 'Se possibile, proporrò due alternative e spiegherò eventuali costi.', 'Nếu có thể, tôi sẽ đề xuất hai phương án và giải thích chi phí nếu có.']
    ],
    45: [
      ['Ospite', 'Il museo sarà aperto domani?', 'Bảo tàng ngày mai có mở không?'],
      ['Guida', 'Non ho ancora verificato l’orario aggiornato.', 'Tôi chưa kiểm tra giờ mở cửa được cập nhật.'],
      ['Ospite', 'Quando potrà confermarlo?', 'Khi nào bạn có thể xác nhận?'],
      ['Guida', 'Controllo il canale ufficiale e le invio un aggiornamento appena possibile.', 'Tôi sẽ kiểm tra kênh chính thức và cập nhật cho quý khách sớm nhất có thể.']
    ],
    46: [
      ['Ospite', 'Se piove, il tour si farà?', 'Nếu trời mưa thì tour có diễn ra không?'],
      ['Guida', 'Controlliamo le condizioni e le alternative disponibili.', 'Ta sẽ kiểm tra điều kiện và các phương án sẵn có.'],
      ['Ospite', 'Possiamo entrare in un museo?', 'Chúng ta có thể vào một bảo tàng không?'],
      ['Guida', 'Verifico prima apertura, trasporto e possibili costi aggiuntivi.', 'Trước tiên tôi sẽ kiểm tra giờ mở cửa, phương tiện và chi phí phát sinh có thể có.']
    ],
    47: [
      ['Ospite', 'Una persona del gruppo cammina lentamente.', 'Một người trong đoàn đi chậm.'],
      ['Guida', 'Grazie per avermelo detto. Quali pause o adattamenti sarebbero utili?', 'Cảm ơn quý khách đã cho tôi biết. Những khoảng nghỉ hay điều chỉnh nào sẽ hữu ích?'],
      ['Ospite', 'Avremmo bisogno di fermarci più spesso.', 'Chúng tôi cần dừng nghỉ thường xuyên hơn.'],
      ['Guida', 'Verifichiamo insieme il percorso e il tempo disponibile.', 'Chúng ta cùng kiểm tra tuyến đường và thời gian có thể dùng.']
    ],
    48: [
      ['Collega', 'Come organizzi i quarantacinque minuti?', 'Bạn tổ chức 45 phút như thế nào?'],
      ['Guida', 'Prevedo apertura, tappe, spostamenti, domande e un piccolo margine.', 'Tôi dành thời gian cho mở đầu, các điểm dừng, di chuyển, câu hỏi và một khoảng dự phòng.'],
      ['Collega', 'Che cosa fai se siete in ritardo?', 'Nếu đoàn bị chậm thì bạn làm gì?'],
      ['Guida', 'Accorcio un esempio secondario e mantengo le istruzioni importanti.', 'Tôi rút ngắn ví dụ phụ và giữ lại các chỉ dẫn quan trọng.']
    ],
    49: [
      ['Collega', 'Come valuti la tua prova?', 'Bạn đánh giá buổi dẫn thử thế nào?'],
      ['Guida', 'Riascolto la registrazione e segno i punti in cui esitavo.', 'Tôi nghe lại bản ghi và đánh dấu những lúc mình ngập ngừng.'],
      ['Collega', 'Che cosa controllerai oltre alla lingua?', 'Ngoài ngôn ngữ bạn sẽ kiểm tra gì?'],
      ['Guida', 'Tempi, fonti, chiarezza e risposta alle domande impreviste.', 'Thời gian, nguồn, độ rõ ràng và cách trả lời câu hỏi bất ngờ.']
    ],
    50: [
      ['Redattrice', 'A chi è destinato questo articolo?', 'Bài viết này dành cho ai?'],
      ['Collega', 'A chi cerca informazioni prima di scegliere un itinerario.', 'Cho người tìm thông tin trước khi chọn lịch trình.'],
      ['Redattrice', 'Come verifichiamo i dettagli?', 'Ta xác minh chi tiết thế nào?'],
      ['Collega', 'Con fonti affidabili e una data di controllo per le informazioni variabili.', 'Bằng nguồn đáng tin và ghi ngày kiểm tra đối với thông tin có thể thay đổi.']
    ],
    51: [
      ['Cliente', 'Qual è la differenza fra i due tour?', 'Hai tour khác nhau thế nào?'],
      ['Operatrice', 'Confrontiamo durata, percorso, servizi inclusi e condizioni confermate.', 'Ta so sánh thời lượng, tuyến đường, dịch vụ bao gồm và điều kiện đã xác nhận.'],
      ['Cliente', 'Dove vedo i costi?', 'Tôi xem chi phí ở đâu?'],
      ['Operatrice', 'Ogni pagina deve mostrare l’unità del prezzo e ciò che è escluso.', 'Mỗi trang cần nêu đơn vị tính giá và những gì không bao gồm.']
    ],
    52: [
      ['Collega', 'Qual è lo scopo di questa email?', 'Mục đích của email này là gì?'],
      ['Redattrice', 'Chiedere i dettagli necessari per preparare una proposta.', 'Hỏi những thông tin cần thiết để chuẩn bị đề xuất.'],
      ['Collega', 'Quante azioni chiediamo al lettore?', 'Ta yêu cầu người đọc làm bao nhiêu việc?'],
      ['Redattrice', 'Una principale, con un invito chiaro e informazioni coerenti.', 'Một hành động chính, với lời mời rõ ràng và thông tin nhất quán.']
    ],
    53: [
      ['Cliente', 'La visita mi è piaciuta, ma il punto d’incontro era poco chiaro.', 'Tôi thích chuyến tham quan, nhưng điểm hẹn không rõ.'],
      ['Operatrice', 'Grazie per il commento. Ci dispiace per la difficoltà al punto d’incontro.', 'Cảm ơn nhận xét của quý khách. Chúng tôi tiếc vì điểm hẹn gây khó khăn.'],
      ['Cliente', 'Potete verificare la prenotazione?', 'Các bạn có thể kiểm tra đặt chỗ không?'],
      ['Operatrice', 'Certamente. Ci scriva in privato con il riferimento, senza pubblicare dati personali qui.', 'Được ạ. Xin nhắn riêng mã tham chiếu, đừng đăng thông tin cá nhân tại đây.']
    ],
    54: [
      ['Collega', 'La pagina ha 50 clic su 1.000 impressioni. Qual è il CTR?', 'Trang có 50 lượt nhấp trên 1.000 lượt hiển thị. CTR là bao nhiêu?'],
      ['Redattrice', 'Nel nostro esempio è il 5%: cinquanta diviso mille.', 'Trong ví dụ này là 5%: 50 chia cho 1.000.'],
      ['Collega', 'Questo prova che abbiamo venduto più tour?', 'Điều đó chứng minh đã bán được nhiều tour hơn không?'],
      ['Redattrice', 'No. Per le prenotazioni serve un indicatore separato e un periodo confrontabile.', 'Không. Cần chỉ số đặt chỗ riêng và một kỳ so sánh tương đương.']
    ],
    55: [
      ['Ospite', 'Quanto dura il percorso di prova?', 'Tuyến dẫn thử kéo dài bao lâu?'],
      ['Guida', 'L’esercizio dura sessanta minuti, inclusi gli spostamenti e le pause previste.', 'Bài tập kéo dài 60 phút, gồm di chuyển và các khoảng nghỉ dự kiến.'],
      ['Ospite', 'Potremo fare domande durante la visita?', 'Chúng tôi có thể hỏi trong lúc tham quan không?'],
      ['Guida', 'Certamente; ho previsto anche un momento finale per le domande.', 'Tất nhiên; tôi cũng dành một khoảng cuối cho câu hỏi.']
    ],
    56: [
      ['Collega', 'Che cosa controlli dopo la prova generale?', 'Sau buổi tổng duyệt, bạn kiểm tra gì?'],
      ['Guida', 'Riascolto i passaggi difficili e annoto il minuto e il tipo di errore.', 'Tôi nghe lại các đoạn khó và ghi phút cùng loại lỗi.'],
      ['Collega', 'Come decidi che cosa correggere prima?', 'Bạn quyết định sửa gì trước thế nào?'],
      ['Guida', 'Parto dagli errori ripetuti che influenzano chiarezza e comprensione.', 'Tôi bắt đầu từ lỗi lặp ảnh hưởng đến độ rõ ràng và khả năng hiểu.']
    ],
    57: [
      ['Collega', 'Quale frase vuoi correggere?', 'Bạn muốn sửa câu nào?'],
      ['Guida', 'Ho detto “ci sono un mercato”; la forma corretta è “c’è un mercato”.', 'Tôi đã nói “ci sono un mercato”; dạng đúng là “c’è un mercato”.'],
      ['Collega', 'E con due mercati?', 'Còn với hai khu chợ?'],
      ['Guida', 'Dico “ci sono due mercati”: cambiano il verbo e il numero del nome.', 'Tôi nói “ci sono due mercati”: động từ và số của danh từ thay đổi.']
    ],
    58: [
      ['Ospite', 'Siamo arrivati alla fine del percorso?', 'Chúng ta đã đến cuối hành trình chưa?'],
      ['Guida', 'Sì. Prima di salutarci, riprendiamo le vostre domande.', 'Vâng. Trước khi chào tạm biệt, chúng ta cùng quay lại các câu hỏi của quý khách.'],
      ['Ospite', 'Può verificare un dettaglio e inviarcelo dopo?', 'Bạn có thể kiểm tra một chi tiết và gửi sau không?'],
      ['Guida', 'Certamente. Lo controllo nella fonte appropriata e vi aggiorno.', 'Tất nhiên. Tôi sẽ kiểm tra nguồn phù hợp và cập nhật cho quý khách.']
    ]
  };

  for (const lesson of window.CURRICULUM?.lessons || []) {
    const dialogue = rows[lesson.number];
    const section = lesson.sections?.[10];
    if (!dialogue || !section) continue;
    section.guideLabel = 'Hội thoại mẫu theo chủ đề';
    section.blocks = [
      {type:'text', text:'Tình huống luyện tập giả lập. Tự trả lời trước, sau đó đọc theo vai và điều chỉnh thông tin theo dữ kiện đã xác minh.'},
      {type:'table', rows:[['Vai', 'Italiano', 'Tiếng Việt'], ...dialogue]},
      {type:'text', text:'Tập lại hai lượt: đổi vai, sau đó trả lời không nhìn mẫu. Với giá, giờ, điều kiện và lịch sử, kiểm tra nguồn thực tế trước khi dùng với khách.'}
    ];
    section.sampleText = dialogue.map(line => line[1]).join(' ');
    section.isReferenceDialogue = true;
    section.sources = lesson.sections?.[1]?.sources || [];
    if (lesson.number === 22) section.sources = [
      ...section.sources,
      ['Cục Di sản văn hóa · Hồ Hoàn Kiếm và đền Ngọc Sơn', 'https://dsvh.gov.vn/di-tich-lich-su-va-danh-lam-thang-canh-ho-hoan-kiem-va-den-ngoc-son-2978']
    ];
    const videos = {
      24: 'Video 360° bổ trợ để quan sát Văn Miếu của Vietnam Tourism Board; dùng nguồn UNESCO trong bài để kiểm chứng tư liệu lịch sử: https://www.youtube.com/watch?v=m7M5fvpdK2g',
      26: 'Video bổ trợ: hội thoại gọi món bằng tiếng Ý (WowPodcast Italian). Về dị ứng, vẫn phải xác nhận trực tiếp với nhà hàng: https://www.youtube.com/watch?v=Lcm54TlsKNk',
      29: 'Video bổ trợ: cách viết email trang trọng và thân mật bằng tiếng Ý (Teacher Stefano): https://www.youtube.com/watch?v=-a_lMR3eIBY',
      39: 'Video bổ trợ: Lucrezia hướng dẫn tư duy trực tiếp bằng tiếng Ý; dùng để luyện phản xạ, không thay thế bài nói trong app: https://www.youtube.com/watch?v=vaZiZ8KKhao',
      42: 'Video bổ trợ: Lucrezia hướng dẫn tư duy trực tiếp bằng tiếng Ý; sau khi xem, thực hành diễn đạt vòng trong bài: https://www.youtube.com/watch?v=vaZiZ8KKhao',
      52: 'Video bổ trợ: cách viết email trang trọng và thân mật bằng tiếng Ý (Teacher Stefano): https://www.youtube.com/watch?v=-a_lMR3eIBY',
      54: 'Video bổ trợ bằng tiếng Anh của Google Search Central về báo cáo hiệu suất Search Console: https://www.youtube.com/watch?v=5LF6SwB5jZ0'
    };
    if (videos[lesson.number]) {
      const listening = lesson.sections?.[4];
      if (listening) {
        listening.blocks = listening.blocks.filter(block => !/chưa có URL video/i.test(block.text || ''));
        listening.blocks.push({type:'text', text:videos[lesson.number]});
      }
    }
  }
})();
