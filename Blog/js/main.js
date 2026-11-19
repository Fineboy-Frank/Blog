(function () {
  'use strict';

  /* ---------- Mobile menu (runs on every page) ---------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Home page only ---------- */
  var heroEl = document.getElementById('hero');
  if (!heroEl) return;

  var CATEGORIES = ['All', 'Developer & Code', 'Hardware', 'Software', 'Artificial Intelligence'];

  var ARTICLES = [
    { title: 'The best programming languages to learn in 2026: a comprehensive guide for developers', cat: 'Software', author: 'Angel', date: '03 Sep 2026', time: '10 min read', g: 0 },
    { title: 'The best hardware upgrades for your PC in 2026: what every tech enthusiast needs to know', cat: 'Hardware', author: 'Angel', date: '03 Sep 2026', time: '10 min read', g: 1 },
    { title: 'Exploring the latest innovations in CPU technology: what’s new and why it matters in 2026', cat: 'Hardware', author: 'Marjorie', date: '03 Sep 2026', time: '10 min read', g: 2 },
    { title: 'Top software development trends to watch in 2026: from AI advancements to low-code re…', cat: 'Software', author: 'Gladys', date: '03 Sep 2026', time: '10 min read', g: 3 },
    { title: 'How to optimize your software stack for maximum efficiency: essential tips for 2026', cat: 'Software', author: 'Darrell', date: '03 Sep 2026', time: '10 min read', g: 4 },
    { title: 'The ethical implications of artificial intelligence: what every tech professional should know', cat: 'Artificial Intelligence', author: 'Shawn', date: '03 Sep 2026', time: '10 min read', g: 5 },
    { title: 'How blockchain is revolutionizing supply chain management: a look at 2026 innovations', cat: 'Blockchain & crypto', author: 'Cameron', date: '03 Sep 2026', time: '10 min read', g: 6 },
    { title: 'Virtual reality in 2026: how it’s transforming the way we work, play, and learn', cat: 'Augmented & VR', author: 'Mitchell', date: '03 Sep 2026', time: '10 min read', g: 7 },
    { title: 'Producing a Prototype REST API with Spring', cat: 'Developer & Code', author: 'Shawn', date: '27 Aug 2026', time: '8 min read', g: 2 },
    { title: 'How to Implement Infinite Scrolling in ReactJS', cat: 'Developer & Code', author: 'Cameron', date: '27 Aug 2026', time: '6 min read', g: 4 },
    { title: 'Expert Curations: Beginner to Intermediate Generative AI', cat: 'Artificial Intelligence', author: 'Mitchell', date: '24 Aug 2026', time: '9 min read', g: 7 },
    { title: 'The Magic of Adding UX/UI to Your Code Skills', cat: 'Developer & Code', author: 'Angel', date: '24 Aug 2026', time: '7 min read', g: 0 }
  ];

  var PER_PAGE = 12, TOTAL_PAGES = 5; // demo pagination
  var state = { cat: 'All', page: 1 };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function thumb(a) {
    return a.img
      ? '<img class="thumb" src="' + esc(a.img) + '" alt="">'
      : '<div class="thumb g' + a.g + '"></div>';
  }
  function meta(a) {
    return '<div class="meta"><span class="avatar"></span>' + esc(a.author) + ' • ' + esc(a.date) + '</div>';
  }
  function card(a) {
    return '<a href="#" class="card"><div class="thumb-wrap">' + thumb(a) + '</div><div>' +
      meta(a) + '<h3>' + esc(a.title) + '</h3>' +
      '<div class="cat">' + esc(a.cat) + ' <span>• ' + esc(a.time) + '</span></div></div></a>';
  }

  function renderTabs() {
    document.getElementById('tabs').innerHTML = CATEGORIES.map(function (c) {
      return '<button role="tab" class="' + (c === state.cat ? 'active' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
    }).join('');
  }

  function renderHero() {
    var a = ARTICLES[0];
    heroEl.innerHTML = '<a href="#" class="hero-card">' + thumb(a) +
      '<div class="hero-body">' + meta(a) + '<h2>' + esc(a.title) + '</h2>' +
      '<div class="cat">' + esc(a.cat) + ' <span>• ' + esc(a.time) + '</span></div></div></a>';
  }

  function renderFeatured() {
    document.getElementById('featured').innerHTML = ARTICLES.slice(1, 5).map(card).join('');
  }

  function renderRecent() {
    var list = ARTICLES.slice(5);
    if (state.cat !== 'All') list = ARTICLES.filter(function (a) { return a.cat === state.cat; });
    // rotate list so each demo page looks different
    var shift = (state.page - 1) % Math.max(list.length, 1);
    list = list.slice(shift).concat(list.slice(0, shift)).slice(0, PER_PAGE);
    document.getElementById('recent').innerHTML = list.length
      ? list.map(card).join('')
      : '<p style="color:var(--muted)">No articles in this category yet.</p>';
  }

  function renderPagination() {
    var html = '<button data-p="prev" aria-label="Previous page"' + (state.page === 1 ? ' disabled' : '') + '>‹</button>';
    for (var i = 1; i <= TOTAL_PAGES; i++) {
      html += '<button data-p="' + i + '" class="' + (i === state.page ? 'active' : '') + '">' + i + '</button>';
    }
    html += '<button data-p="next" aria-label="Next page"' + (state.page === TOTAL_PAGES ? ' disabled' : '') + '>›</button>';
    document.getElementById('pagination').innerHTML = html;
  }

  document.getElementById('tabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.cat = b.dataset.cat; state.page = 1;
    renderTabs(); renderRecent(); renderPagination();
  });

  document.getElementById('pagination').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    var p = b.dataset.p;
    state.page = p === 'prev' ? state.page - 1 : p === 'next' ? state.page + 1 : Number(p);
    renderRecent(); renderPagination();
    document.getElementById('recent').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('subscribeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('email'), msg = document.getElementById('formMsg');
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    msg.textContent = ok ? 'Thanks for subscribing!' : 'Enter a valid email address.';
    if (ok) input.value = '';
  });

  renderTabs(); renderHero(); renderFeatured(); renderRecent(); renderPagination();
})();
