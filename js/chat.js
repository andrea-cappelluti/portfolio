// ---------- ask page: chat with the profile assistant (POST /api/chat, see api/chat.mjs) ----------
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const UNAVAILABLE ="I can't answer right now: the free AI models are busy or out of quota for today. Try again in a minute, or email Andrea at andreacappelluti7@gmail.com.";

export function initChat(root) {
  if (!root) return;
  const log = root.querySelector('.chat-log');
  const starters = root.querySelector('.chat-starters');
  const form = root.querySelector('.chat-form');
  const input = form.elements.q;
  const history = []; // answered turns only, so it always alternates user / assistant
  let busy = false;

  const add = (kind, text) => {
    const msg = document.createElement('li');
    msg.className = `msg msg-${kind}`;
    msg.textContent = text;
    log.append(msg);
    form.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    return msg;
  };

  async function ask(question) {
    if (busy) return;
    busy = true;
    form.setAttribute('aria-busy', 'true');
    starters.hidden = true;
    input.value = '';
    add('user', question);
    const answer = add('bot', 'Thinking…');
    answer.classList.add('is-waiting');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: question }] }),
      });
      const { reply } = await res.json();
      if (!res.ok || !reply) throw new Error(`chat ${res.status}`);
      history.push({ role: 'user', content: question }, { role: 'assistant', content: reply });
      answer.textContent = reply;
    } catch {
      answer.textContent = UNAVAILABLE;
    }
    answer.classList.remove('is-waiting');
    form.removeAttribute('aria-busy');
    busy = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (question) ask(question);
  });
  starters.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (button) ask(button.textContent);
  });
}
