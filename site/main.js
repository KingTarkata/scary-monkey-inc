(function () {
  document.documentElement.classList.add('js');

  const grid = document.getElementById('grid');
  const chips = document.querySelectorAll('.chip');
  let projects = [];

  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- Project grid. Built with DOM APIs only, so project data can never inject markup.
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function safeUrl(u) {
    return /^(https?:|mailto:|#|\/|\.)/i.test(u) ? u : '#';
  }

  function card(p) {
    const c = el('article', 'card');
    const thumb = el('div', 'thumb');
    if (p.image) {
      const img = el('img');
      img.src = p.image; img.alt = ''; img.loading = 'lazy';
      thumb.appendChild(img);
    } else {
      thumb.classList.add('empty');
    }
    const body = el('div', 'card-body');
    body.appendChild(el('div', 'meta', (p.category === 'game' ? 'Game' : 'Project') + (p.year ? ' / ' + p.year : '')));
    body.appendChild(el('h3', '', p.title));
    body.appendChild(el('p', '', p.summary));
    const tags = el('div', 'tags');
    (p.tags || []).forEach(t => tags.appendChild(el('span', '', t)));
    body.appendChild(tags);
    const links = el('div', 'links');
    (p.links || []).forEach(l => {
      const a = el('a', '', l.label);
      a.href = safeUrl(l.url);
      if (/^https?:/i.test(a.href) && a.origin !== location.origin) { a.target = '_blank'; a.rel = 'noopener'; }
      links.appendChild(a);
    });
    body.appendChild(links);
    c.append(thumb, body);
    return c;
  }

  function render(filter) {
    grid.replaceChildren();
    const list = projects.filter(p => filter === 'all' || p.category === filter);
    if (!list.length) grid.appendChild(el('p', 'empty-note', 'Nothing here yet. Check back soon.'));
    list.forEach(p => grid.appendChild(card(p)));
  }

  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(c => {
      c.classList.toggle('active', c === ch);
      c.setAttribute('aria-pressed', c === ch);
    });
    render(ch.dataset.filter);
  }));

  fetch('projects.json')
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(d => { projects = d.projects || []; render('all'); })
    .catch(() => { grid.replaceChildren(el('p', 'empty-note', 'Could not load projects.')); });

  // ---- Mascot: pupils behind the logo's eye cut-outs follow the pointer.
  const mascot = document.getElementById('mascot');
  const pupils = [document.getElementById('pupilL'), document.getElementById('pupilR')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let idleTimer = null;

  function look(nx, ny) {            // nx, ny in -1..1
    const w = mascot.clientWidth;
    const dx = nx * w * 0.022, dy = ny * w * 0.012;
    pupils.forEach(p => { p.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; });
  }

  function aimAt(x, y) {
    const r = mascot.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.64;
    const clamp = v => Math.max(-1, Math.min(1, v));
    look(clamp((x - cx) / (innerWidth * 0.35)), clamp((y - cy) / (innerHeight * 0.35)));
  }

  function wander() {
    look(Math.random() * 2 - 1, Math.random() * 2 - 1);
    idleTimer = setTimeout(wander, 1200 + Math.random() * 1800);
  }

  function onPointer(e) {
    const t = e.touches ? e.touches[0] : e;
    clearTimeout(idleTimer);
    aimAt(t.clientX, t.clientY);
    idleTimer = setTimeout(wander, 4000);
  }

  if (!reduce) {
    pupils.forEach(p => { p.style.transition = 'transform .12s ease-out'; });
    addEventListener('pointermove', onPointer, { passive: true });
    addEventListener('touchmove', onPointer, { passive: true });
    wander();
  }

  // ---- Reveal sections as they scroll into view.
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.08 });
    revealEls.forEach(e => io.observe(e));
  } else {
    revealEls.forEach(e => e.classList.add('in'));
  }
})();
