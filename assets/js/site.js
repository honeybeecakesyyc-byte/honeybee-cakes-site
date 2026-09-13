const DATA = {
  site: 'content/site.json',
  gallery: 'content/gallery.json',
  flavours: 'content/flavours.json',
  pricing: 'content/pricing.json',
  faq: 'content/faq.json'
};

async function getJSON(path, fallback) {
  try {
    const r = await fetch(path, { cache: 'no-store' });
    if (!r.ok) throw new Error(`${r.status}`);
    return await r.json();
  } catch (e) {
    console.warn(`Could not load ${path}`, e);
    return fallback;
  }
}

function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return [...document.querySelectorAll(sel)]; }

// Pages CMS normally writes public image paths beginning with '/'.
// On a GitHub Pages project site, that leading slash points to the account root
// instead of this repository. Convert site-owned image paths to repo-relative URLs.
function assetUrl(value) {
  if (!value) return '';
  const v = String(value).trim();
  if (/^(https?:|data:|blob:)/i.test(v)) return v;
  return v.replace(/^\/+/, '');
}

function initMobileNav() {
  const button = qs('.mobile-menu-button');
  const drawer = qs('.mobile-drawer');
  const close = qs('.mobile-close');
  if (!button || !drawer) return;
  const shut = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
  };
  button.addEventListener('click', () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
  });
  close?.addEventListener('click', shut);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
}

function initReveal() {
  const items = qsa('.reveal');
  if (!('IntersectionObserver' in window)) return items.forEach(x => x.classList.add('visible'));
  const obs = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  }), { threshold: .08 });
  items.forEach(el => obs.observe(el));
}

function renderSite(site) {
  if (!site) return;
  if (qs('#hero-heading')) qs('#hero-heading').textContent = site.hero_heading || '';
  if (qs('#hero-subheading')) qs('#hero-subheading').textContent = site.hero_subheading || '';
  if (qs('#intro-heading')) qs('#intro-heading').textContent = site.intro_heading || '';
  if (qs('#intro-copy')) qs('#intro-copy').textContent = site.intro_copy || '';
  if (qs('#pricing-intro')) qs('#pricing-intro').textContent = site.pricing_intro || '';
  if (site.logo && qs('#site-logo')) qs('#site-logo').src = assetUrl(site.logo);
  if (site.hero_image && qs('#hero-image')) {
    qs('#hero-image').src = assetUrl(site.hero_image);
    qs('.hero-image-note')?.remove();
  }
  if (site.email && qs('#contact-email')) {
    qs('#contact-email').textContent = site.email;
    qs('#contact-email').href = `mailto:${site.email}`;
  }
  if (site.location && qs('#contact-location')) qs('#contact-location').textContent = site.location;
  if (site.instagram_url && qs('#instagram-link')) {
    qs('#instagram-link').href = site.instagram_url;
    qs('#instagram-link').textContent = site.instagram_handle || '@honeybeecakesyyc';
  }
  if (site.youform_embed_url && qs('#youform-frame')) {
    const frame = qs('#youform-frame');
    frame.src = site.youform_embed_url;
    frame.style.display = 'block';
    qs('#form-placeholder')?.remove();
  }
}

function renderGallery(items = []) {
  const grid = qs('#gallery-grid');
  const filters = qs('#gallery-filters');
  if (!grid || !filters) return;
  const categories = ['All', ...new Set(items.map(x => x.category).filter(Boolean))];
  filters.innerHTML = categories.map((cat, i) => `<button class="gallery-filter ${i===0 ? 'active':''}" data-filter="${escapeHTML(cat)}">${escapeHTML(cat)}</button>`).join('');

  const draw = category => {
    const list = category === 'All' ? items : items.filter(x => x.category === category);
    grid.innerHTML = list.map(item => `
      <figure class="gallery-item reveal" data-title="${escapeAttr(item.title || '')}" data-category="${escapeAttr(item.category || '')}" data-image="${escapeAttr(assetUrl(item.image || ''))}">
        <img src="${escapeAttr(assetUrl(item.image || 'assets/uploads/gallery-placeholder-1.svg'))}" alt="${escapeAttr(item.alt || item.title || 'Honey Bee Cakes design')}" loading="lazy" />
        <figcaption class="gallery-overlay"><strong>${escapeHTML(item.title || 'Custom Cake')}</strong><span>${escapeHTML(item.category || '')}</span></figcaption>
      </figure>`).join('');
    initReveal();
    grid.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => openLightbox(item)));
  };
  draw('All');
  filters.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    filters.querySelectorAll('button').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    draw(btn.dataset.filter);
  }));
}

