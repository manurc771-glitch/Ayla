/* ===== AYLA — motion & effects =====
   Todo el movimiento vive aquí. Si el usuario pidió "reducir movimiento", este archivo no hace nada
   y la web queda estática pero totalmente funcional. */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !document.documentElement.classList.contains('force-motion')) return;

  var root = document.documentElement;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  root.classList.add('fx');

  /* ---------- intro curtain ---------- */
  var intro = document.createElement('div');
  intro.className = 'intro'; intro.innerHTML = '<span>AYLA</span>';
  document.body.appendChild(intro); document.body.classList.add('is-locked');
  var started = false;
  function endIntro() {
    if (started) return; started = true;
    intro.classList.add('is-out'); document.body.classList.remove('is-locked'); root.classList.add('is-ready');
    var ht = $('.hero__title'); if (ht) ht.classList.add('is-in');
    setTimeout(function () { intro.remove(); }, 1200);
  }
  if (document.readyState === 'complete') setTimeout(endIntro, 900);
  else window.addEventListener('load', function () { setTimeout(endIntro, 900); });
  setTimeout(endIntro, 3500); // safety net

  /* ---------- split text into masked words / letters ---------- */
  function split(el, chars) {
    var t = el.textContent.trim(), i = 0, html = '';
    el.setAttribute('aria-label', t);
    (chars ? t.split('') : t.split(/\s+/)).forEach(function (p) {
      html += '<span class="w" aria-hidden="true"><span style="--i:' + (i++) + '">' + (p === ' ' ? '&nbsp;' : p) + '</span></span>' + (chars ? '' : ' ');
    });
    el.innerHTML = html;
  }
  $$('.hero__title, .slider-title, .section-title').forEach(function (el) { split(el, false); });
  var wm = $('.wordmark'); if (wm) split(wm, true);
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.35 }) : null;
  if (wm) { if (io) io.observe(wm); else wm.classList.add('is-in'); }

  /* ---------- progress bar + header hide + parallax + marquee velocity (single rAF loop) ---------- */
  var bar = document.createElement('div'); bar.className = 'progress'; document.body.appendChild(bar);
  var header = $('#header'), hero = $('.hero'), heroImg = $('.hero__img'), heroCopy = $('.hero__copy');
  var anims = [], lastY = window.scrollY, vel = 0, rate = 1;
  setTimeout(function () { anims = $$('.marquee__inner').map(function (el) { return el.getAnimations()[0]; }).filter(Boolean); }, 300);
  var cx = -100, cy = -100, tx = -100, ty = -100, cursor = null, cursorLabel = null;

  function frame() {
    var y = window.scrollY, dv = y - lastY; lastY = y;
    vel += (dv - vel) * 0.18;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0).toFixed(4) + ')';
    if (!document.body.classList.contains('is-locked')) {
      if (dv > 3 && y > 300) header.classList.add('is-hidden');
      else if (dv < -3 || y < 300) header.classList.remove('is-hidden');
    }
    var hh = hero.offsetHeight;
    if (y < hh) {
      heroImg.style.translate = '0 ' + (y * 0.28).toFixed(1) + 'px';
      heroCopy.style.translate = '0 ' + (y * -0.14).toFixed(1) + 'px';
      heroCopy.style.opacity = Math.max(0, 1 - y / (hh * 0.6)).toFixed(2);
    }
    var target = 1 + Math.min(Math.abs(vel), 40) * 0.25; rate += (target - rate) * 0.1;
    for (var i = 0; i < anims.length; i++) anims[i].playbackRate = rate;
    if (cursor) {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- custom cursor (mouse only) ---------- */
  if (fine) {
    cursor = document.createElement('div'); cursor.className = 'cursor'; cursor.innerHTML = '<span></span>';
    cursorLabel = $('span', cursor); document.body.appendChild(cursor);
    $$('.card__media, .cats__media').forEach(function (el) { el.setAttribute('data-cursor', 'Ver'); });
    $$('.track').forEach(function (el) { el.setAttribute('data-cursor', 'Arrastra'); });
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; cursor.classList.add('is-on'); }, { passive: true });
    document.addEventListener('mouseleave', function () { cursor.classList.remove('is-on'); });
    document.addEventListener('mouseover', function (e) {
      var d = e.target.closest('[data-cursor]');
      cursor.classList.toggle('has-label', !!d); if (d) cursorLabel.textContent = d.getAttribute('data-cursor');
      cursor.classList.toggle('is-link', !d && !!e.target.closest('a, button, input, textarea, [role="button"]'));
    });
    document.addEventListener('mousedown', function () { cursor.classList.add('is-down'); });
    document.addEventListener('mouseup', function () { cursor.classList.remove('is-down'); });

    /* magnetic buttons */
    var mag = '.btn, .header__icons button, .arrow';
    document.addEventListener('mousemove', function (e) {
      var el = e.target.closest(mag); if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.translate = ((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + 'px';
    });
    document.addEventListener('mouseout', function (e) {
      var el = e.target.closest(mag); if (!el || el.contains(e.relatedTarget)) return;
      var from = el.style.translate || '0 0'; el.style.translate = '';
      if (el.animate) el.animate([{ translate: from }, { translate: '0 0' }], { duration: 450, easing: 'cubic-bezier(.2,.9,.3,1.4)' });
    });

    /* 3D tilt on product cards */
    document.addEventListener('mousemove', function (e) {
      var box = e.target.closest('.card__box'); if (!box) return;
      var m = $('.card__media', box), r = box.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      m.style.setProperty('--rx', (-py * 9).toFixed(2) + 'deg'); m.style.setProperty('--ry', (px * 11).toFixed(2) + 'deg');
      m.style.setProperty('--mx', px.toFixed(3)); m.style.setProperty('--my', py.toFixed(3));
    });
    document.addEventListener('mouseout', function (e) {
      var box = e.target.closest('.card__box'); if (!box || box.contains(e.relatedTarget)) return;
      var m = $('.card__media', box);
      ['--rx', '--ry', '--mx', '--my'].forEach(function (p) { m.style.removeProperty(p); });
    });
  }

  /* ---------- sliders: drag to scroll + progress bar ---------- */
  $$('.slider-block').forEach(function (block) {
    var track = $('.track', block);
    var rail = document.createElement('div'); rail.className = 'bar'; rail.innerHTML = '<i></i>'; block.appendChild(rail);
    var fill = $('i', rail);
    function upd() {
      var vis = track.clientWidth / track.scrollWidth, maxS = track.scrollWidth - track.clientWidth;
      var ratio = maxS > 0 ? track.scrollLeft / maxS : 0;
      fill.style.width = (vis * 100).toFixed(1) + '%';
      fill.style.transform = 'translateX(' + (ratio * (1 / vis - 1) * 100).toFixed(1) + '%)';
    }
    track.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();

    var down = false, sx = 0, sl = 0, moved = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = 0; sx = e.clientX; sl = track.scrollLeft; track.classList.add('is-drag');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return; var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); track.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () { if (!down) return; down = false; track.classList.remove('is-drag'); });
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });
    track.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
  });

  /* ---------- fly-to-cart ---------- */
  document.addEventListener('ayla:add', function (e) {
    var src = e.detail.src, r = e.detail.rect, cart = $('#btnCart').getBoundingClientRect();
    var w = 150, h = 190, fly = document.createElement('img');
    fly.src = src; fly.className = 'fly';
    fly.style.cssText = 'left:' + (r.left + r.width / 2 - w / 2) + 'px;top:' + (r.top + r.height / 2 - h / 2) + 'px;width:' + w + 'px;height:' + h + 'px';
    document.body.appendChild(fly);
    var dx = cart.left + cart.width / 2 - (r.left + r.width / 2), dy = cart.top + cart.height / 2 - (r.top + r.height / 2);
    var a = fly.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
      { transform: 'translate(' + dx * 0.35 + 'px,' + (dy * 0.2 - 60) + 'px) scale(.7) rotate(-6deg)', opacity: 1, offset: 0.4 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.06) rotate(10deg)', opacity: 0.2 }
    ], { duration: 900, easing: 'cubic-bezier(.5,0,.2,1)' });
    a.onfinish = function () { fly.remove(); };
  });
})();
