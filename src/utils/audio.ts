import { useProgressStore } from '../store/useProgressStore';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: 'success' | 'error' | 'flip' | 'click' | 'levelUp') {
  // Respect the global Zustand mute state
  const isMuted = useProgressStore.getState().isMuted;
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'click') {
      // Soft bubble/pop sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'flip') {
      // Card flipping wooden click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'success') {
      // Happy ascending double chiptune ding
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc2.frequency.setValueAtTime(1046.50, now + 0.24); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.setValueAtTime(0.15, now + 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.16);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.4);
    } else if (type === 'error') {
      // Retro falling error boing
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);

      // Low pass filter to make the sawtooth warmer
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.31);
    } else if (type === 'levelUp') {
      // Heroic success crescendo chord
      const freqs = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
      const gain = ctx.createGain();

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      gain.connect(ctx.destination);

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.4, now + idx * 0.06);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(oscGain);
        oscGain.connect(gain);

        osc.start(now + idx * 0.06);
        osc.stop(now + 0.75);
      });
    }
  } catch (err) {
    console.warn('AudioContext not allowed or failed to initialize:', err);
  }
}
