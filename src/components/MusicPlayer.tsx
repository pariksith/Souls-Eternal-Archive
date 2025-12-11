import { useState, useRef, useEffect } from "react";
import { Music, VolumeX } from "lucide-react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    oscillators: OscillatorNode[];
    gains: GainNode[];
    masterGain: GainNode | null;
  }>({ oscillators: [], gains: [], masterGain: null });

  const createAmbientMusic = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);
    nodesRef.current.masterGain = masterGain;

    // Create ethereal pad sounds
    const frequencies = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
    
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.value = freq;

      // Add slow vibrato
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.value = 0.3 + index * 0.1;
      vibratoGain.gain.value = 2;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibrato.start();

      filter.type = "lowpass";
      filter.frequency.value = 800;
      filter.Q.value = 1;

      // Slow fade in/out for each voice
      const fadeTime = 4 + index * 2;
      gain.gain.value = 0;
      
      const animateGain = () => {
        if (!audioContextRef.current) return;
        const time = audioContextRef.current.currentTime;
        gain.gain.setValueAtTime(gain.gain.value, time);
        gain.gain.linearRampToValueAtTime(0.3, time + fadeTime);
        gain.gain.linearRampToValueAtTime(0.1, time + fadeTime * 2);
        gain.gain.linearRampToValueAtTime(0.25, time + fadeTime * 3);
        
        setTimeout(animateGain, fadeTime * 3000);
      };
      animateGain();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start();
      
      nodesRef.current.oscillators.push(osc, vibrato);
      nodesRef.current.gains.push(gain);
    });

    // Add magical shimmer
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    const shimmerFilter = ctx.createBiquadFilter();

    shimmerOsc.type = "triangle";
    shimmerOsc.frequency.value = 523.25; // C5
    shimmerFilter.type = "bandpass";
    shimmerFilter.frequency.value = 2000;
    shimmerFilter.Q.value = 5;
    shimmerGain.gain.value = 0.05;

    // Randomize shimmer
    const animateShimmer = () => {
      if (!audioContextRef.current) return;
      const time = audioContextRef.current.currentTime;
      const newFreq = 400 + Math.random() * 400;
      shimmerOsc.frequency.exponentialRampToValueAtTime(newFreq, time + 2);
      setTimeout(animateShimmer, 2000 + Math.random() * 3000);
    };
    animateShimmer();

    shimmerOsc.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(masterGain);
    shimmerOsc.start();

    nodesRef.current.oscillators.push(shimmerOsc);
    nodesRef.current.gains.push(shimmerGain);
  };

  const stopMusic = () => {
    nodesRef.current.oscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    nodesRef.current = { oscillators: [], gains: [], masterGain: null };
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      createAmbientMusic();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  return (
    <button
      onClick={toggleMusic}
      className={`
        fixed bottom-4 right-4 z-50
        w-10 h-10 lg:w-11 lg:h-11 rounded-full
        flex items-center justify-center
        transition-all duration-300
        shadow-lg hover:shadow-xl
        ${isPlaying 
          ? "bg-amber-600 text-amber-100 animate-pulse" 
          : "bg-amber-900/80 text-amber-200 hover:bg-amber-800"
        }
        border-2 border-amber-500/50
      `}
      title={isPlaying ? "Mute magical ambience" : "Play magical ambience"}
    >
      {isPlaying ? (
        <Music className="w-4 h-4 lg:w-5 lg:h-5" />
      ) : (
        <VolumeX className="w-4 h-4 lg:w-5 lg:h-5" />
      )}
    </button>
  );
}
