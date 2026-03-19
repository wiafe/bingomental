// Synthesized glassy / cozy sound effects using Web Audio API
// All sounds are generated procedurally — no audio files needed.

let ctx: AudioContext | null = null;

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// ── helpers ──────────────────────────────────────────────────────────
function gain(a: AudioContext, v: number) {
  const g = a.createGain();
  g.gain.value = v;
  g.connect(a.destination);
  return g;
}

function osc(
  a: AudioContext,
  type: OscillatorType,
  freq: number,
  dest: AudioNode,
  start: number,
  stop: number,
) {
  const o = a.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  o.connect(dest);
  o.start(start);
  o.stop(stop);
  return o;
}

function env(
  g: GainNode,
  t: number,
  peak: number,
  attack: number,
  decay: number,
  sustain: number,
  release: number,
) {
  const p = g.gain;
  p.setValueAtTime(0, t);
  p.linearRampToValueAtTime(peak, t + attack);
  p.linearRampToValueAtTime(sustain, t + attack + decay);
  p.linearRampToValueAtTime(0, t + attack + decay + release);
}

// ── UI sounds ────────────────────────────────────────────────────────

/** Very soft glass tap — cell hover */
export function sfxHover() {
  const a = ac(), t = a.currentTime;
  const g = gain(a, 0);
  env(g, t, 0.04, 0.005, 0.03, 0.01, 0.06);
  osc(a, "sine", 3200, g, t, t + 0.1);
  osc(a, "sine", 4800, g, t, t + 0.1);
}

/** Soft glass click — buttons, cell tap */
export function sfxClick() {
  const a = ac(), t = a.currentTime;
  const g = gain(a, 0);
  env(g, t, 0.07, 0.003, 0.04, 0.02, 0.1);
  osc(a, "sine", 1800, g, t, t + 0.15);
  const g2 = gain(a, 0);
  env(g2, t, 0.04, 0.003, 0.02, 0.01, 0.08);
  osc(a, "sine", 3600, g2, t, t + 0.1);
}

/** Gentle crystalline placement — ability placed on cell */
export function sfxPlace() {
  const a = ac(), t = a.currentTime;
  const g = gain(a, 0);
  env(g, t, 0.08, 0.005, 0.06, 0.03, 0.15);
  const o = osc(a, "sine", 1200, g, t, t + 0.25);
  o.frequency.linearRampToValueAtTime(1800, t + 0.08);
  const g2 = gain(a, 0);
  env(g2, t + 0.03, 0.04, 0.005, 0.04, 0.02, 0.12);
  osc(a, "sine", 3600, g2, t + 0.03, t + 0.22);
}

/** Soft descending note — ability removed */
export function sfxRemove() {
  const a = ac(), t = a.currentTime;
  const g = gain(a, 0);
  env(g, t, 0.06, 0.005, 0.05, 0.02, 0.12);
  const o = osc(a, "sine", 1600, g, t, t + 0.2);
  o.frequency.linearRampToValueAtTime(1000, t + 0.12);
}

/** Crystalline shuffle — reroll */
export function sfxReroll() {
  const a = ac(), t = a.currentTime;
  for (let i = 0; i < 5; i++) {
    const d = i * 0.04;
    const g = gain(a, 0);
    env(g, t + d, 0.05, 0.003, 0.02, 0.01, 0.04);
    osc(a, "sine", 2000 + i * 400, g, t + d, t + d + 0.08);
  }
}

/** Soft tab switch */
export function sfxTab() {
  const a = ac(), t = a.currentTime;
  const g = gain(a, 0);
  env(g, t, 0.06, 0.004, 0.04, 0.02, 0.08);
  osc(a, "triangle", 1400, g, t, t + 0.13);
  osc(a, "sine", 2100, g, t, t + 0.13);
}

