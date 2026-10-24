/* =========================================================
   Komagene QR – istatistik + cinsiyet seçimi + çerez bildirimi
   index.html ve hediye.html'in en altında yüklenir.
   Hiçbir hata siteyi bozmaz: her şey try/catch içinde.
   Sonuçları görmek için: panel.html
   ========================================================= */
(function () {
  "use strict";

  // panel.html'deki ile AYNI olmalı
  var NS = "kmg-camlitepe-q7x2";
  var API = "https://abacus.jasoncameron.dev/hit/" + NS + "/";

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  // Panelden "bu cihazı sayma" denmişse hiçbir şey sayılmaz
  var sayma = ls("kmgSayma") === "1";
  var onay = ls("kmgCerez"); // "kabul" | "red" | null

  function say(anahtar) {
    if (sayma) return;
    try { fetch(API + anahtar, { mode: "cors", keepalive: true, cache: "no-store" }).catch(function () {}); } catch (e) {}
  }
  function bugun() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }

  var hediyeSayfasi = !!document.querySelector(".secim[data-c]");
  var mod = window.ACILIS_MODU || (hediyeSayfasi ? "hediye" : "diger");

  /* ---------- 1) QR okutma ---------- */
  // index.html → hediye.html yönlendirmesi aynı sekmede olduğu için bir okutma bir kez sayılır
  if (!ss("kmgOkutma")) {
    ss("kmgOkutma", "1");
    say("okutma");
    say("gun-" + bugun());
    say("mod-" + mod);
    // Tekil kişi: cihazda iz bırakır, sadece çerez onayı varsa
    if (onay === "kabul" && !ls("kmgTekil")) { ls("kmgTekil", "1"); say("tekil"); }
  }

  /* ---------- 2) Tıklamalar (Google, Yemeksepeti, WhatsApp...) ---------- */
  function hedefAdi(el) {
    if (el.id === "whatsappBtn" || el.id === "sikayet") return "whatsapp";
    if (el.id === "yineGoogle") return "google";
    var h = (el.getAttribute && el.getAttribute("href")) || "";
    if (/google\./.test(h)) return "google";
    if (/yemeksepeti/.test(h)) return "yemeksepeti";
    if (/trendyol/.test(h)) return "trendyol";
    if (/migros/.test(h)) return "migros";
    if (/wa\.me|whatsapp/.test(h)) return "whatsapp";
    return null;
  }
  document.addEventListener("click", function (e) {
    try {
      var el = e.target.closest && e.target.closest("a, button");
      if (!el) return;
      var ad = hedefAdi(el);
      if (!ad) return;
      say("tik-" + ad);
      say("tiklama");
      if (!ss("kmgTikladi")) { ss("kmgTikladi", "1"); say("tiklayan"); say("tgun-" + bugun()); }
    } catch (err) {}
  }, true);

  /* ---------- 3) Cinsiyet ---------- */
  function cinsiyetSay(c) { // "erkek" | "kiz" | "bos"
    if (ls("kmgCins") || ss("kmgCins")) return; // aynı kişi iki kez sayılmasın
    (onay === "kabul" ? ls : ss)("kmgCins", c);
    say("cins-" + c);
  }

  var stil = document.createElement("style");
  stil.textContent = [
    ".kmg-ort{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;",
    "background:rgba(43,10,16,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);animation:kmgGir .25s ease-out}",
    ".kmg-kart{width:100%;max-width:360px;background:#fff7ea;color:#2b1a14;border-radius:26px;padding:26px 20px 18px;text-align:center;",
    "box-shadow:0 24px 60px -20px rgba(0,0,0,.6);font-family:'Nunito',system-ui,sans-serif;animation:kmgKalk .35s cubic-bezier(.2,.9,.3,1.2)}",
    ".kmg-kart h2{font-family:'Baloo 2','Nunito',sans-serif;font-weight:800;font-size:26px;line-height:1.1;color:#c8102e;margin:0 0 6px}",
    ".kmg-kart p{font-size:15px;color:#7a5e52;margin:0 0 18px}",
    ".kmg-sec{display:grid;grid-template-columns:1fr 1fr;gap:12px}",
    ".kmg-sec button{border:0;border-radius:18px;padding:18px 8px 14px;font:800 17px 'Nunito',sans-serif;cursor:pointer;color:#fff;",
    "display:flex;flex-direction:column;align-items:center;gap:6px;transition:transform .12s}",
    ".kmg-sec button:active{transform:scale(.95)}",
    ".kmg-sec .e{background:#2563eb;box-shadow:0 6px 0 #1e40af}.kmg-sec .k{background:#e8508a;box-shadow:0 6px 0 #b8336a}",
    ".kmg-sec span{font-size:40px;line-height:1}",
    ".kmg-gec{margin-top:16px;background:none;border:0;color:#7a5e52;font:700 13px 'Nunito',sans-serif;text-decoration:underline;cursor:pointer;padding:6px}",
    ".kmg-cerez{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:460px;margin:0 auto;background:#1c1412;color:#f5ede6;",
    "border-radius:18px;padding:14px 14px 12px;font:500 13px/1.45 system-ui,sans-serif;box-shadow:0 14px 40px -12px rgba(0,0,0,.6);animation:kmgKalk .35s ease-out}",
    ".kmg-cerez a{color:#ffd23f;cursor:pointer;text-decoration:underline}",
    ".kmg-cerez .b{display:flex;gap:8px;margin-top:10px}",
    ".kmg-cerez button{flex:1;border:0;border-radius:12px;padding:10px;font:700 14px system-ui,sans-serif;cursor:pointer}",
    ".kmg-cerez .ok{background:#ffd23f;color:#2b1a14}.kmg-cerez .no{background:rgba(255,255,255,.12);color:#f5ede6}",
    ".kmg-pol{max-width:420px;text-align:left;max-height:80vh;overflow:auto}",
    ".kmg-pol h2{font-size:22px}.kmg-pol h3{font:800 14px 'Nunito',sans-serif;margin:14px 0 4px;color:#2b1a14}",
    ".kmg-pol p,.kmg-pol li{font-size:13px;color:#5a463e;margin:0 0 6px}.kmg-pol ul{padding-left:18px}",
    ".kmg-pol .kapat{display:block;width:100%;margin-top:14px;border:0;border-radius:14px;padding:12px;background:#c8102e;color:#fff;font:800 15px 'Nunito',sans-serif;cursor:pointer}",
    "@keyframes kmgGir{from{opacity:0}}@keyframes kmgKalk{from{opacity:0;transform:translateY(16px) scale(.97)}}",
    "@media (prefers-reduced-motion:reduce){.kmg-ort,.kmg-kart,.kmg-cerez{animation:none}}"
  ].join("");
  document.head.appendChild(stil);

  function cinsiyetEkrani(sonra) {
    var o = document.createElement("div");
    o.className = "kmg-ort";
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-modal", "true");
    o.innerHTML =
      '<div class="kmg-kart">' +
      '<h2>Hoş geldin! 👋</h2>' +
      '<p>Başlamadan önce söyler misin?</p>' +
      '<div class="kmg-sec">' +
      '<button type="button" class="e" data-c="erkek"><span>👨</span>Erkek</button>' +
      '<button type="button" class="k" data-c="kiz"><span>👩</span>Kız</button>' +
      '</div>' +
      '<button type="button" class="kmg-gec" data-c="bos">Söylemek istemiyorum</button>' +
      '</div>';
    o.addEventListener("click", function (e) {
      var b = e.target.closest("[data-c]");
      if (!b) return;
      cinsiyetSay(b.getAttribute("data-c"));
      if (navigator.vibrate) try { navigator.vibrate(12); } catch (x) {}
      o.style.transition = "opacity .2s"; o.style.opacity = "0";
      setTimeout(function () { o.remove(); sonra && sonra(); }, 200);
    });
    document.body.appendChild(o);
  }

  /* ---------- 4) Çerez bildirimi + gizlilik metni ---------- */
  function politika() {
    var o = document.createElement("div");
    o.className = "kmg-ort";
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-modal", "true");
    o.innerHTML =
      '<div class="kmg-kart kmg-pol">' +
      '<h2>Gizlilik ve Çerez Politikası</h2>' +
      '<p>Bu sayfa, sipariş sonrası memnuniyetini öğrenmek için hazırlanmıştır. 6698 sayılı KVKK kapsamında seni bilgilendirmek isteriz.</p>' +
      '<h3>Hangi bilgileri topluyoruz?</h3>' +
      '<ul><li>Sayfanın kaç kez açıldığı ve hangi butonlara (Google, Yemeksepeti, WhatsApp vb.) tıklandığı – yalnızca <b>toplam sayı</b> olarak.</li>' +
      '<li>İstersen seçtiğin cinsiyet – yalnızca toplam sayı olarak.</li></ul>' +
      '<h3>Neleri toplamıyoruz?</h3>' +
      '<p>Adın, telefon numaran, konumun, IP adresin veya seni tanımlayacak herhangi bir bilgi bizim tarafımızdan kaydedilmez. Reklam ve takip çerezi kullanılmaz, veriler kimseyle paylaşılmaz veya satılmaz.</p>' +
      '<h3>Tarayıcında ne saklanır?</h3>' +
      '<ul><li><b>Zorunlu:</b> çerez tercihin ve en son gösterilen sayfa tasarımı.</li>' +
      '<li><b>İstatistik (onay verirsen):</b> aynı kişiyi iki kez saymamak için küçük bir işaret.</li></ul>' +
      '<p>Sayım, ücretsiz bir sayaç hizmeti (abacus.jasoncameron.dev) üzerinden yapılır; bu hizmet teknik olarak bağlantı bilgisini görebilir.</p>' +
      '<h3>Hakların</h3>' +
      '<p>Tercihini istediğin zaman değiştirebilirsin: tarayıcının site verilerini silmen yeterlidir. Yorum yaptığın Google, Yemeksepeti vb. platformlar kendi gizlilik politikalarına tabidir.</p>' +
      '<button type="button" class="kapat">Anladım</button>' +
      '</div>';
    o.addEventListener("click", function (e) { if (e.target === o || e.target.closest(".kapat")) o.remove(); });
    document.body.appendChild(o);
  }

  function cerezBandi() {
    if (onay) return;
    var b = document.createElement("div");
    b.className = "kmg-cerez";
    b.setAttribute("role", "region");
    b.setAttribute("aria-label", "Çerez bildirimi");
    b.innerHTML =
      '🍪 Sana daha iyi bir deneyim sunmak için çerez kullanıyoruz. <a data-p>Detaylar</a>' +
      '<div class="b"><button type="button" class="no">Reddet</button><button type="button" class="ok">Kabul et</button></div>';
    b.addEventListener("click", function (e) {
      if (e.target.closest("[data-p]")) { politika(); return; }
      var ok = e.target.closest(".ok"), no = e.target.closest(".no");
      if (!ok && !no) return;
      onay = ok ? "kabul" : "red";
      ls("kmgCerez", onay);
      if (ok) {
        if (!ls("kmgTekil")) { ls("kmgTekil", "1"); say("tekil"); }
        var c = ss("kmgCins"); if (c) ls("kmgCins", c);
      }
      say("cerez-" + onay);
      b.remove();
    });
    document.body.appendChild(b);
  }

  /* ---------- Başlat ---------- */
  try {
    if (hediyeSayfasi) {
      // hediye.html'in kendi "Hanımefendi / Beyefendi" seçimi var: tekrar sormuyoruz, onu sayıyoruz
      document.querySelectorAll(".secim[data-c]").forEach(function (b) {
        b.addEventListener("click", function () { cinsiyetSay(b.getAttribute("data-c") === "kadin" ? "kiz" : "erkek"); });
      });
      var s = document.getElementById("surpriz");
      if (s) s.addEventListener("click", function () { cinsiyetSay("bos"); });
      cerezBandi();
    } else if (!(ls("kmgCins") || ss("kmgCins"))) {
      cinsiyetEkrani(cerezBandi);
    } else {
      cerezBandi();
    }
  } catch (e) {}
})();
