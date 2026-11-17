// ---------- ask page: chat with the profile assistant (POST /api/chat, see api/chat.mjs) ----------
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const UNAVAILABLE = "I can't answer right now: the free AI models are busy or out of quota for today. Try again in a minute, or email Andrea at andreacappelluti7@gmail.com.";
// Web addresses, email addresses and this site's own pages become links; everything else stays text.
const LINK = /(https?:\/\/[^\s)]*[^\s).,;:!?]|[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}|(?<![\w/.])\/(?:work|projects(?:\/[\w-]+)?|thesis|about|contact|CV_Andrea_Cappelluti\.pdf)(?![\w/-]))/g;

function fill(msg, text) {
  msg.replaceChildren(...text.split(LINK).map((part, i) => {
    if (i % 2 === 0) return part;
    const a = document.createElement('a');
    a.textContent = part;
    a.href = part.includes('@') ? `mailto:${part}` : part;
    if (part.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener'; }
    if (part.endsWith('.pdf')) a.download = '';
    return a;
  }));
}

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
    input.value = '';
    add('user', question);
    const answer = add('bot', '');
    answer.innerHTML = '<span class="typing" role="img" aria-label="Thinking"><i></i><i></i><i></i></span>';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: question }] }),
      });
      const { reply } = await res.json();
      if (!res.ok || !reply) throw new Error(`chat ${res.status}`);
      history.push({ role: 'user', content: question }, { role: 'assistant', content: reply });
      fill(answer, reply);
    } catch {
      fill(answer, UNAVAILABLE);
    }
    form.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    form.removeAttribute('aria-busy');
    busy = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (question) ask(question);
  });
  // A starter leaves once it has been asked; the others stay as follow-ups.
  starters.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button || busy) return;
    ask(button.textContent);
    button.remove();
    starters.hidden = !starters.children.length;
  });
}