function openLightbox(item) {
  const dialog = qs('#lightbox');
  if (!dialog) return;
  qs('#lightbox-image').src = item.dataset.image;
  qs('#lightbox-image').alt = item.dataset.title || 'Cake design';
  qs('#lightbox-title').textContent = item.dataset.title;
  qs('#lightbox-category').textContent = item.dataset.category;
  dialog.showModal();
}

function initLightbox() {
  const d = qs('#lightbox');
  if (!d) return;
  qs('.lightbox-close')?.addEventListener('click', () => d.close());
  d.addEventListener('click', e => { if (e.target === d) d.close(); });
}

function renderFlavours(data = {}) {
  const grid = qs('#flavour-grid');
  if (!grid) return;

  // Backward compatibility with the original preset-flavour list.
  if (Array.isArray(data)) {
    grid.innerHTML = data.map((item, i) => `
      <article class="flavour-card reveal">
        <div class="flavour-number">${String(i+1).padStart(2,'0')}</div>
        <div>
          <h3>${escapeHTML(item.name || '')}</h3>
          <p>${escapeHTML(item.description || '')}</p>
          ${item.tag ? `<span class="flavour-tag">${escapeHTML(item.tag)}</span>` : ''}
        </div>
      </article>`).join('');
    initReveal();
    return;
  }

  const groups = [
    { key: 'sponges', number: '01', title: 'Choose your sponge' },
    { key: 'frostings', number: '02', title: 'Choose your frosting' },
    { key: 'fillings', number: '03', title: 'Choose your filling' },
    { key: 'add_ins', number: '04', title: 'Choose an add-in', optional: true }
  ];

  grid.innerHTML = groups.map(group => {
    const items = Array.isArray(data[group.key]) ? data[group.key] : [];
    return `
      <article class="builder-group reveal">
        <div class="builder-heading">
          <span class="builder-number">${group.number}</span>
          <div>
            <h3>${group.title}</h3>
            ${group.optional ? '<span class="builder-optional">optional</span>' : ''}
          </div>
        </div>
        <div class="builder-options">
          ${items.map(item => `
            <div class="builder-option">
              <strong>${escapeHTML(item.name || '')}</strong>
              ${item.note ? `<span>${escapeHTML(item.note)}</span>` : ''}
            </div>`).join('') || '<p class="builder-empty">Options coming soon.</p>'}
        </div>
      </article>`;
  }).join('');
  initReveal();
}

function renderPricing(items = []) {
  const grid = qs('#size-grid');
  if (!grid) return;
  const max = Math.max(...items.map(x => Number(x.diameter) || 1), 1);
  grid.innerHTML = items.map(item => {
    const d = Number(item.diameter) || 6;
    const w = 68 + (d / max) * 72;
    const h = 92 + (d / max) * 48;
    return `<article class="size-card reveal">
      <div class="size-card-top">
        <div class="cake-illustration"><div class="cake-shape" style="--cake-width:${w}px; --cake-height:${h}px"></div></div>
        <h3>${escapeHTML(item.size || `${d}”`)}</h3>
      </div>
      <div class="size-details">
        <div><span>Approx. serves</span><strong>${escapeHTML(item.servings || '—')}</strong></div>
        <div style="text-align:right"><span>Starts at</span><strong>${escapeHTML(item.price || 'Quote')}</strong></div>
      </div>
    </article>`;
  }).join('');
  initReveal();
}

function renderFAQ(items = []) {
  const list = qs('#faq-list');
  if (!list) return;
  list.innerHTML = items.map((item, i) => `
    <article class="faq-item ${i===0 ? 'open':''}">
      <button class="faq-question" aria-expanded="${i===0 ? 'true':'false'}">
        <span>${escapeHTML(item.question || '')}</span><span class="faq-plus">+</span>
      </button>
      <div class="faq-answer"><div><p>${escapeHTML(item.answer || '')}</p></div></div>
    </article>`).join('');
  list.querySelectorAll('.faq-question').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    item.classList.toggle('open');
    btn.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
  }));
}

function escapeHTML(v='') { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c])); }
function escapeAttr(v='') { return escapeHTML(v); }

(async function init() {
  initMobileNav();
  initLightbox();
  qs('#year') && (qs('#year').textContent = new Date().getFullYear());
  const [site, gallery, flavours, pricing, faq] = await Promise.all([
    getJSON(DATA.site, {}),
    getJSON(DATA.gallery, []),
    getJSON(DATA.flavours, []),
    getJSON(DATA.pricing, []),
    getJSON(DATA.faq, [])
  ]);
  renderSite(site);
  renderGallery(gallery);
  renderFlavours(flavours);
  renderPricing(pricing);
  renderFAQ(faq);
  initReveal();
})();
