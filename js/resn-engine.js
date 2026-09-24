/**
 * DRIP NASSENDES × RESN — ANIMATED ENGINE v2
 * Transições de página · Scroll Reveals · Cursor magnético · Catálogo com vídeos reais
 * Mobile otimizado · Tipografia animada · Counters · Marquee
 */

/* ============================================================
   DADOS DO CATÁLOGO
   ============================================================ */
const WHATSAPP_TERMINAL = '244958438590';

const resnVideoCatalog = [
  {
    id: 1,
    brand: 'Prada',
    title: 'Prada',
    ref: 'DN-PRADA-01',
    src: 'assets/videos/prada.mp4',
    tag: 'Luxury Maison'
  },
  {
    id: 2,
    brand: 'Loro Piana',
    title: 'Loro Piana',
    ref: 'DN-LOROPIANA-02',
    src: 'assets/videos/loropiana.mp4',
    tag: 'Old Money'
  },
  {
    id: 3,
    brand: 'Lacoste',
    title: 'Lacoste',
    ref: 'DN-LACOSTE-03',
    src: 'assets/videos/lacoste.mp4',
    tag: 'Casual Luxe'
  },
  {
    id: 4,
    brand: 'Polo Ralph Lauren',
    title: 'Polo Ralph Lauren',
    ref: 'DN-POLO-04',
    src: 'assets/videos/polo.mp4',
    tag: 'Americana Luxe'
  }
];

/* ============================================================
   SISTEMA DE TRANSIÇÃO DE PÁGINA
   Cria um overlay tripartido que entra e sai suavemente
   ============================================================ */
function setupPageTransitions() {
  // Cria overlay se ainda não existir
  if (!document.getElementById('page-transition-overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.innerHTML = '<div class="pt-panel"></div><div class="pt-panel"></div><div class="pt-panel"></div>';
    document.body.appendChild(overlay);
  }

  if (!document.getElementById('pt-logo')) {
    const logo = document.createElement('img');
    logo.id = 'pt-logo';
    logo.src = 'assets/logo-white.svg';
    logo.alt = 'Drip Nassendes';
    document.body.appendChild(logo);
  }

  const overlay = document.getElementById('page-transition-overlay');
  const ptLogo  = document.getElementById('pt-logo');

  // Captura todos os links internos
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Apenas links internos .html, não externos
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (!href.endsWith('.html') && href !== '/') return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const destination = href;

      // Activa overlay de saída
      overlay.classList.add('entering');
      document.body.classList.add('pt-active');
      ptLogo.style.opacity = '1';
      ptLogo.style.transform = 'translate(-50%, -50%) scale(1)';

      // Após animação, navega
      setTimeout(() => {
        window.location.href = destination;
      }, 700);
    });
  });

  // Ao carregar a página, faz o exit do overlay
  overlay.classList.remove('entering');
  overlay.classList.add('exiting');
  document.body.classList.remove('pt-active');
  ptLogo.style.opacity = '0';
  ptLogo.style.transform = 'translate(-50%, -50%) scale(0.7)';

  // Remove a classe exiting depois da animação
  setTimeout(() => {
    overlay.classList.remove('exiting');
  }, 800);
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
function setupScrollReveal() {
  const classes = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const allTargets = document.querySelectorAll(classes.join(', '));

  if (!allTargets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  allTargets.forEach(el => observer.observe(el));
}

/* ============================================================
   COUNTER ANIMADO (números contadores)
   ============================================================ */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target  = parseFloat(el.dataset.count);
    const suffix  = el.dataset.suffix || '';
    const prefix  = el.dataset.prefix || '';
    const duration = 1800;
    let start = null;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        // Easing out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const val = target * ease;
        el.textContent = prefix + (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }, { threshold: 0.5 });

    observer.observe(el);
  });
}

/* ============================================================
   MARQUEE DINÂMICO
   ============================================================ */
function setupMarquee() {
  document.querySelectorAll('.resn-marquee-track').forEach(track => {
    // Duplica o conteúdo para loop infinito
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
  });
}

/* ============================================================
   HEADER — scroll behaviour
   ============================================================ */
function setupHeader() {
  const header = document.querySelector('.resn-header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = current;
  }, { passive: true });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function setupMobileMenu() {
  const btn = document.querySelector('.resn-mobile-menu-btn');
  const nav = document.querySelector('.resn-mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fecha ao clicar num link dentro do mobile nav
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   ÁUDIO
   ============================================================ */
class ResnAudio {
  constructor() { this.ctx = null; this.enabled = true; }

  init() {
    if (!this.ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) this.ctx = new C();
    }
  }

  tone(freq, endFreq, type, vol, dur) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + dur);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + dur);
    } catch(e) {}
  }

  playHover()  { this.tone(440, 660, 'sine',     0.03, 0.09); }
  playBurst()  { this.tone(100,  35, 'triangle', 0.18, 0.6);  }
  playClick()  { this.tone(880, 440, 'sine',     0.05, 0.12); }

  toggle() {
    this.enabled = !this.enabled;
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
      btn.innerHTML = this.enabled
        ? `<div class="sound-wave-bars"><span class="sound-bar"></span><span class="sound-bar"></span><span class="sound-bar"></span></div><span>AUDIO [ ON ]</span>`
        : `<span>AUDIO [ OFF ]</span>`;
    }
  }
}

