// Illustrative show-up model: each departure spreads its desk passengers over the hours before
// take-off with a gamma-shaped kernel; the morning curve is the sum of those kernels on 15-minute bins.
// This mirrors the thesis idea (show-up kernel convolved with the flight schedule), not its data.

const FLIGHTS = [
  { time: '06:05', city: 'Milan Linate', type: 'domestic', pax: 180, on: true },
  { time: '06:50', city: 'Paris CDG', type: 'schengen', pax: 170, on: true },
  { time: '07:35', city: 'London Heathrow', type: 'international', pax: 190, on: true },
  { time: '08:20', city: 'Barcelona', type: 'schengen', pax: 180, on: false },
  { time: '09:40', city: 'New York JFK', type: 'longhaul', pax: 290, on: true },
  { time: '10:15', city: 'Catania', type: 'domestic', pax: 190, on: false },
];

// Minutes before departure: mean and spread of arrivals, and when the desk closes.
const KERNELS = {
  domestic: { label: 'Domestic', mean: 75, sd: 28, close: 40 },
  schengen: { label: 'Schengen', mean: 95, sd: 32, close: 40 },
  international: { label: 'Non-Schengen', mean: 120, sd: 38, close: 50 },
  longhaul: { label: 'Long-haul', mean: 170, sd: 45, close: 60 },
};

const BIN = 15;
const START = 3 * 60 + 30; // 03:30
const END = 10 * 60; // 10:00
const BINS = (END - START) / BIN;
const PAX_PER_DESK = BIN / 2; // two minutes per passenger

const toMinutes = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const toClock = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

// Share of a flight's passengers arriving in each bin, normalised to 1.
function kernelBins(flight) {
  const { mean, sd, close } = KERNELS[flight.type];
  const k = (mean / sd) ** 2;
  const theta = sd ** 2 / mean;
  const dep = toMinutes(flight.time);
  const bins = new Array(BINS).fill(0);
  let total = 0;
  for (let m = close; m <= 300; m++) {
    const w = m ** (k - 1) * Math.exp(-m / theta);
    total += w;
    const b = Math.floor((dep - m - START) / BIN);
    if (b >= 0 && b < BINS) bins[b] += w;
  }
  return bins.map((w) => w / total);
}

const KERNEL_CACHE = FLIGHTS.map(kernelBins);

export function initShowUp(root) {
  if (!root) return;
  const flightsEl = root.querySelector('.model-flights');
  const chartEl = root.querySelector('.model-chart');
  const share = root.querySelector('#share');
  const shareOut = root.querySelector('#share-out');
  const out = { time: root.querySelector('#peak-time'), pax: root.querySelector('#peak-pax'), desks: root.querySelector('#peak-desks') };

  flightsEl.innerHTML = FLIGHTS.map((f, i) => `
    <button class="flight" type="button" aria-pressed="${f.on}" data-i="${i}">
      <b>${f.time}</b><span>${f.city}</span><span>${KERNELS[f.type].label}, ${f.pax} pax</span>
    </button>`).join('');

  const W = 780, H = 260, PAD_B = 28, GAP = 4;
  const bw = W / BINS;
  const labels = [];
  for (let t = START + 30, n = 0; t <= END; t += 60, n++) labels.push(`<text class="${n % 2 ? 'is-odd' : ''}" x="${((t - START) / BIN) * bw}" y="${H + 12}" text-anchor="middle">${toClock(t)}</text>`);
  chartEl.innerHTML = `
    <svg viewBox="0 0 ${W} ${H + 16}" role="img" aria-label="Passengers arriving at the desks per quarter hour">
      ${Array.from({ length: BINS }, (_, b) => `<rect class="bar-rect" x="${b * bw + GAP / 2}" y="0" width="${bw - GAP}" height="${H - PAD_B}" rx="3" style="transform:scaleY(0)"><title></title></rect>`).join('')}
      ${labels.join('')}
    </svg>`;
  const rects = [...chartEl.querySelectorAll('.bar-rect')];

  function render() {
    const desk = Number(share.value) / 100;
    shareOut.value = `${share.value}%`;
    const sums = new Array(BINS).fill(0);
    FLIGHTS.forEach((f, i) => { if (f.on) KERNEL_CACHE[i].forEach((v, b) => { sums[b] += v * f.pax * desk; }); });
    const peak = Math.max(...sums);
    const peakBin = sums.indexOf(peak);
    const scale = Math.max(80, Math.ceil(peak / 20) * 20);
    rects.forEach((r, b) => {
      r.style.transform = `scaleY(${Math.max(0.004, sums[b] / scale)})`;
      r.classList.toggle('is-peak', peak > 0 && b === peakBin);
      r.querySelector('title').textContent = `${toClock(START + b * BIN)}: ${Math.round(sums[b])} passengers`;
    });
    const anyOn = FLIGHTS.some((f) => f.on);
    out.time.textContent = anyOn ? `${toClock(START + peakBin * BIN)}–${toClock(START + (peakBin + 1) * BIN)}` : '–';
    out.pax.textContent = anyOn ? Math.round(peak) : '0';
    out.desks.textContent = anyOn ? Math.ceil(peak / PAX_PER_DESK) : '0';
  }

  flightsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.flight');
    if (!btn) return;
    const f = FLIGHTS[btn.dataset.i];
    f.on = !f.on;
    btn.setAttribute('aria-pressed', f.on);
    render();
  });
  share.addEventListener('input', render);
  requestAnimationFrame(() => requestAnimationFrame(render));
}
