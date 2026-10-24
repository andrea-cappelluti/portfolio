import { initShowUp } from './showup.js';
import { initChat } from './chat.js';

// ---------- router: one view per URL, History API, scroll restored on Back/Forward ----------
const views = [...document.querySelectorAll('.view')];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

const normalise = (path) => path.replace(/\/+$/, '') || '/';
const findView = (path) => views.find((v) => v.dataset.route === normalise(path));

function show(path, { y = 0, focus = false } = {}) {
  let view = findView(path);
  if (!view) {
    view = findView('/');
    history.replaceState(history.state, '', '/');
  }
  views.forEach((v) => v.classList.toggle('is-active', v === view));
  document.title = view.dataset.title;

  // Project pages keep "Projects" highlighted in the bar.
  const section = '/' + (view.dataset.route.split('/')[1] ?? '');
  document.querySelectorAll('.bar-links a').forEach((a) => {
    if (a.getAttribute('href') === section) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  revealIn(view);
  scrollTo({ top: y, behavior: 'instant' });
  syncBar();
  if (focus) view.querySelector('h1')?.focus({ preventScroll: true });
}

function navigate(url) {
  const target = normalise(url.pathname);
  if (target === normalise(location.pathname)) {
    if (url.hash) document.querySelector(url.hash)?.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    else scrollTo({ top: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    return;
  }
  history.replaceState({ ...history.state, y: scrollY }, '');
  history.pushState({ y: 0 }, '', target + url.hash);
  show(target, { focus: true });
  if (url.hash) document.querySelector(url.hash)?.scrollIntoView({ behavior: 'instant' });
}

function initRouter() {
  history.scrollRestoration = 'manual';

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="/"]');
    if (!a || a.hasAttribute('download') || a.target) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(new URL(a.href));
  });

  addEventListener('popstate', () => show(location.pathname, { y: history.state?.y ?? 0 }));

  show(location.pathname);
  if (location.hash) document.querySelector(location.hash)?.scrollIntoView({ behavior: 'instant' });
}

// ---------- entrances: staggered, once per element, armed when a view is shown ----------
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
  : null;

function revealIn(view) {
  view.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));
}

// ---------- projects filter: pill tabs show one kind of project ----------
function initFilter() {
  const tabs = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.project-tiles > li')];
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
    cards.forEach((c) => { c.hidden = tab.dataset.filter !== 'all' && c.dataset.kind !== tab.dataset.filter; });
  }));
}

// ---------- bar: turns dark while a dark band sits under it ----------
const bar = document.querySelector('.bar');
function syncBar() {
  const under = document.elementsFromPoint(innerWidth / 2, bar.offsetHeight / 2).find((el) => !bar.contains(el));
  bar.classList.toggle('is-dark', Boolean(under?.closest('.band-dark')));
}

// ---------- hero film: muted autoplay loop at 0.9x; buttons for pause and music ----------
function initHeroFilm() {
  const video = document.getElementById('hero-video');
  const sound = document.querySelector('.sound');
  const playpause = document.querySelector('.playpause');
  if (!video || !sound || !playpause) return;
  video.defaultPlaybackRate = video.playbackRate = 0.9;
  const syncPlay = () => {
    playpause.setAttribute('aria-pressed', String(video.paused));
    playpause.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
  };
  video.addEventListener('play', syncPlay);
  video.addEventListener('pause', syncPlay);
  if (reduceMotion.matches) { video.removeAttribute('autoplay'); video.pause(); }
  syncPlay();
  playpause.addEventListener('click', () => (video.paused ? video.play() : video.pause()));
  sound.addEventListener('click', () => {
    video.muted = !video.muted;
    sound.setAttribute('aria-pressed', String(!video.muted));
    sound.setAttribute('aria-label', video.muted ? 'Play music' : 'Mute music');
    if (!video.muted && video.paused) video.play();
  });
}

initShowUp(document.querySelector('.model'));
initChat(document.querySelector('.chat'));
initFilter();
initHeroFilm();
addEventListener('scroll', syncBar, { passive: true });
addEventListener('resize', syncBar);
initRouter();