const resnSound = new ResnAudio();

/* ============================================================
   INIT GERAL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setupPageTransitions();
  setupScrollReveal();
  setupHeader();
  setupMobileMenu();
  setupMarquee();
  animateCounters();
  initFluidDropletCanvas();
  initCustomCursor();
  initVideoCatalog();
  initResnModal();
  initSoundButton();
});

function initSoundButton() {
  const btn = document.getElementById('sound-toggle-btn');
  if (btn) btn.addEventListener('click', () => { resnSound.init(); resnSound.toggle(); });
}

/* ============================================================
   GOTA LÍQUIDA — SPLASH (paleta dourada/bege)
   ============================================================ */
function initFluidDropletCanvas() {
  const canvas     = document.getElementById('liquid-drip-canvas');
  const splashStage = document.getElementById('resn-splash-stage');
  if (!canvas || !splashStage) return;

  const ctx  = canvas.getContext('2d');
  const dpr  = window.devicePixelRatio || 1;
  const size = 320;
  canvas.width  = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const N = 26;
  const pts = [];
  const R = 102;
  const C = { x: size / 2, y: size / 2 };

  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    pts.push({ angle: a, baseR: R, r: R, targetR: R, vel: 0 });
  }

  let mx = C.x, my = C.y, hover = false;

  canvas.addEventListener('mousemove', e => {
    const rc = canvas.getBoundingClientRect();
    mx = e.clientX - rc.left;
    my = e.clientY - rc.top;
    hover = true;
    resnSound.init();
  });
  canvas.addEventListener('mouseleave', () => { hover = false; });
  canvas.addEventListener('touchmove', e => {
    const rc = canvas.getBoundingClientRect();
    const t = e.touches[0];
    mx = t.clientX - rc.left;
    my = t.clientY - rc.top;
    hover = true;
  }, { passive: true });

  function burst() {
    resnSound.init(); resnSound.playBurst();
    pts.forEach(p => { p.r = R * 1.9; });
    setTimeout(() => splashStage.classList.add('dissolved'), 220);
  }

  splashStage.addEventListener('click',       burst);
  splashStage.addEventListener('touchstart',  burst, { passive: true });

  let frame = 0;
  (function loop() {
    frame++;
    ctx.clearRect(0, 0, size, size);

    pts.forEach(p => {
      const wave = Math.sin(frame * 0.044 + p.angle * 3) * 7 +
                   Math.cos(frame * 0.027 + p.angle * 2.2) * 4.5;
      let dist = 0;
      if (hover) {
        const dx = mx - C.x, dy = my - C.y;
        const ma = Math.atan2(dy, dx);
        let diff = Math.abs(p.angle - ma);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;
        if (diff < Math.PI / 2) dist = (1 - diff / (Math.PI / 2)) * 32;
      }
      p.targetR = p.baseR + wave + dist;
      const force = (p.targetR - p.r) * 0.14;
      p.vel = (p.vel + force) * 0.84;
      p.r += p.vel;
    });

    ctx.save();
    ctx.beginPath();
    const fp = { x: C.x + Math.cos(pts[0].angle) * pts[0].r, y: C.y + Math.sin(pts[0].angle) * pts[0].r };
    ctx.moveTo(fp.x, fp.y);
    for (let i = 0; i < N; i++) {
      const p1 = pts[i], p2 = pts[(i + 1) % N];
      const x1 = C.x + Math.cos(p1.angle) * p1.r, y1 = C.y + Math.sin(p1.angle) * p1.r;
      const x2 = C.x + Math.cos(p2.angle) * p2.r, y2 = C.y + Math.sin(p2.angle) * p2.r;
      ctx.quadraticCurveTo(x1, y1, (x1+x2)/2, (y1+y2)/2);
    }
    ctx.closePath();

    const g = ctx.createRadialGradient(C.x - 24, C.y - 30, 10, C.x, C.y, R + 30);
    g.addColorStop(0,   '#ffffff');
    g.addColorStop(0.2, '#f5e4c0');
    g.addColorStop(0.6, '#c4993e');
    g.addColorStop(1,   'rgba(196,153,62,0.1)');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c4993e';
    ctx.shadowColor = 'rgba(196,153,62,0.7)';
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(loop);
  })();
}

/* ============================================================
   CURSOR PERSONALIZADO (desktop)
   ============================================================ */