/** Primary button press — whoosh start */
export function sfxLaunch() {
  const a = ac(), t = a.currentTime;
  const g = gain(a, 0);
  env(g, t, 0.09, 0.01, 0.08, 0.04, 0.2);
  const o = osc(a, "sine", 400, g, t, t + 0.3);
  o.frequency.exponentialRampToValueAtTime(1600, t + 0.15);
  o.frequency.exponentialRampToValueAtTime(800, t + 0.3);
  const g2 = gain(a, 0);
  env(g2, t, 0.04, 0.01, 0.06, 0.02, 0.15);
  osc(a, "sine", 2400, g2, t + 0.05, t + 0.25);
}

// ── Gameplay sounds ──────────────────────────────────────────────────

/** Number called — neutral tick on miss, satisfying glass ding on hit */
export function sfxCall(hit = false) {
  const a = ac(), t = a.currentTime;
  if (!hit) {
    // soft neutral tick
    const g = gain(a, 0);
    env(g, t, 0.035, 0.005, 0.03, 0.01, 0.08);
    osc(a, "sine", 1100 + Math.random() * 200, g, t, t + 0.13);
  } else {
    // satisfying glass ding + shimmer
    const g = gain(a, 0);
    env(g, t, 0.1, 0.004, 0.06, 0.04, 0.2);
    osc(a, "sine", 1500, g, t, t + 0.28);
    const g2 = gain(a, 0);
    env(g2, t, 0.06, 0.004, 0.03, 0.02, 0.15);
    osc(a, "sine", 2250, g2, t + 0.01, t + 0.22);
    const g3 = gain(a, 0);
    env(g3, t, 0.03, 0.01, 0.05, 0.015, 0.18);
    osc(a, "sine", 4500, g3, t + 0.02, t + 0.26);
  }
}

/** Soft burst — bomb ability fires */
export function sfxBomb() {
  const a = ac(), t = a.currentTime;
  // low thud
  const g = gain(a, 0);
  env(g, t, 0.12, 0.005, 0.06, 0.04, 0.25);
  const o = osc(a, "sine", 200, g, t, t + 0.35);
  o.frequency.exponentialRampToValueAtTime(80, t + 0.3);
  // glass scatter
  for (let i = 0; i < 4; i++) {
    const d = 0.03 + i * 0.03;
    const g2 = gain(a, 0);
    env(g2, t + d, 0.04, 0.003, 0.03, 0.01, 0.08);
    osc(a, "sine", 2000 + i * 600, g2, t + d, t + d + 0.12);
  }
}

/** Ethereal shimmer — wild fires */
export function sfxWild() {
  const a = ac(), t = a.currentTime;
  const g = gain(a, 0);
  env(g, t, 0.08, 0.02, 0.1, 0.04, 0.3);
  const o = osc(a, "sine", 800, g, t, t + 0.45);
  o.frequency.linearRampToValueAtTime(1600, t + 0.2);
  o.frequency.linearRampToValueAtTime(1200, t + 0.4);
  const g2 = gain(a, 0);
  env(g2, t + 0.05, 0.05, 0.02, 0.08, 0.03, 0.25);
  osc(a, "sine", 2400, g2, t + 0.05, t + 0.4);
}

/** Melodic ascending chime — bingo / pattern complete */
export function sfxBingo() {
  const a = ac(), t = a.currentTime;
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const d = i * 0.08;
    const g = gain(a, 0);
    env(g, t + d, 0.1, 0.005, 0.06, 0.05, 0.3);
    osc(a, "sine", freq, g, t + d, t + d + 0.4);
    // shimmer harmonic
    const g2 = gain(a, 0);
    env(g2, t + d + 0.01, 0.04, 0.005, 0.04, 0.02, 0.2);
    osc(a, "sine", freq * 2, g2, t + d + 0.01, t + d + 0.3);
  });
}

/** Grand ascending — blackout */
export function sfxBlackout() {
  const a = ac(), t = a.currentTime;
  const notes = [392, 494, 587, 659, 784, 988, 1175]; // G4→D6
  notes.forEach((freq, i) => {
    const d = i * 0.07;
    const g = gain(a, 0);
    env(g, t + d, 0.1, 0.005, 0.08, 0.05, 0.4);
    osc(a, "sine", freq, g, t + d, t + d + 0.55);
    const g2 = gain(a, 0);
    env(g2, t + d + 0.01, 0.04, 0.005, 0.04, 0.02, 0.25);
    osc(a, "sine", freq * 2, g2, t + d + 0.01, t + d + 0.4);
  });
  // final shimmer
  const g3 = gain(a, 0);
  env(g3, t + 0.5, 0.06, 0.02, 0.1, 0.04, 0.5);
  osc(a, "sine", 2350, g3, t + 0.5, t + 1.1);
}

