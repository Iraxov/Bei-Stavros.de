(function () {
'use strict';
/*
  Jedes Modul läuft für sich in safe(). Fällt eines aus, laufen alle anderen weiter.
  Ohne JavaScript bleibt die Seite vollständig lesbar: Inhalte stehen fertig im HTML.
*/
var doc = document;
var root = doc.documentElement;
root.className += ' js';

function $(s, r) { return (r || doc).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
function safe(name, fn, onFail) {
  try { fn(); }
  catch (e) {
    try { console.error('Modul "' + name + '" ist ausgefallen:', e); } catch (_) { /* keine Konsole */ }
    if (onFail) { try { onFail(); } catch (_) { /* nichts mehr zu tun */ } }
  }
}
function fold(s) {
  return String(s).toLowerCase().replace(/ß/g, 'ss').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');
}
var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ===== Seitenmenü ===== */
function drawer() {
  var d = $('#drawer'), bg = $('#drawerbg'), b = $('#burger'), x = $('#drawerx');
  if (!d || !bg || !b || !x) return;
  function fokussierbar() {
    return $$('a[href],button:not([disabled])', d).filter(function (el) { return el.offsetParent !== null; });
  }
  function setMenu(o) {
    var was = d.classList.contains('on');
    if (o === was) return;
    d.classList.toggle('on', o);
    bg.classList.toggle('on', o);
    b.setAttribute('aria-expanded', o ? 'true' : 'false');
    root.classList.toggle('lock', o);
    Array.prototype.forEach.call(doc.body.children, function (el) {
      if (el === d || el === bg || el.tagName === 'SCRIPT') return;
      if (o) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
    if (o) x.focus({ preventScroll: true }); else b.focus({ preventScroll: true });
  }
  b.addEventListener('click', function () { setMenu(!d.classList.contains('on')); });
  bg.addEventListener('click', function () { setMenu(false); });
  x.addEventListener('click', function () { setMenu(false); });
  d.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  doc.addEventListener('keydown', function (e) {
    if (!d.classList.contains('on')) return;
    if (e.key === 'Escape') { setMenu(false); return; }
    if (e.key !== 'Tab') return;
    var f = fokussierbar();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(min-width: 860px)');
    var zu = function (e) { if (e.matches) setMenu(false); };
    if (mq.addEventListener) mq.addEventListener('change', zu); else if (mq.addListener) mq.addListener(zu);
  }
}

/* ===== Einblenden beim Scrollen (mit Notausgang: nichts bleibt unsichtbar) ===== */
function revealAll() { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }
function reveal() {
  var els = $$('.rv');
  if (!els.length) return;
  if (!('IntersectionObserver' in window) || reduce) { revealAll(); return; }
  var gestartet = false;
  var io = new IntersectionObserver(function (es) {
    gestartet = true;
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
  setTimeout(function () { if (!gestartet) revealAll(); }, 2500);
}

/* ===== Öffnungszeiten: heutigen Tag markieren (Zeitzone Deutschland) ===== */
function hours() {
  var w = $('#hours');
  if (!w) return;
  var d = null;
  try {
    var s = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Europe/Berlin' }).format(new Date());
    d = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[s];
  } catch (e) { d = null; }
  if (d === null || d === undefined) d = new Date().getDay();
  var t = $('[data-d="' + d + '"]', w);
  if (t) {
    t.classList.add('today');
    t.setAttribute('aria-current', 'date');
    var n = $('span', t);
    if (n && !$('.heute', t)) {
      var h = doc.createElement('span');
      h.className = 'heute';
      h.textContent = 'Heute';
      n.appendChild(doc.createTextNode(' '));
      n.appendChild(h);
    }
  }
}

/* ===== Feier-Kasten ===== */
function events() {
  var dataEl = $('#ev-data');
  if (!dataEl) return;
  var D = JSON.parse(dataEl.textContent);
  var list = D && D.anlaesse ? D.anlaesse : [];
  if (!list.length) return;
  var h = $('#ev-h'), t = $('#ev-t'), mail = $('#ev-mail'), label = $('#ev-l');
  var tags = $$('[data-ev]');
  var byId = {};
  list.forEach(function (e) { byId[e.id] = e; });
  function body(e) {
    return D.anrede + '\r\n\r\n' + String(D.einleitung).replace('{anlass}', e.n) + '\r\n\r\n' + e.b + '\r\n\r\n' +
      D.termin + '\r\n' + D.gaeste + '\r\n\r\n' + D.bitte + '\r\n\r\n' + D.gruss + '\r\n' + D.name;
  }
  function set(k) {
    var e = byId[k];
    if (!e) return;
    if (h && e.h) h.textContent = e.h;
    if (t && e.t) t.textContent = e.t;
    tags.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-ev') === k ? 'true' : 'false'); });
    if (mail && D.mail) mail.href = 'mailto:' + D.mail + '?subject=' + encodeURIComponent(e.s) + '&body=' + encodeURIComponent(body(e));
  }
  tags.forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () { set(b.getAttribute('data-ev')); });
  });
  if (label) label.hidden = false;
  var m = new Date().getMonth();
  var def = (m === 10 || m === 11) ? 'weihnachten' : (m === 2 || m === 3) ? 'ostern' : m === 4 ? 'muttertag' : 'familie';
  set(byId[def] ? def : list[0].id);
}

 /* ===== Google-Karte: nur nach Klick ===== */
function karte() {
  var mb = $('#mapbox');
  if (!mb || !$('#loadmap', mb)) return;
  var KEY = 'stavros_karte';
  var reset = $('#c-reset');
  var idle = mb.innerHTML;
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function put(v) { try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch (e) { /* Speicher gesperrt */ } }
  function load() {
    if ($('iframe', mb)) return;
    var src = mb.getAttribute('data-embed');
    if (!src) return;
    var f = doc.createElement('iframe');
    f.title = mb.getAttribute('data-title') || 'Karte';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.setAttribute('allowfullscreen', '');
    f.src = src;
    mb.textContent = '';
    mb.appendChild(f);
    if (reset) reset.hidden = false;
  }
  function bind() {
    var b = $('#loadmap', mb);
    if (!b) return;
    b.hidden = false;
    b.addEventListener('click', function () { put('yes'); load(); });
  }
  bind();
  if (reset) reset.addEventListener('click', function () {
    put(null);
    mb.innerHTML = idle;
    bind();
    reset.hidden = true;
  });
  if (get() === 'yes') load();
}

/* ===== Galerie: Bildansicht ===== */
function galerie() {
  var dlg = $('#lb'), links = $$('[data-lb]');
  if (!dlg || !links.length || typeof dlg.showModal !== 'function') return;
  var img = $('img', dlg), cap = $('figcaption', dlg), prev = $('.prev', dlg), next = $('.next', dlg);
  var cur = 0;
  function show(i) {
    cur = (i + links.length) % links.length;
    var a = links[cur], im = $('img', a), fc = a.parentNode ? $('figcaption', a.parentNode) : null;
    img.src = a.getAttribute('href');
    img.alt = im ? im.alt : '';
    cap.textContent = fc ? fc.textContent : '';
  }
  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
      root.classList.add('lock');
      dlg.showModal();
    });
  });
  if (links.length < 2) { prev.hidden = true; next.hidden = true; }
  prev.addEventListener('click', function () { show(cur - 1); });
  next.addEventListener('click', function () { show(cur + 1); });
  $('[data-lbclose]', dlg).addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { root.classList.remove('lock'); img.removeAttribute('src'); });
  dlg.addEventListener('keydown', function (e) {
    if (links.length < 2) return;
    if (e.key === 'ArrowLeft') show(cur - 1);
    else if (e.key === 'ArrowRight') show(cur + 1);
  });
}

