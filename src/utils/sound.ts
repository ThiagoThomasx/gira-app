/**
 * sound.ts — Synthesized audio for Gira.app
 *
 * All sounds are generated programmatically via the Web Audio API.
 * No external files, no new dependencies.
 *
 * Design goals
 * ────────────
 * • Subtle — nothing loud or startling
 * • Safe — fully try/catch'd; silently degrades when API is unavailable
 *   (SSR, locked audio context on iOS, restrictive browsers)
 * • Lazy — AudioContext created only on first use, after user interaction
 */

// ─── internal helpers ─────────────────────────────────────────────────────────

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

function createContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctx =
      window.AudioContext ??
      (window as WebkitWindow).webkitAudioContext;
    return Ctx ? new Ctx() : null;
  } catch {
    return null;
  }
}

// ─── SoundManager ─────────────────────────────────────────────────────────────

class SoundManager {
  private ctx: AudioContext | null = null;

  /**
   * Returns a ready AudioContext, creating or resuming it as needed.
   * Returns null if audio is unavailable in the current environment.
   */
  private getCtx(): AudioContext | null {
    if (!this.ctx || this.ctx.state === "closed") {
      this.ctx = createContext();
    }
    if (!this.ctx) return null;

    // Mobile browsers suspend the context until after a user gesture.
    // resume() is a no-op if already running.
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => null);
    }

    return this.ctx;
  }

  // ── Public sounds ───────────────────────────────────────────────────────────

  /**
   * Wooden "toc" tick — roulette pin striking a divider.
   *
   * Two-layer synthesis:
   *   1. Body — triangle oscillator (warmer than sine, no high partials)
   *      dropping 260 → 120 Hz in 48 ms through a lowpass filter.
   *      Gives the hollow, resonant body of a wooden knock.
   *   2. Attack click — 12 ms of white noise shaped through a narrow
   *      bandpass at 340 Hz. Provides the percussive transient without
   *      introducing high-frequency "electronic" brightness.
   *
   * Both layers are very quiet (≤ 0.08 peak gain).
   * Total audible duration: ~55 ms.
   */
  playTick(): void {
    const ctx = this.getCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // ── Layer 1: body ───────────────────────────────────────────────────
      const bodyOsc    = ctx.createOscillator();
      const bodyFilter = ctx.createBiquadFilter();
      const bodyGain   = ctx.createGain();

      bodyOsc.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(ctx.destination);

      bodyOsc.type = "triangle";                              // warm, not buzzy
      bodyOsc.frequency.setValueAtTime(260, now);            // body pitch onset
      bodyOsc.frequency.exponentialRampToValueAtTime(120, now + 0.048); // drops like wood

      bodyFilter.type = "lowpass";
      bodyFilter.frequency.value = 780;                      // kill electronics above ~800 Hz
      bodyFilter.Q.value = 0.7;

      bodyGain.gain.setValueAtTime(0.08, now);               // quiet
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.06);

      // ── Layer 2: attack click (noise burst) ────────────────────────────
      // ~12 ms of white noise fading to zero — supplies the percussive
      // "stick hitting wood" transient. Without this, triangle alone sounds
      // too smooth and flute-like.
      const clickSamples = Math.ceil(ctx.sampleRate * 0.012);
      const clickBuf     = ctx.createBuffer(1, clickSamples, ctx.sampleRate);
      const clickData    = clickBuf.getChannelData(0);
      for (let i = 0; i < clickSamples; i++) {
        // Amplitude envelope baked into buffer: loud → silent over 12 ms
        clickData[i] = (Math.random() * 2 - 1) * (1 - i / clickSamples);
      }

      const clickSrc    = ctx.createBufferSource();
      const clickFilter = ctx.createBiquadFilter();
      const clickGain   = ctx.createGain();

      clickSrc.buffer = clickBuf;
      clickSrc.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickFilter.type = "bandpass";
      clickFilter.frequency.value = 340;                     // low-mid crunch band
      clickFilter.Q.value = 1.8;                            // focused, not wide

      clickGain.gain.setValueAtTime(0.045, now);             // subtle — just the transient

      clickSrc.start(now);
      clickSrc.stop(now + 0.014);

    } catch {
      // Ignore — audio failures should never crash the UI
    }
  }

  /**
   * Pleasant two-note ding — result is revealed.
   * C5 (523 Hz) followed 90 ms later by G5 (784 Hz).
   * Duration: ~800 ms with natural fade.
   */
  playResult(): void {
    const ctx = this.getCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Open fifth interval — bright but not jarring
      const notes: [number, number][] = [
        [523.25, 0],      // C5 — immediately
        [783.99, 0.09],   // G5 — 90 ms later
      ];

      for (const [freq, delay] of notes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.26, now + delay + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.75);

        osc.start(now + delay);
        osc.stop(now + delay + 0.8);
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Schedules tick sounds across a spin animation.
   *
   * Tick interval starts fast (rapid spin) and slows exponentially
   * to simulate the roulette decelerating. Stops ~420 ms before the
   * result appears so the final silence feels intentional.
   *
   * @param durationMs  Total spin duration (same value used for the timer)
   * @returns           Cleanup function — call on unmount to cancel pending ticks
   */
  scheduleTicks(durationMs: number): () => void {
    const ids: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    let interval = 70;       // ms — slightly relaxed start; fewer frantic overlapping ticks
    const maxInterval = 430; // ms — slowest pace near the end (~2.3 ticks/s)
    const stopBefore = 420;  // ms — silence before result

    const schedule = () => {
      if (elapsed >= durationMs - stopBefore) return;

      const id = setTimeout(() => {
        this.playTick();
        interval = Math.min(interval * 1.076, maxInterval);
        elapsed += interval;
        schedule();
      }, interval);

      ids.push(id);
    };

    schedule();
    return () => ids.forEach(clearTimeout);
  }
}

// Singleton — one AudioContext shared across the entire app lifetime
export const soundManager = new SoundManager();
