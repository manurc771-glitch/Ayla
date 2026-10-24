/* ===== AYLA — app ===== */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  if (/[?&]motion=1/.test(location.search)) document.documentElement.classList.add('force-motion'); // abre index.html?motion=1 para ver las animaciones aunque el sistema pida reducir movimiento

  var PRODUCTS = window.AYLA_PRODUCTS, COLORS = window.AYLA_COLORS, SIZES = window.AYLA_SIZES, DISCOUNT = window.AYLA_DISCOUNT;
  var CART_KEY = 'ayla.cart', CODE_KEY = 'ayla.code';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  var money = function (n) { return fmt.format(Math.round(n)); };
  var cname = function (c) { return (window.AYLA_COLOR_NAMES || {})[c] || cap(c); };
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var variant = function (p, color) { return p.variants.filter(function (v) { return v.color === color; })[0] || p.variants[0]; };
  var colorsOf = function (p) { return p.variants.map(function (v) { return v.color; }); };
  var imgSrc = function (p, color) { return 'assets/products/' + variant(p, color).img; };
  var byId = function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; };

  /* ---------- safe storage ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  /* ---------- image slots: show filename when the photo is missing ---------- */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    img.classList.add('is-broken');
    var box = img.closest('.ph, .cats__media');
    if (box) { box.classList.add('is-empty'); box.setAttribute('data-file', (img.getAttribute('src') || '').split('/').slice(-1)[0]); }
  }, true);
  document.addEventListener('load', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    img.classList.remove('is-broken');
    var box = img.closest('.ph, .cats__media');
    if (box) box.classList.remove('is-empty');
  }, true);
  function setImg(img, src) { img.src = src; }

  /* ---------- layers (overlay / drawer / modals) ---------- */
  var overlay = $('#overlay'), openLayer = null, lastFocus = null;
  function openL(el) {
    if (openLayer) closeL(true);
    lastFocus = document.activeElement;
    openLayer = el; el.hidden = false; overlay.hidden = false; document.body.classList.add('is-locked');
    var f = $('input, button:not(.close)', el); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 30);
  }
  function closeL(keepFocus) {
    if (!openLayer) return;
    openLayer.hidden = true; overlay.hidden = true; document.body.classList.remove('is-locked'); openLayer = null;
    if (!keepFocus && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  overlay.addEventListener('click', function () { closeL(); });
  document.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeL(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeL(); });
  function notice(title, text) { $('#noticeTitle').textContent = title; $('#noticeText').textContent = text; openL($('#noticeModal')); }

  /* ---------- announcement ---------- */
  var MSGS = ['OBTÉN 10% DE DESCUENTO', 'USA EL CÓDIGO ' + DISCOUNT.code], mi = 0;
  $$('[data-announce]').forEach(function (b) {
    b.addEventListener('click', function () { mi = (mi + parseInt(b.dataset.announce, 10) + MSGS.length) % MSGS.length; $('#announceText').textContent = MSGS[mi]; });
  });

  /* ---------- nav (mobile) ---------- */
  var burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', function () { var o = nav.classList.toggle('is-open'); burger.setAttribute('aria-expanded', o); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }); });

  /* ---------- sliders ---------- */
  var BAG = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 8h14l-1.2 12H6.2L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
  function swatchesHTML(p, active) {
    return colorsOf(p).map(function (c) {
      return '<button class="swatch' + (c === active ? ' is-active' : '') + '" data-color="' + c + '" style="background:' + COLORS[c] + '" aria-label="' + cname(c) + '" title="' + cname(c) + '"></button>';
    }).join('');
  }
  function cardHTML(p) {
    var c = p.variants[0].color, v = p.variants[0];
    return '<article class="card" data-id="' + p.id + '"><div class="card__box">' +
      '<a class="card__media ph" href="#" data-open aria-label="' + p.name + '"><img class="card__img" src="' + imgSrc(p, c) + '" alt="' + p.name + '" loading="lazy">' +
      (v.alt ? '<img class="card__alt" src="assets/products/' + v.alt + '" alt="" loading="lazy">' : '') + '</a>' +
      '<button class="card__quick" data-open aria-label="Agregar rápido ' + p.name + '">' + BAG + '</button></div>' +
      '<h3 class="card__name"><button data-open>' + p.name + '</button></h3>' +
      '<p class="card__price">' + money(p.price) + '</p>' +
      '<div class="swatches">' + swatchesHTML(p, c) + '</div></article>';
  }
  $$('.slider-block').forEach(function (block) {
    var tag = block.dataset.collection, track = $('.track', block);
    var list = PRODUCTS.filter(function (p) { return tag === 'all' || p.tags.indexOf(tag) > -1; });
    if (tag !== 'new') list.sort(function (a, b) { return (a.tags.indexOf('new') > -1) - (b.tags.indexOf('new') > -1); }); // avoid repeating New Merch first
    track.innerHTML = list.map(cardHTML).join('');
    var prev = $('.arrow--prev', block), next = $('.arrow--next', block);
    function step() { var c = $('.card', track); return c ? c.offsetWidth + 6 : 300; }
    function sync() { prev.disabled = track.scrollLeft < 4; next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
    prev.addEventListener('click', function () { track.scrollBy({ left: -step() * 2, behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step() * 2, behavior: 'smooth' }); });
    track.addEventListener('scroll', sync, { passive: true }); window.addEventListener('resize', sync); sync();
  });
  document.addEventListener('click', function (e) {
    var sw = e.target.closest('.card .swatch');
    if (sw) {
      var card = sw.closest('.card'); $$('.swatch', card).forEach(function (s) { s.classList.toggle('is-active', s === sw); });
      setImg($('.card__img', card), imgSrc(byId(card.dataset.id), sw.dataset.color)); return;
    }
    var op = e.target.closest('.card [data-open]');
    if (op) {
      e.preventDefault(); var cd = op.closest('.card'), act = $('.swatch.is-active', cd);
      openProduct(cd.dataset.id, act && act.dataset.color);
    }
  });

  /* ---------- marquees ---------- */
  function fillMarquee(el, text, times) {
    var html = ''; for (var i = 0; i < times; i++) html += '<span>' + text + '</span>';
    el.innerHTML = html + html; // doubled for seamless -50% loop
  }
  fillMarquee($('#marqueeA'), 'SIN LOGO / SIN REGLAS / SOLO TEXTURA / SOLO AIRE /', 6);
  fillMarquee($('#marqueeB'), 'ÚSALA A TU MANERA.', 8);

  /* ---------- categories ---------- */
  var cats = window.AYLA_CATEGORIES, catsList = $('#catsList'), catsImg = $('#catsImg'), catsMedia = $('#catsMedia'), catIdx = 0;
  catsList.innerHTML = cats.map(function (c, i) { return '<li data-i="' + i + '"><button>' + c.label + '</button></li>'; }).join('');
  function setCat(i) {
    catIdx = i; $$('li', catsList).forEach(function (li, k) { li.classList.toggle('is-active', k === i); });
    catsImg.alt = cats[i].label;
    var next = 'assets/categories/' + cats[i].img;
    if (catsImg.getAttribute('src') === next) return;
    catsImg.classList.add('is-swap');
    setTimeout(function () { catsImg.onload = function () { catsImg.classList.remove('is-swap'); }; setImg(catsImg, next); }, 420);
  }
  catsList.addEventListener('mouseover', function (e) { var li = e.target.closest('li'); if (li) setCat(+li.dataset.i); });
  catsList.addEventListener('focusin', function (e) { var li = e.target.closest('li'); if (li) setCat(+li.dataset.i); });
  catsList.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) { setCat(+li.dataset.i); openProduct(cats[li.dataset.i].product); } });
  catsMedia.addEventListener('click', function (e) { e.preventDefault(); openProduct(cats[catIdx].product); });
  setCat(0);

  /* ---------- product modal ---------- */
  var pm = { p: null, color: null, size: null, qty: 1 };
  function renderPM() {
    var p = pm.p;
    setImg($('#pmImg'), imgSrc(p, pm.color)); $('#pmImg').alt = p.name + ' — ' + pm.color;
    $('#pmName').textContent = p.name; $('#pmPrice').textContent = money(p.price); $('#pmColorName').textContent = cname(pm.color);
    $('#pmColors').innerHTML = swatchesHTML(p, pm.color);
    $('#pmSizes').innerHTML = SIZES.map(function (s) { return '<button class="size' + (s === pm.size ? ' is-active' : '') + '" data-size="' + s + '">' + s + '</button>'; }).join('');
    $('#pmQty').textContent = pm.qty; $('#pmError').textContent = '';
  }
  function openProduct(id, color) {
    var p = byId(id); if (!p) return;
    pm = { p: p, color: color && colorsOf(p).indexOf(color) > -1 ? color : p.variants[0].color, size: null, qty: 1 };
    renderPM(); openL($('#productModal'));
  }
  $('#pmColors').addEventListener('click', function (e) { var b = e.target.closest('.swatch'); if (b) { pm.color = b.dataset.color; renderPM(); } });
  $('#pmSizes').addEventListener('click', function (e) { var b = e.target.closest('.size'); if (b) { pm.size = b.dataset.size; renderPM(); } });
  $('#pmMinus').addEventListener('click', function () { pm.qty = Math.max(1, pm.qty - 1); $('#pmQty').textContent = pm.qty; });
  $('#pmPlus').addEventListener('click', function () { pm.qty = Math.min(10, pm.qty + 1); $('#pmQty').textContent = pm.qty; });
  $('#pmAdd').addEventListener('click', function () {
    if (!pm.size) { $('#pmError').textContent = 'Selecciona una talla.'; return; }
    document.dispatchEvent(new CustomEvent('ayla:add', { detail: { src: $('#pmImg').src, rect: $('#pmMedia').getBoundingClientRect() } }));
    addToCart(pm.p.id, pm.color, pm.size, pm.qty); closeL(true); toast(pm.p.name + ' agregado al carrito'); openCart();
  });

  /* ---------- cart ---------- */
  var cart = store.get(CART_KEY, []).filter(function (l) { return byId(l.id); });
  var code = store.get(CODE_KEY, '');
  function save() { store.set(CART_KEY, cart); store.set(CODE_KEY, code); }
  function addToCart(id, color, size, qty) {
    var key = [id, color, size].join('|'), line = cart.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty = Math.min(10, line.qty + qty); else cart.push({ key: key, id: id, color: color, size: size, qty: qty });
    save(); renderCart();
    var btn = $('#btnCart'); btn.classList.remove('is-bump'); void btn.offsetWidth; btn.classList.add('is-bump');
  }
  var toastT;
  function toast(msg) { var t = $('#toast'); t.textContent = msg; t.classList.add('is-show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-show'); }, 2200); }
  function totals() {
    var sub = cart.reduce(function (s, l) { return s + byId(l.id).price * l.qty; }, 0);
    var disc = code === DISCOUNT.code ? Math.round(sub * DISCOUNT.rate) : 0;
    return { sub: sub, disc: disc, total: sub - disc };
  }
  function renderCart() {
    var items = $('#cartItems'), count = cart.reduce(function (s, l) { return s + l.qty; }, 0), cc = $('#cartCount');
    cc.textContent = count; cc.dataset.zero = count === 0;
    if (!cart.length) {
      items.innerHTML = '<p class="drawer__empty">Tu carrito está vacío.</p>'; $('#btnCheckout').disabled = true;
    } else {
      $('#btnCheckout').disabled = false;
      items.innerHTML = cart.map(function (l, i) {
        var p = byId(l.id);
        return '<div class="line" data-key="' + l.key + '" style="--i:' + i + '">' +
          '<div class="ph"><img src="' + imgSrc(p, l.color) + '" alt="' + p.name + '"></div>' +
          '<div><p class="line__name">' + p.name + '</p><p class="line__meta">' + cname(l.color) + ' / ' + l.size + '</p>' +
          '<div class="qty"><button data-act="minus" aria-label="Menos">&minus;</button><output>' + l.qty + '</output><button data-act="plus" aria-label="Más">+</button></div></div>' +
          '<div><p class="line__price">' + money(p.price * l.qty) + '</p><button class="line__remove" data-act="remove">Eliminar</button></div></div>';
      }).join('');
    }
    var t = totals();
    $('#subtotal').textContent = money(t.sub); $('#discount').textContent = '-' + money(t.disc);
    $('#discountRow').hidden = !t.disc; $('#total').textContent = money(t.total); $('#checkoutTotal').textContent = money(t.total);
    var msg = $('#codeMsg');
    if (code === DISCOUNT.code) { msg.textContent = 'Código ' + code + ' aplicado.'; msg.className = 'code__msg is-ok'; }
  }
  $('#cartItems').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var key = b.closest('.line').dataset.key, line = cart.filter(function (l) { return l.key === key; })[0]; if (!line) return;
    if (b.dataset.act === 'plus') line.qty = Math.min(10, line.qty + 1);
    if (b.dataset.act === 'minus') line.qty = Math.max(1, line.qty - 1);
    if (b.dataset.act === 'remove') cart = cart.filter(function (l) { return l !== line; });
    save(); renderCart();
  });
  $('#codeForm').addEventListener('submit', function (e) {
    e.preventDefault(); var v = $('#codeInput').value.trim().toUpperCase(), msg = $('#codeMsg');
    if (v === DISCOUNT.code) { code = v; save(); renderCart(); }
    else { code = ''; save(); renderCart(); msg.textContent = v ? 'Código inválido.' : 'Ingresa un código.'; msg.className = 'code__msg is-bad'; }
  });
  function openCart() { openL($('#drawer')); }
  $('#btnCart').addEventListener('click', openCart);

  /* ---------- checkout (no payment gateway yet) ---------- */
  $('#btnCheckout').addEventListener('click', function () {
    if (!cart.length) return;
    $('#checkoutForm').hidden = false; $('#checkoutNotice').hidden = true; $('#checkoutError').textContent = ''; renderCart();
    openL($('#checkoutModal'));
  });
  function validate(form, errEl) {
    var ok = true, first = null;
    $$('input, textarea', form).forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.classList.toggle('is-invalid', bad); if (bad) { ok = false; first = first || f; }
    });
    errEl.textContent = ok ? '' : 'Completa los campos resaltados.';
    if (first) first.focus();
    return ok;
  }
  $('#checkoutForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(e.target, $('#checkoutError'))) return;
    e.target.hidden = true; $('#checkoutNotice').hidden = false; // payment gateway: pending integration
  });
  $('#contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(e.target, $('#contactError'))) return;
    var d = new FormData(e.target);
    window.location.href = 'mailto:hello@ayla.store?subject=' + encodeURIComponent('Mensaje de ' + d.get('name')) +
      '&body=' + encodeURIComponent(d.get('message') + '\n\n' + d.get('name') + ' — ' + d.get('email'));
    e.target.reset();
  });

  /* ---------- search ---------- */
  var sInput = $('#searchInput'), sRes = $('#searchResults');
  function runSearch() {
    var q = sInput.value.trim().toLowerCase();
    var list = !q ? [] : PRODUCTS.filter(function (p) { return (p.name + ' ' + colorsOf(p).map(function (c) { return c + ' ' + cname(c); }).join(' ')).toLowerCase().indexOf(q) > -1; });
    sRes.innerHTML = !q ? '' : !list.length ? '<p class="empty">Sin resultados para “' + q.replace(/</g, '&lt;') + '”.</p>' :
      list.map(function (p) {
        return '<button class="sr" data-id="' + p.id + '"><div class="ph"><img src="' + imgSrc(p, p.variants[0].color) + '" alt=""></div><b>' + p.name + '</b><span>' + money(p.price) + '</span></button>';
      }).join('');
  }
  sInput.addEventListener('input', runSearch);
  sRes.addEventListener('click', function (e) { var b = e.target.closest('.sr'); if (b) { closeL(true); openProduct(b.dataset.id); } });
  $('#btnSearch').addEventListener('click', function () { openL($('#search')); sInput.value = ''; runSearch(); });

  /* ---------- account (backend pending) ---------- */
  $('#btnAccount').addEventListener('click', function () { notice('Cuenta', 'Las cuentas de clientes estarán disponibles cuando la tienda esté en línea.'); });

  /* ---------- effects ---------- */
  var header = $('#header'), banner = $('.banner'), bannerImg = $('.banner__img'), ticking = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !document.documentElement.classList.contains('force-motion');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
    if (reduce) return;
    var r = banner.getBoundingClientRect(), vh = window.innerHeight;
    if (r.top < vh && r.bottom > 0) bannerImg.style.transform = 'translateY(' + ((r.top + r.height / 2 - vh / 2) * -0.12).toFixed(1) + 'px) scale(1.12)';
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); } }, { passive: true });
  onScroll();
  var revealEls = $$('.slider-block, .cats__list li, .cats__media, .about p, .contact .form, .section-title, .card');
  revealEls.forEach(function (el, i) { el.classList.add('reveal'); if (el.classList.contains('card') || el.tagName === 'LI' || el.tagName === 'FIGURE') el.style.setProperty('--rd', ((i % 6) * 0.07) + 's'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else revealEls.forEach(function (el) { el.classList.add('is-in'); });

  var lbGrid = $('.lookbook__grid');
  if (lbGrid) {
    if ('IntersectionObserver' in window) {
      var lio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { lbGrid.classList.add('is-in'); lio.disconnect(); } }); }, { threshold: 0.12 });
      lio.observe(lbGrid);
    } else lbGrid.classList.add('is-in');
  }

  /* ---------- init ---------- */
  $('#year').textContent = new Date().getFullYear();
  renderCart();
  $$('img').forEach(function (img) { // images that failed before the listeners were attached
    if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
  });
})();
