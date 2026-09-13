const DATA = {
  site: 'content/site.json', gallery: 'content/gallery.json', reviews: 'content/reviews.json',
  flavours: 'content/flavours.json', pricing: 'content/pricing.json', faq: 'content/faq.json', policies: 'content/policies.json'
};

async function getJSON(path, fallback) {
  try { const r = await fetch(path, { cache: 'no-store' }); if (!r.ok) throw new Error(`${r.status}`); return await r.json(); }
  catch (e) { console.warn(`Could not load ${path}`, e); return fallback; }
}
function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return [...document.querySelectorAll(sel)]; }
function assetUrl(value){ if(!value) return ''; const v=String(value).trim(); if(/^(https?:|data:|blob:)/i.test(v)) return v; return v.replace(/^\/+/, ''); }
function escapeHTML(v=''){ return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c])); }
function escapeAttr(v=''){ return escapeHTML(v); }
function setText(selector, value, fallback=''){ const el=qs(selector); if(!el) return; el.textContent = value ?? fallback; }
function setOptionalText(selector,value,fallback=''){ const el=qs(selector); if(!el) return; const text=value ?? fallback; el.textContent=text; el.style.display=String(text||'').trim()?'':'none'; }
function validColour(v){ return typeof v==='string' && v.trim() && CSS.supports('color', v.trim()); }
function contrastText(bg){ const m=String(bg||'').trim().match(/^#([0-9a-f]{6})$/i); if(!m) return '#ffffff'; const n=parseInt(m[1],16); const r=(n>>16)&255,g=(n>>8)&255,b=n&255; return ((0.299*r+0.587*g+0.114*b)/255)>.67 ? '#4a403c' : '#ffffff'; }
function fontStack(name, fallback){ return name ? `"${String(name).replace(/"/g,'')}"${fallback}` : ''; }

function applyDesign(site={}){
  const colorMap={
    color_heading:'--heading-color', color_body:'--body-color', color_muted:'--muted-color', color_accent:'--accent-color', color_line:'--line-color',
    bg_navigation:'--bg-nav', bg_hero:'--bg-hero', bg_intro:'--bg-intro', bg_gallery:'--bg-gallery', bg_reviews:'--bg-reviews',
    bg_flavours:'--bg-flavours', bg_pricing:'--bg-pricing', bg_order:'--bg-order', bg_contact:'--bg-contact', bg_footer:'--bg-footer',
    bg_faq:'--bg-faq', bg_policies:'--bg-policies', bg_page_content:'--bg-page-content'
  };
  Object.entries(colorMap).forEach(([k,v])=>{ if(validColour(site[k])) document.documentElement.style.setProperty(v,site[k].trim()); });
  if(site.heading_font) document.documentElement.style.setProperty('--heading-font',fontStack(site.heading_font,', Georgia, serif'));
  if(site.body_font) document.documentElement.style.setProperty('--body-font',fontStack(site.body_font,', Georgia, serif'));
  if(site.ui_font) document.documentElement.style.setProperty('--ui-font',fontStack(site.ui_font,', Arial, sans-serif'));
  if(validColour(site.bg_order)) document.documentElement.style.setProperty('--order-text', site.order_text_color && validColour(site.order_text_color) ? site.order_text_color : contrastText(site.bg_order));
  else if(validColour(site.order_text_color)) document.documentElement.style.setProperty('--order-text', site.order_text_color);
}

function navValues(site={}){
  return {
    home: site.nav_home || 'Home', gallery: site.nav_gallery || 'Gallery', reviews: site.nav_reviews || 'Reviews', flavours: site.nav_flavours || 'Flavours',
    pricing: site.nav_pricing || 'Price + Size', order: site.nav_order || 'Order', contact: site.nav_contact || 'Contact', policies: site.nav_policies || 'Policies', faq: site.nav_faq || 'FAQ'
  };
}
function renderShared(site={}){
  applyDesign(site);
  const nav=navValues(site);
  setText('#brand-name',site.brand_name,'HONEY BEE CAKES'); setText('#mobile-brand-name',site.brand_name,'HONEY BEE CAKES');
  Object.entries(nav).forEach(([key,val])=>{ setText(`#nav-${key}`,val,val); qsa(`[data-nav="${key}"]`).forEach(el=>el.textContent=val); });
  setText('#side-meta-1',site.side_meta_1,'CALGARY'); setText('#side-meta-2',site.side_meta_2,'EST. 2026');
  setText('#mobile-menu-text',site.mobile_menu_text,'MENU');

  setText('#footer-brand',site.footer_brand,site.brand_name||'HONEY BEE CAKES');
  setText('#footer-gallery',site.footer_gallery,nav.gallery); setText('#footer-reviews',site.footer_reviews,nav.reviews); setText('#footer-flavours',site.footer_flavours,nav.flavours);
  setText('#footer-pricing',site.footer_pricing,'Pricing'); setText('#footer-policies',site.footer_policies,nav.policies); setText('#footer-faq',site.footer_faq,nav.faq);
  const year=new Date().getFullYear(); setText('#footer-copyright',String(site.footer_copyright||'© {year} Honey Bee Cakes Calgary').replaceAll('{year}',year));
}

function renderSite(site={}){
  renderShared(site);
  setOptionalText('#hero-eyebrow',site.hero_eyebrow,''); setText('#hero-heading',site.hero_heading,'Cakes designed to feel as special as the celebration.');
  setOptionalText('#hero-subheading',site.hero_subheading,'Thoughtfully designed custom cakes, made in small batches for Calgary celebrations.');
  setText('#hero-cta-text',site.hero_cta,'ORDER A CAKE'); setText('#hero-cta-arrow',site.hero_cta_arrow,'↘');
  setOptionalText('#intro-eyebrow',site.intro_eyebrow,'HONEY BEE CAKES'); setText('#intro-heading',site.intro_heading,'Custom cakes, thoughtfully designed for beautiful celebrations.'); setOptionalText('#intro-copy',site.intro_copy,'Romantic, design-led cakes with an editorial eye — made to be memorable from the first look to the last slice.');
  setOptionalText('#gallery-eyebrow',site.gallery_eyebrow,''); setText('#gallery-heading',site.gallery_heading,'Gallery'); setOptionalText('#gallery-copy',site.gallery_copy,'');
  setOptionalText('#reviews-eyebrow',site.reviews_eyebrow,'KIND WORDS'); setText('#reviews-heading',site.reviews_heading,'Google reviews'); setOptionalText('#reviews-copy',site.reviews_copy,'Read what customers have shared about their Honey Bee Cakes orders.'); setText('#reviews-button-text',site.reviews_button_text,'SEE ALL GOOGLE REVIEWS');
  setOptionalText('#flavours-eyebrow',site.flavours_eyebrow,'THE MENU'); setText('#flavours-heading',site.flavours_heading,'Build your flavour'); setOptionalText('#flavours-copy',site.flavours_copy,'Make it yours. Choose one sponge, one frosting and one filling, then add a little texture if you like.');
  setOptionalText('#pricing-eyebrow',site.pricing_eyebrow,'PLANNING YOUR CAKE'); setText('#pricing-heading',site.pricing_heading,'Price + size guide'); setOptionalText('#pricing-intro',site.pricing_intro,'Starting prices are a guide. Final pricing depends on design detail, finish and decoration.'); setOptionalText('#pricing-footnote',site.pricing_footnote,'Serving counts are estimates and can vary by cutting style.');
  setOptionalText('#order-eyebrow',site.order_eyebrow,'START YOUR ORDER'); setText('#order-heading',site.order_heading,'Tell me what you’re celebrating.'); setOptionalText('#order-copy',site.order_copy,'Share your date, serving count, colours and inspiration. I’ll reply with availability and a quote.');
  setText('#order-meta-1',site.order_meta_1,'Pickup near Stampede Park'); setText('#order-meta-2',site.order_meta_2,'Licensed home bakery'); setText('#order-meta-3',site.order_meta_3,'Pickup only');
  setText('#form-placeholder-heading',site.form_placeholder_heading,'Your Youform goes here'); setText('#form-placeholder-copy',site.form_placeholder_copy,'Paste your Youform embed URL into Site settings and it appears here automatically.');
  setOptionalText('#contact-eyebrow',site.contact_eyebrow,'CONTACT'); setText('#contact-heading',site.contact_heading,'Let’s make something beautiful.'); setText('#contact-orders',site.contact_orders,'By inquiry · Pickup only');
  setText('#contact-location-label',site.contact_location_label,'LOCATION'); setText('#contact-instagram-label',site.contact_instagram_label,'INSTAGRAM'); setText('#contact-orders-label',site.contact_orders_label,'ORDERS');
  setText('#faq-eyebrow',site.faq_eyebrow,'BEFORE YOU ORDER'); setText('#faq-heading',site.faq_heading,'Frequently asked questions'); setOptionalText('#faq-intro',site.faq_intro,'Everything you need to know about ordering, pickup, storage and allergens.');
  setOptionalText('#faq-cta-eyebrow',site.faq_cta_eyebrow,'READY?'); setText('#faq-cta-heading',site.faq_cta_heading,'Start your cake inquiry.'); setText('#faq-cta-button',site.faq_cta_button,'ORDER A CAKE'); if(qs('#faq-cta-arrow')) setText('#faq-cta-arrow',site.faq_cta_arrow,'↗');
  setOptionalText('#policies-eyebrow',site.policies_eyebrow,'HONEY BEE CAKES'); setOptionalText('#policies-cta-eyebrow',site.policies_cta_eyebrow,'QUESTIONS?'); setText('#policies-cta-heading',site.policies_cta_heading,'Get in touch before ordering.'); setText('#policies-cta-button',site.policies_cta_button,'CONTACT'); if(qs('#policies-cta-arrow')) setText('#policies-cta-arrow',site.policies_cta_arrow,'↗');

  if(site.logo && qs('#site-logo')) { qs('#site-logo').src=assetUrl(site.logo); qs('#site-logo').alt=site.logo_alt||'Honey Bee Cakes Calgary'; }
  if(site.hero_image && qs('#hero-image')) { qs('#hero-image').src=assetUrl(site.hero_image); qs('#hero-image').alt=site.hero_image_alt||'Honey Bee Cakes featured cake'; }
  if(site.email && qs('#contact-email')) { qs('#contact-email').textContent=site.email; qs('#contact-email').href=`mailto:${site.email}`; }
  if(site.location && qs('#contact-location')) qs('#contact-location').textContent=site.location;
  if(qs('#instagram-link')) { if(site.instagram_url) qs('#instagram-link').href=site.instagram_url; qs('#instagram-link').textContent=site.instagram_handle||'@honeybeecakesyyc'; }
  if(site.youform_embed_url && qs('#youform-frame')) { const frame=qs('#youform-frame'); frame.src=site.youform_embed_url; frame.style.display='block'; qs('#form-placeholder')?.remove(); }
}

const DEFAULT_CATEGORIES=['Vintage','Floral','Minimal','Kids','Wedding','Cupcakes','Bento Box','Other'];
function renderGallery(items=[],site={}){
  const grid=qs('#gallery-grid'), filters=qs('#gallery-filters'); if(!grid||!filters) return;
  const preferred=String(site.gallery_categories||DEFAULT_CATEGORIES.join(',')).split(',').map(x=>x.trim()).filter(Boolean); const extras=[...new Set(items.map(x=>x.category).filter(Boolean))].filter(x=>!preferred.includes(x)); const categories=[site.gallery_all_label||'All',...preferred,...extras]; const allLabel=categories[0];
  filters.innerHTML=categories.map((cat,i)=>`<button class="gallery-filter ${i===0?'active':''}" data-filter="${escapeAttr(cat)}">${escapeHTML(cat)}</button>`).join('');
  const draw=category=>{ const list=category===allLabel?items:items.filter(x=>x.category===category); if(!list.length){ grid.innerHTML=`<div class="gallery-empty">${escapeHTML(site.gallery_empty_text||'No photos added yet.')}</div>`; return; }
    grid.innerHTML=list.map(item=>`<figure class="gallery-item reveal" data-title="${escapeAttr(item.title||'')}" data-category="${escapeAttr(item.category||'')}" data-image="${escapeAttr(assetUrl(item.image||''))}"><img src="${escapeAttr(assetUrl(item.image||''))}" alt="${escapeAttr(item.alt||item.title||'Honey Bee Cakes design')}" loading="lazy"/><figcaption class="gallery-overlay"><strong>${escapeHTML(item.title||'')}</strong><span>${escapeHTML(item.category||'')}</span></figcaption></figure>`).join(''); initReveal(); grid.querySelectorAll('.gallery-item').forEach(item=>item.addEventListener('click',()=>openLightbox(item))); };
  draw(allLabel); filters.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{filters.querySelectorAll('button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');draw(btn.dataset.filter);}));
}