function initCustomCursor() {
  const dot  = document.querySelector('.resn-cursor-dot');
  const ring = document.querySelector('.resn-cursor-ring');
  if (!dot || !ring) return;

  // Só activar em pointer: fine (desktop)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  (function renderRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(renderRing);
  })();

  document.querySelectorAll('a, button, .resn-video-card, .resn-splash-stage').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '58px'; ring.style.height = '58px';
      ring.style.borderColor = '#c4993e';
      resnSound.init(); resnSound.playHover();
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '36px'; ring.style.height = '36px';
      ring.style.borderColor = 'rgba(196,153,62,0.4)';
    });
  });
}

/* ============================================================
   CATÁLOGO DE VÍDEOS — com vídeos <video> reais
   ============================================================ */
function initVideoCatalog() {
  const grid = document.getElementById('resn-video-catalog-grid');
  if (!grid) return;

  grid.innerHTML = resnVideoCatalog.map((video, i) => `
    <article
      class="resn-video-card reveal reveal-d${Math.min(i + 1, 4)}"
      id="video-card-${video.id}"
      onclick="openVideoDetailModal(${video.id})"
      role="button"
      tabindex="0"
      aria-label="Ver vídeo ${video.title}"
    >
      <div class="video-card-num">0${i + 1}</div>

      <video
        class="video-card-media"
        src="${video.src}"
        muted loop playsinline preload="metadata"
        onloadeddata="this.closest('.resn-video-card').classList.add('loaded')"
      ></video>

      <div class="video-card-overlay"></div>

      <div class="video-card-top-meta">
        <span class="video-brand-tag">${video.brand}</span>
      </div>

      <div class="video-card-play-center" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </div>

      <div class="video-card-bottom-info">
        <h3 class="video-slot-title">${video.title}</h3>
        <div class="video-slot-cta">
          <span>Encomendar via WhatsApp</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </div>
    </article>
  `).join('');

  // Hover play/pause (desktop)
  resnVideoCatalog.forEach(v => {
    const card = document.getElementById(`video-card-${v.id}`);
    if (!card) return;
    const vid = card.querySelector('video');

    card.addEventListener('mouseenter', () => { vid && vid.play().catch(() => {}); });
    card.addEventListener('mouseleave', () => { if (vid) { vid.pause(); vid.currentTime = 0; } });

    // Touch: play ao tocar
    card.addEventListener('touchstart', () => { vid && vid.play().catch(() => {}); }, { passive: true });

    // Keyboard accessibility
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideoDetailModal(v.id); }
    });

    attach3DTilt(v.id);
  });

  // Re-observa scroll reveals nos novos cards
  setupScrollReveal();
}

function attach3DTilt(id) {
  const card = document.getElementById(`video-card-${id}`);
  if (!card) return;
  // Só tilt em dispositivos com pointer fine
  if (!window.matchMedia('(pointer: fine)').matches) return;

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const cx = r.width / 2,       cy = r.height / 2;
    const rotX = ((y - cy) / cy) * -9;
    const rotY = ((x - cx) / cx) * 9;
    card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
  });
}

/* ============================================================
   MODAL DO VÍDEO
   ============================================================ */
let _modalVideoEl = null;

window.openVideoDetailModal = function(id) {
  const video = resnVideoCatalog.find(v => v.id === id);
  if (!video) return;

  resnSound.init(); resnSound.playClick();

  const modal      = document.getElementById('resn-video-modal');
  const mediaPaneEl = document.getElementById('modal-media-pane');
  const brandEl    = document.getElementById('modal-video-brand');
  const titleEl    = document.getElementById('modal-video-title');
  const descEl     = document.getElementById('modal-video-desc');
  const waBtnEl    = document.getElementById('modal-whatsapp-lead-btn');

  if (mediaPaneEl) {
    mediaPaneEl.innerHTML = `
      <video
        id="modal-video-player"
        src="${video.src}"
        controls autoplay playsinline
        style="width:100%;height:100%;object-fit:cover;display:block;"
      ></video>
    `;
    _modalVideoEl = document.getElementById('modal-video-player');
  }

  if (brandEl) brandEl.textContent = `[ ${video.brand} ]  ·  ${video.tag}`;
  if (titleEl) titleEl.textContent = video.title;
  if (descEl)  descEl.textContent  =
    `Peças da coleção ${video.brand} disponíveis na Drip Nassendes. ` +
    `Contacta-nos pelo WhatsApp 958 438 590 para encomendar, ` +
    `consultar tamanhos e preços, com entrega em Luanda e Províncias.`;

  const msg = `Olá Drip Nassendes! 🙌\nEstou interessado nas peças do vídeo:\n🎬 *${video.title}* (${video.brand})\n\nGostaria de saber preços, tamanhos e entrega em Luanda!`;
  if (waBtnEl) waBtnEl.href = `https://wa.me/${WHATSAPP_TERMINAL}?text=${encodeURIComponent(msg)}`;

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

function initResnModal() {
  const modal    = document.getElementById('resn-video-modal');
  const closeBtn = document.getElementById('resn-modal-close');

  function closeModal() {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    if (_modalVideoEl) { _modalVideoEl.pause(); _modalVideoEl.currentTime = 0; }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
  });
}