/* ===== Speisekarte: Aufklappen, Suche, Kategorien ===== */
function menue() {
  var list = $('#mlist');
  if (!list) return;
  var arts = $$('.cat', list);
  if (!arts.length) return;
  var panels = arts.map(function (a) { return $('.cpanel', a); });
  var heads = arts.map(function (a) { return $('.chead', a); });
  var items = arts.map(function (a) { return $$('.it', a); });
  var chipsEl = $('#chips');
  var byId = {};
  arts.forEach(function (a, i) { byId[a.id] = i; });
  var chipOf = [];
  $$('.chip', chipsEl).forEach(function (c) {
    var i = byId[c.getAttribute('data-id')];
    if (i !== undefined) chipOf[i] = c;
  });
  var inp = $('#mq'), tog = $('#mtoggle'), none = $('#mnone'), tb = $('#mtoolbar'), hd = $('header');
  var st = arts.map(function () { return false; });
  var q = '', allOpen = false, act = -1;

  function masse() {
    var hh = hd ? hd.offsetHeight : 69;
    root.style.setProperty('--hh', hh + 'px');
    if (tb) root.style.setProperty('--tb', tb.offsetHeight + 'px');
  }
  function apply() {
    var any = false;
    arts.forEach(function (art, ci) {
      var n = 0;
      items[ci].forEach(function (li) {
        var m = !q || li.getAttribute('data-s').indexOf(q) > -1;
        li.hidden = !m;
        if (m) n++;
      });
      var show = !q || n > 0;
      art.hidden = !show;
      if (chipOf[ci]) chipOf[ci].hidden = !show;
      var open = q ? n > 0 : !!st[ci];
      panels[ci].hidden = !open;
      heads[ci].setAttribute('aria-expanded', open ? 'true' : 'false');
      art.classList.toggle('open', open);
      if (show) any = true;
    });
    if (none) none.hidden = any;
    if (tog) tog.hidden = !!q;
    masse();
  }
  function toCat(ci) {
    if (!arts[ci]) return;
    arts[ci].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  function goCat(ci) {
    if (ci === undefined || ci < 0) return;
    if (q) { q = ''; if (inp) inp.value = ''; }
    st[ci] = true;
    apply();
    toCat(ci);
  }
  function setAct(ci) {
    if (ci === act) return;
    act = ci;
    chipOf.forEach(function (c, i) { if (c) c.classList.toggle('act', i === ci); });
    var c = chipOf[ci];
    if (c && !c.hidden && chipsEl && chipsEl.scrollTo) {
      chipsEl.scrollTo({ left: c.offsetLeft - (chipsEl.clientWidth - c.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  var ticking = false;
  function spy() {
    var linie = (hd ? hd.offsetHeight : 69) + (tb ? tb.offsetHeight : 0) + 24;
    var cur = -1, first = -1;
    for (var i = 0; i < arts.length; i++) {
      if (arts[i].hidden) continue;
      if (first < 0) first = i;
      if (arts[i].getBoundingClientRect().top <= linie) cur = i;
    }
    setAct(cur < 0 ? first : cur);
  }
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; spy(); });
  }, { passive: true });
  window.addEventListener('resize', function () { masse(); spy(); });

  list.addEventListener('click', function (e) {
    var b = e.target.closest('.chead');
    if (!b) return;
    var ci = arts.indexOf(b.closest('.cat'));
    if (ci < 0) return;
    st[ci] = !st[ci];
    apply();
  });
  if (chipsEl) chipsEl.addEventListener('click', function (e) {
    var c = e.target.closest('.chip');
    if (!c) return;
    e.preventDefault();
    goCat(byId[c.getAttribute('data-id')]);
  });
  if (inp) {
    inp.hidden = false;
    inp.addEventListener('input', function () {
      q = fold(inp.value.trim());
      apply();
      var y = list.getBoundingClientRect().top + window.pageYOffset - ((hd ? hd.offsetHeight : 69) + (tb ? tb.offsetHeight : 0) + 10);
      if (window.pageYOffset > y) window.scrollTo(0, Math.max(0, y));
      spy();
    });
  }
  if (tog) {
    tog.hidden = false;
    tog.addEventListener('click', function () {
      allOpen = !allOpen;
      for (var i = 0; i < st.length; i++) st[i] = allOpen;
      tog.textContent = allOpen ? 'Alle zuklappen' : 'Alle aufklappen';
      apply();
    });
  }
  function ausHash() {
    var id = decodeURIComponent((location.hash || '').slice(1));
    if (id && byId[id] !== undefined) { goCat(byId[id]); return true; }
    return false;
  }
  window.addEventListener('hashchange', ausHash);
  st[0] = true;
  apply();
  setTimeout(function () { masse(); if (!ausHash()) spy(); }, 60);
}

safe('drawer', drawer);
safe('reveal', reveal, revealAll);
safe('hours', hours);
safe('events', events);
safe('karte', karte);
safe('galerie', galerie);
safe('menue', menue);
})();