// ── Result sounds ────────────────────────────────────────────────────

/** Coin jingle — result screen entry */
export function sfxCoins() {
  const a = ac(), t = a.currentTime;
  for (let i = 0; i < 3; i++) {
    const d = i * 0.06;
    const g = gain(a, 0);
    env(g, t + d, 0.07, 0.003, 0.03, 0.02, 0.12);
    osc(a, "sine", 2800 + i * 200, g, t + d, t + d + 0.18);
    const g2 = gain(a, 0);
    env(g2, t + d, 0.03, 0.003, 0.02, 0.01, 0.08);
    osc(a, "sine", 5600 + i * 400, g2, t + d, t + d + 0.12);
  }
}

/** Ascending triumph — level up */
export function sfxLevelUp() {
  const a = ac(), t = a.currentTime;
  const notes = [440, 554, 659, 880]; // A4 C#5 E5 A5
  notes.forEach((freq, i) => {
    const d = i * 0.1;
    const g = gain(a, 0);
    env(g, t + d, 0.1, 0.008, 0.08, 0.06, 0.35);
    osc(a, "sine", freq, g, t + d, t + d + 0.5);
    const g2 = gain(a, 0);
    env(g2, t + d, 0.04, 0.008, 0.05, 0.02, 0.2);
    osc(a, "triangle", freq * 2, g2, t + d, t + d + 0.35);
  });
}

/** Sparkle — new best */
export function sfxNewBest() {
  const a = ac(), t = a.currentTime;
  for (let i = 0; i < 6; i++) {
    const d = i * 0.05;
    const g = gain(a, 0);
    env(g, t + d, 0.06, 0.003, 0.02, 0.015, 0.1);
    osc(a, "sine", 3000 + i * 350, g, t + d, t + d + 0.14);
  }
}

/** Purchase ding — buy node */
export function sfxBuy() {
  const a = ac(), t = a.currentTime;
  const g = gain(a, 0);
  env(g, t, 0.08, 0.005, 0.05, 0.03, 0.15);
  osc(a, "sine", 880, g, t, t + 0.25);
  const g2 = gain(a, 0);
  env(g2, t + 0.04, 0.06, 0.005, 0.04, 0.025, 0.12);
  osc(a, "sine", 1320, g2, t + 0.04, t + 0.22);
  const g3 = gain(a, 0);
  env(g3, t + 0.08, 0.04, 0.005, 0.03, 0.02, 0.1);
  osc(a, "sine", 1760, g3, t + 0.08, t + 0.2);
}

/** Soft back — navigation back */
export function sfxBack() {
  const a = ac(), t = a.currentTime;
  const g = gain(a, 0);
  env(g, t, 0.05, 0.004, 0.04, 0.02, 0.1);
  const o = osc(a, "sine", 1400, g, t, t + 0.15);
  o.frequency.linearRampToValueAtTime(900, t + 0.1);
}

/** Jinx bonus ding */
export function sfxJinx() {
  const a = ac(), t = a.currentTime;
  const g = gain(a, 0);
  env(g, t, 0.08, 0.01, 0.06, 0.04, 0.25);
  osc(a, "sine", 660, g, t, t + 0.35);
  const g2 = gain(a, 0);
  env(g2, t + 0.06, 0.06, 0.01, 0.05, 0.03, 0.2);
  osc(a, "sine", 990, g2, t + 0.06, t + 0.32);
  const g3 = gain(a, 0);
  env(g3, t + 0.12, 0.04, 0.01, 0.04, 0.02, 0.15);
  osc(a, "sine", 1320, g3, t + 0.12, t + 0.28);
}