function renderReviews(data={},site={}){
  const grid=qs('#reviews-grid'); if(!grid) return; const items=Array.isArray(data.items)?data.items:[];
  const link=qs('#google-reviews-link'); if(link && data.google_url) link.href=data.google_url;
  const summary=qs('#reviews-summary'); if(summary && (data.rating||data.review_count)){ summary.hidden=false; setText('#reviews-rating',data.rating?`${data.rating} ★`:''); setText('#reviews-count',data.review_count||''); }
  if(!items.length){ grid.innerHTML=''; return; }
  grid.innerHTML=items.map(item=>{ const stars=Math.max(0,Math.min(5,Number(item.stars)||5)); return `<article class="review-card reveal"><div class="review-stars" aria-label="${stars} out of 5 stars">${'★'.repeat(stars)}${'☆'.repeat(5-stars)}</div><blockquote>${escapeHTML(item.text||'')}</blockquote><div class="review-meta"><strong>${escapeHTML(item.author||'')}</strong><span>${escapeHTML(item.date||'')}</span></div></article>`; }).join(''); initReveal();
}

function normalizeFlavourGroup(data,key,defaults){ const raw=data?.[key]; if(Array.isArray(raw)) return {...defaults,items:raw}; if(raw&&typeof raw==='object') return {number:raw.number||defaults.number,title:raw.title||defaults.title,optional_label:raw.optional_label??defaults.optional_label,items:Array.isArray(raw.items)?raw.items:[]}; return {...defaults,items:[]}; }
function renderFlavours(data={}){
  const grid=qs('#flavour-grid'); if(!grid) return; const groups=[
    normalizeFlavourGroup(data,'sponges',{number:'01',title:'Choose a sponge cake',optional_label:''}),
    normalizeFlavourGroup(data,'frostings',{number:'02',title:'Choose a frosting flavour',optional_label:''}),
    normalizeFlavourGroup(data,'fillings',{number:'03',title:'Optional filling',optional_label:'optional'}),
    normalizeFlavourGroup(data,'add_ins',{number:'04',title:'Optional add-in',optional_label:'optional'})
  ];
  grid.innerHTML=groups.map(group=>`<article class="builder-group reveal"><div class="builder-heading"><span class="builder-number">${escapeHTML(group.number)}</span><div><h3>${escapeHTML(group.title)}</h3>${group.optional_label?`<span class="builder-optional">${escapeHTML(group.optional_label)}</span>`:''}</div></div><div class="builder-options">${group.items.map(item=>`<div class="builder-option"><strong>${escapeHTML(item.name||'')}</strong>${item.note?`<span>${escapeHTML(item.note)}</span>`:''}</div>`).join('')}</div></article>`).join(''); initReveal();
}

