const DATA = {
  site: 'content/site.json',
  gallery: 'content/gallery.json',
  flavours: 'content/flavours.json',
  pricing: 'content/pricing.json',
  faq: 'content/faq.json',
  policies: 'content/policies.json'
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

// Fixes Pages CMS image paths when the site is hosted as a GitHub Pages project site.
function assetUrl(value) {
  if (!value) return '';
  const v = String(value).trim();
  if (/^(https?:|data:|blob:)/i.test(v)) return v;
  return v.replace(/^\/+/, '');
}

function setText(selector, value, fallback = '') {
  const el = qs(selector);
  if (!el) return;
  const text = value ?? fallback;
  el.textContent = text;
}

function setOptionalText(selector, value, fallback = '') {
  const el = qs(selector);
  if (!el) return;
  const text = value ?? fallback;
  el.textContent = text;
  el.style.display = String(text || '').trim() ? '' : 'none';
}

function validColour(v) {
  return typeof v === 'string' && v.trim() && CSS.supports('color', v.trim());
}

function contrastText(bg) {
  const v = String(bg || '').trim();
  const m = v.match(/^#([0-9a-f]{6})$/i);
  if (!m) return '#ffffff';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > .67 ? '#4a403c' : '#ffffff';
}

function applyColours(site = {}) {
  const map = {
    bg_navigation: '--bg-nav',
    bg_hero: '--bg-hero',
    bg_intro: '--bg-intro',
    bg_gallery: '--bg-gallery',
    bg_flavours: '--bg-flavours',
    bg_pricing: '--bg-pricing',
    bg_order: '--bg-order',
    bg_contact: '--bg-contact',
    bg_footer: '--bg-footer',
    bg_faq: '--bg-faq',
    bg_page_content: '--bg-page-content'
  };
  Object.entries(map).forEach(([key, cssVar]) => {
    if (validColour(site[key])) document.documentElement.style.setProperty(cssVar, site[key].trim());
  });
  if (validColour(site.bg_order)) document.documentElement.style.setProperty('--order-text', contrastText(site.bg_order));
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

function renderSite(site = {}) {
  applyColours(site);

  // Hero — redundant eyebrow removed by default, but editable if you want it back.
  setOptionalText('#hero-eyebrow', site.hero_eyebrow, '');
  setText('#hero-heading', site.hero_heading, 'Cakes designed to feel as special as the celebration.');
  setOptionalText('#hero-subheading', site.hero_subheading, 'Thoughtfully designed custom cakes, made in small batches for Calgary celebrations.');
  if (site.hero_cta && qs('#hero-cta')) qs('#hero-cta').childNodes[0].nodeValue = `${site.hero_cta} `;

  setOptionalText('#intro-eyebrow', site.intro_eyebrow, 'HONEY BEE CAKES');
  setText('#intro-heading', site.intro_heading, 'Custom cakes, thoughtfully designed for beautiful celebrations.');
  setOptionalText('#intro-copy', site.intro_copy, 'Romantic, design-led cakes with an editorial eye — made to be memorable from the first look to the last slice.');

  // Gallery — "Selected Work" and the old descriptive sentence are blank by default.
  setOptionalText('#gallery-eyebrow', site.gallery_eyebrow, '');
  setText('#gallery-heading', site.gallery_heading, 'Gallery');
  setOptionalText('#gallery-copy', site.gallery_copy, '');

  setOptionalText('#flavours-eyebrow', site.flavours_eyebrow, 'THE MENU');
  setText('#flavours-heading', site.flavours_heading, 'Build your flavour');
  setOptionalText('#flavours-copy', site.flavours_copy, 'Make it yours. Choose one sponge, one frosting and one filling, then add a little texture if you like.');

  setOptionalText('#pricing-eyebrow', site.pricing_eyebrow, 'PLANNING YOUR CAKE');
  setText('#pricing-heading', site.pricing_heading, 'Price + size guide');
  setOptionalText('#pricing-intro', site.pricing_intro, 'Starting prices are a guide. Final pricing depends on design detail, finish and decoration.');
  setOptionalText('#pricing-footnote', site.pricing_footnote, 'Serving counts are estimates and can vary by cutting style. Your final quote confirms the size recommended for your event.');

  setOptionalText('#order-eyebrow', site.order_eyebrow, 'START YOUR ORDER');
  setText('#order-heading', site.order_heading, 'Tell me what you’re celebrating.');
  setOptionalText('#order-copy', site.order_copy, 'Share your date, serving count, colours and inspiration. I’ll reply with availability and a quote.');
  setText('#order-meta-1', site.order_meta_1, 'Pickup near Stampede Park');
  setText('#order-meta-2', site.order_meta_2, 'Licensed home bakery');
  setText('#order-meta-3', site.order_meta_3, 'Pickup only');

  setOptionalText('#contact-eyebrow', site.contact_eyebrow, 'CONTACT');
  setText('#contact-heading', site.contact_heading, 'Let’s make something beautiful.');
  setText('#contact-orders', site.contact_orders, 'By inquiry · Pickup only');

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

const GALLERY_CATEGORIES = ['All', 'Vintage', 'Floral', 'Minimal', 'Kids', 'Wedding', 'Cupcakes', 'Bento Box', 'Other'];

function renderGallery(items = []) {
  const grid = qs('#gallery-grid');
  const filters = qs('#gallery-filters');
  if (!grid || !filters) return;

  const extras = [...new Set(items.map(x => x.category).filter(Boolean))].filter(x => !GALLERY_CATEGORIES.includes(x));
  const categories = [...GALLERY_CATEGORIES, ...extras];
  filters.innerHTML = categories.map((cat, i) => `<button class="gallery-filter ${i===0 ? 'active':''}" data-filter="${escapeAttr(cat)}">${escapeHTML(cat)}</button>`).join('');

  const draw = category => {
    const list = category === 'All' ? items : items.filter(x => x.category === category);
    if (!list.length) {
      grid.innerHTML = `<div class="gallery-empty">No ${escapeHTML(category === 'All' ? '' : category)} photos added yet.</div>`;
      return;
    }
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
  const groups = [
    { key: 'sponges', number: '01', title: 'Choose your sponge' },
    { key: 'frostings', number: '02', title: 'Choose your frosting' },
    { key: 'fillings', number: '03', title: 'Choose your filling', optional: true },
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

function renderPolicies(data = {}) {
  if (!qs('#policies-body')) return;
  setText('#policies-title', data.title, 'Policies');
  setOptionalText('#policies-intro', data.intro, 'Please review these policies before placing your order.');
  const body = String(data.body || '').trim();
  qs('#policies-body').innerHTML = body
    ? body.split(/\n\s*\n/).map(p => `<p>${escapeHTML(p).replace(/\n/g, '<br>')}</p>`).join('')
    : '<p>Add your policies in Pages CMS → Policies.</p>';
}

function escapeHTML(v='') { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c])); }
function escapeAttr(v='') { return escapeHTML(v); }

(async function init() {
  initMobileNav();
  initLightbox();
  qs('#year') && (qs('#year').textContent = new Date().getFullYear());
  const [site, gallery, flavours, pricing, faq, policies] = await Promise.all([
    getJSON(DATA.site, {}),
    getJSON(DATA.gallery, []),
    getJSON(DATA.flavours, {}),
    getJSON(DATA.pricing, []),
    getJSON(DATA.faq, []),
    getJSON(DATA.policies, {})
  ]);
  renderSite(site);
  renderGallery(gallery);
  renderFlavours(flavours);
  renderPricing(pricing);
  renderFAQ(faq);
  renderPolicies(policies);
  initReveal();
})();
