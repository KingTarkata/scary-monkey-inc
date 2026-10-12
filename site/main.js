(function () {
  const grid = document.getElementById('grid');
  const chips = document.querySelectorAll('.chip');
  let projects = [];

  document.getElementById('year').textContent = new Date().getFullYear();

  // Build with textContent/DOM APIs only, so project data can never inject markup.
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
      thumb.textContent = p.category === 'game' ? '\u{1F3AE}' : '\u{1F6E0}️';
    }
    const body = el('div', 'card-body');
    body.appendChild(el('div', 'meta', (p.category === 'game' ? 'Game' : 'Project') + (p.year ? ' · ' + p.year : '')));
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
    if (!list.length) grid.appendChild(el('p', '', 'Nothing here yet. Check back soon!'));
    list.forEach(p => grid.appendChild(card(p)));
  }

  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(c => c.classList.toggle('active', c === ch));
    render(ch.dataset.filter);
  }));

  fetch('projects.json')
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(d => { projects = d.projects || []; render('all'); })
    .catch(() => { grid.replaceChildren(el('p', '', 'Could not load projects.')); });
})();
