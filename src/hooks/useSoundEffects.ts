import { useCallback, useRef } from "react";

// Sound URLs (using Web Audio API for generated sounds)
export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playQuillScratch = useCallback(() => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Create scratchy quill sound
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

    filter.type = "highpass";
    filter.frequency.value = 1000;

    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  }, [getAudioContext]);

  const playPageTurn = useCallback(() => {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate page flip noise
    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.sin((i / bufferSize) * Math.PI);
      const noise = (Math.random() * 2 - 1) * 0.3;
      data[i] = noise * envelope * (1 - i / bufferSize);
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = 2000;
    filter.Q.value = 1;
    gainNode.gain.value = 0.15;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(ctx.currentTime);
  }, [getAudioContext]);

  const playSealStamp = useCallback(() => {
    const ctx = getAudioContext();
    
    // Create a thump sound for stamping
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);

    // Add a click sound
    setTimeout(() => {
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      clickOsc.type = "square";
      clickOsc.frequency.setValueAtTime(1000, ctx.currentTime);
      clickGain.gain.setValueAtTime(0.1, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickOsc.start(ctx.currentTime);
      clickOsc.stop(ctx.currentTime + 0.03);
    }, 50);
  }, [getAudioContext]);

  const playInkDip = useCallback(() => {
    const ctx = getAudioContext();
    
    // Create a liquid dip sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);

    filter.type = "lowpass";
    filter.frequency.value = 800;

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, [getAudioContext]);

  return {
    playQuillScratch,
    playPageTurn,
    playSealStamp,
    playInkDip,
  };
}