function renderPricing(items=[],site={}){
  const grid=qs('#size-grid'); if(!grid) return; const max=Math.max(...items.map(x=>Number(x.diameter)||1),1);
  grid.innerHTML=items.map(item=>{ const d=Number(item.diameter)||6; const w=68+(d/max)*72,h=92+(d/max)*48; const visual=item.image?`<img class="size-guide-image" src="${escapeAttr(assetUrl(item.image))}" alt="${escapeAttr(item.image_alt||item.size||'Cake size illustration')}"/>`:`<div class="cake-illustration"><div class="cake-shape four-layer" style="--cake-width:${w}px;--cake-height:${h}px"><i></i><i></i><i></i></div></div>`; return `<article class="size-card reveal"><div class="size-card-top">${visual}<h3>${escapeHTML(item.size||`${d}”`)}</h3></div><div class="size-details"><div><span>${escapeHTML(site.pricing_serves_label||'Approx. serves')}</span><strong>${escapeHTML(item.servings||'—')}</strong></div><div style="text-align:right"><span>${escapeHTML(site.pricing_price_label||'Starts at')}</span><strong>${escapeHTML(item.price||'Quote')}</strong></div></div></article>`; }).join(''); initReveal();
}

function renderFAQ(items=[]){ const list=qs('#faq-list'); if(!list) return; list.innerHTML=items.map((item,i)=>`<article class="faq-item ${i===0?'open':''}"><button class="faq-question" aria-expanded="${i===0?'true':'false'}"><span>${escapeHTML(item.question||'')}</span><span class="faq-plus">+</span></button><div class="faq-answer"><div><p>${escapeHTML(item.answer||'')}</p></div></div></article>`).join(''); list.querySelectorAll('.faq-question').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.faq-item');item.classList.toggle('open');btn.setAttribute('aria-expanded',item.classList.contains('open')?'true':'false');})); }
function renderPolicies(data={}){ if(!qs('#policies-body')) return; setText('#policies-title',data.title,'Policies'); setOptionalText('#policies-intro',data.intro,'Please review these policies before placing your order.'); const body=String(data.body||'').trim(); qs('#policies-body').innerHTML=body?body.split(/\n\s*\n/).map(p=>`<p>${escapeHTML(p).replace(/\n/g,'<br>')}</p>`).join(''):''; }

function initMobileNav(){ const button=qs('.mobile-menu-button'),drawer=qs('.mobile-drawer'),close=qs('.mobile-close'); if(!button||!drawer)return; const shut=()=>{drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');button.setAttribute('aria-expanded','false');};button.addEventListener('click',()=>{drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');button.setAttribute('aria-expanded','true');});close?.addEventListener('click',shut);drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',shut)); }
function initReveal(){ const items=qsa('.reveal'); if(!('IntersectionObserver'in window))return items.forEach(x=>x.classList.add('visible'));const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target);}}),{threshold:.08});items.forEach(el=>obs.observe(el)); }
function openLightbox(item){ const dialog=qs('#lightbox'); if(!dialog)return;qs('#lightbox-image').src=item.dataset.image;qs('#lightbox-image').alt=item.dataset.title||'Cake design';qs('#lightbox-title').textContent=item.dataset.title;qs('#lightbox-category').textContent=item.dataset.category;dialog.showModal(); }
function initLightbox(){ const d=qs('#lightbox');if(!d)return;qs('.lightbox-close')?.addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d)d.close();}); }

(async function init(){
  initMobileNav(); initLightbox();
  const [site,gallery,reviews,flavours,pricing,faq,policies]=await Promise.all([
    getJSON(DATA.site,{}),getJSON(DATA.gallery,[]),getJSON(DATA.reviews,{}),getJSON(DATA.flavours,{}),getJSON(DATA.pricing,[]),getJSON(DATA.faq,[]),getJSON(DATA.policies,{})
  ]);
  renderSite(site); renderGallery(gallery,site); renderReviews(reviews,site); renderFlavours(flavours); renderPricing(pricing,site); renderFAQ(faq); renderPolicies(policies); initReveal();
})();
