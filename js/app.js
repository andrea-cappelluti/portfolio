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
  if (!view.contains(video)) video?.pause(); // the film (and its music) stops when you leave the home page

  // Project pages keep "Projects" highlighted in the bar.
  const section = '/' + (view.dataset.route.split('/')[1] ?? '');
  document.querySelectorAll('.bar-links a').forEach((a) => {
    if (a.getAttribute('href') === section) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  setMenu(false);
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
  const list = document.querySelector('.project-tiles');
  const cards = [...list.children];
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
    cards.forEach((c) => { c.hidden = tab.dataset.filter !== 'all' && c.dataset.kind !== tab.dataset.filter; });
    // Restart the cards' entrance so the new selection visibly settles in.
    list.classList.remove('is-filtered');
    void list.offsetWidth;
    list.classList.add('is-filtered');
  }));
}

// ---------- bar: turns dark while a dark band sits under it ----------
const bar = document.querySelector('.bar');
function syncBar() {
  const under = document.elementsFromPoint(innerWidth / 2, bar.offsetHeight / 2).find((el) => !bar.contains(el));
  bar.classList.toggle('is-dark', Boolean(under?.closest('.band-dark')));
}

// ---------- phone menu: the bar's links open as a full-screen sheet ----------
const menuButton = document.querySelector('.bar-menu');
function setMenu(open) {
  bar.classList.toggle('is-open', open);
  document.documentElement.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

function initMenu() {
  menuButton.addEventListener('click', () => {
    const open = !bar.classList.contains('is-open');
    setMenu(open);
    if (open) bar.querySelector('.bar-links a').focus();
  });
  // Links to the page already shown don't go through show(), so close on any bar link.
  bar.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bar.classList.contains('is-open')) { setMenu(false); menuButton.focus(); }
  });
  matchMedia('(min-width: 840px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
}

// ---------- hero film: plays once, muted, at 0.9x; seek bar, play / pause / replay and music ----------
const video = document.getElementById('hero-video');
function initHeroFilm() {
  const sound = document.querySelector('.sound');
  const playpause = document.querySelector('.playpause');
  const seek = document.querySelector('.film-seek');
  const time = document.querySelector('.film-time');
  if (!video || !sound || !playpause || !seek || !time) return;
  video.defaultPlaybackRate = video.playbackRate = 0.9;
  const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const syncPlay = () => {
    const state = video.ended ? 'ended' : video.paused ? 'paused' : 'playing';
    playpause.dataset.state = state;
    playpause.setAttribute('aria-label', { ended: 'Replay video', paused: 'Play video', playing: 'Pause video' }[state]);
  };
  // The bar follows the video on every frame while it plays, so it glides instead of stepping.
  let frame = 0;
  const syncTime = () => {
    const total = video.duration || Number(seek.max);
    seek.max = total;
    seek.value = video.currentTime;
    seek.style.setProperty('--played', `${(video.currentTime / total) * 100}%`);
    time.textContent = `${clock(video.currentTime)} / ${clock(total)}`;
    cancelAnimationFrame(frame);
    if (!video.paused) frame = requestAnimationFrame(syncTime);
  };
  ['play', 'pause', 'ended', 'seeked'].forEach((type) => video.addEventListener(type, syncPlay));
  ['play', 'pause', 'seeking', 'timeupdate', 'loadedmetadata'].forEach((type) => video.addEventListener(type, syncTime));
  if (reduceMotion.matches) { video.removeAttribute('autoplay'); video.pause(); }
  syncPlay();
  syncTime();

  const toggle = () => (video.paused ? video.play() : video.pause());
  playpause.addEventListener('click', toggle);
  video.addEventListener('click', toggle);
  seek.addEventListener('input', () => { video.currentTime = Number(seek.value); });
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
initMenu();
addEventListener('scroll', syncBar, { passive: true });
addEventListener('resize', syncBar);
initRouter();
