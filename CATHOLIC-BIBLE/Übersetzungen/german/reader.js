(function () {
  var BOOK_ID = 'bibel_original';
  var POS_KEY = 'bx_pos_' + BOOK_ID;
  var TOC_KEY = 'bx_toc_' + BOOK_ID;
  var HL_PFX  = 'bx_hl_';

  var fname = location.pathname.replace(/\\/g, '/').split('/').pop();
  var SKIP  = ['cover.html','index.html','intro.html','vorwort.html','back-cover.html','inhaltsverzeichnis.html'];
  var isChapter = SKIP.indexOf(fname) === -1;
  var isCover   = fname === 'cover.html';
  var isTOC     = fname === 'index.html';

  /* ─── KAPITELSEITE ─── */
  if (isChapter) {
    // Scroll to saved anchor on page load
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(POS_KEY)); } catch(e) {}
    if (saved && saved.url) {
      var savedBase = saved.url.split('#')[0];
      var curBase   = location.href.split('#')[0];
      if (savedBase === curBase && saved.anchor && !location.hash) {
        // Delay slightly to let page render
        setTimeout(function() {
          var el = document.getElementById(saved.anchor);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    }

    // Track last visible verse as user scrolls
    var lastAnchor = (saved && saved.anchor && saved.url && saved.url.split('#')[0] === location.href.split('#')[0])
      ? saved.anchor : '';

    function findTopVerse() {
      var els = document.querySelectorAll('.verse-block[id]');
      for (var i = 0; i < els.length; i++) {
        var r = els[i].getBoundingClientRect();
        if (r.top >= -60) { return els[i].id; }
      }
      return '';
    }

    var scrollTimer;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function() { lastAnchor = findTopVerse(); }, 80);
    }, { passive: true });

    window.addEventListener('beforeunload', function() {
      try {
        localStorage.setItem(POS_KEY, JSON.stringify({
          url: location.href.split('#')[0],
          anchor: lastAnchor || findTopVerse()
        }));
      } catch(e) {}
    });

    // Highlight CSS
    var s = document.createElement('style');
    s.textContent =
      '.verse-block{cursor:pointer;transition:background .18s;position:relative}' +
      '.verse-block:hover{background:rgba(184,150,46,.06)!important}' +
      '.bx-hl{background:rgba(184,150,46,.15)!important;border-radius:3px}' +
      '.bx-hl::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;' +
      'background:#B8962E;border-radius:3px 0 0 3px}';
    document.head.appendChild(s);

    var hlKey = HL_PFX + location.pathname;
    var hl = [];
    try { hl = JSON.parse(localStorage.getItem(hlKey) || '[]'); } catch(e) {}

    function applyHL() {
      hl.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('bx-hl');
      });
    }
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', applyHL)
      : applyHL();

    document.addEventListener('click', function(e) {
      var el = e.target.closest('.verse-block');
      if (!el || !el.id) return;
      el.classList.toggle('bx-hl');
      var idx = hl.indexOf(el.id);
      if (el.classList.contains('bx-hl')) {
        if (idx < 0) hl.push(el.id);
      } else {
        if (idx >= 0) hl.splice(idx, 1);
      }
      try { localStorage.setItem(hlKey, JSON.stringify(hl)); } catch(e) {}
    });
  }

  /* ─── COVER-SEITE ─── */
  if (isCover) {
    function showBookmark() {
      var pos = null;
      try { pos = JSON.parse(localStorage.getItem(POS_KEY)); } catch(e) {}
      if (!pos || !pos.url) return;

      var href = pos.url + (pos.anchor ? '#' + pos.anchor : '');

      // SVG bookmark ribbon attached to the book
      var s = document.createElement('style');
      s.textContent =
        '.bx-ribbon{position:absolute;top:-2px;right:52px;z-index:20;display:flex;flex-direction:column;align-items:center}' +
        '.bx-ribbon a{display:block;text-decoration:none}' +
        '.bx-ribbon svg{filter:drop-shadow(0 4px 8px rgba(0,0,0,.55));transition:transform .2s}' +
        '.bx-ribbon a:hover svg{transform:translateY(-4px)}' +
        '.bx-ribbon-x{background:none;border:none;color:rgba(212,168,74,.5);font-size:.65rem;' +
        'cursor:pointer;padding:3px 0 0;line-height:1;transition:color .2s;display:block;text-align:center}' +
        '.bx-ribbon-x:hover{color:#D4A84A}' +
        '.bx-ribbon-lbl{font:.5rem/1 sans-serif;color:rgba(212,168,74,.7);letter-spacing:.12em;' +
        'text-transform:uppercase;margin-top:6px;text-align:center}';
      document.head.appendChild(s);

      var container = document.querySelector('.page, .book');
      if (!container) return;

      var wrap = document.createElement('div');
      wrap.className = 'bx-ribbon';

      var link = document.createElement('a');
      link.href = href;
      link.title = 'Weiterlesen';

      // Ribbon SVG shape — classic bookmark with pointed bottom
      var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 32 72');
      svg.setAttribute('width','32');
      svg.setAttribute('height','72');
      svg.innerHTML =
        '<defs>' +
        '<linearGradient id="bxg" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0%" stop-color="#7a5800"/>' +
        '<stop offset="40%" stop-color="#B8962E"/>' +
        '<stop offset="100%" stop-color="#7a5800"/>' +
        '</linearGradient>' +
        '</defs>' +
        '<path d="M0,0 L32,0 L32,65 L16,55 L0,65 Z" fill="url(#bxg)"/>' +
        '<path d="M4,0 L28,0 L28,62 L16,53 L4,62 Z" fill="none" stroke="rgba(255,240,180,.18)" stroke-width="0.7"/>' +
        '<line x1="16" y1="14" x2="16" y2="48" stroke="rgba(255,240,180,.25)" stroke-width="0.6"/>' +
        '<line x1="8" y1="22" x2="24" y2="22" stroke="rgba(255,240,180,.25)" stroke-width="0.6"/>';
      link.appendChild(svg);

      var lbl = document.createElement('span');
      lbl.className = 'bx-ribbon-lbl';
      lbl.textContent = 'Weiterlesen';

      var x = document.createElement('button');
      x.className = 'bx-ribbon-x';
      x.textContent = '✕';
      x.title = 'Lesezeichen entfernen';
      x.addEventListener('click', function(e) {
        e.preventDefault(); e.stopPropagation();
        try { localStorage.removeItem(POS_KEY); } catch(e) {}
        wrap.remove();
      });

      wrap.appendChild(link);
      wrap.appendChild(lbl);
      wrap.appendChild(x);
      container.appendChild(wrap);
    }
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', showBookmark)
      : showBookmark();
  }

  /* ─── INHALTSVERZEICHNIS ─── */
  if (isTOC) {
    function initTOC() {
      var marked = null;
      try { marked = localStorage.getItem(TOC_KEY); } catch(e) {}

      var s = document.createElement('style');
      s.textContent =
        'a.bx-cur{border-left:4px solid #B8962E!important;padding-left:calc(4px + 4px)!important;background:rgba(184,150,46,.07)!important}';
      document.head.appendChild(s);

      document.querySelectorAll('a[href]').forEach(function(a) {
        var href = a.getAttribute('href');
        if (!href || /^(https?:|#|mailto:)/.test(href)) return;
        if (!href.includes('b\u00fccher/') && !href.includes('suren/') && !href.includes('surah')) return;
        if (marked === href) a.classList.add('bx-cur');
        a.addEventListener('click', function() {
          document.querySelectorAll('.bx-cur').forEach(function(el) { el.classList.remove('bx-cur'); });
          a.classList.add('bx-cur');
          try { localStorage.setItem(TOC_KEY, href); } catch(e) {}
        });
      });
    }
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', initTOC)
      : initTOC();
  }
}());