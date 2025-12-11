import { memo, useMemo } from "react";

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  type: "gold" | "star" | "sparkle";
}

export const MagicalParticles = memo(function MagicalParticles() {
  const particles = useMemo<Particle[]>(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 4,
      size: 2 + Math.random() * 4,
      type: ["gold", "star", "sparkle"][Math.floor(Math.random() * 3)] as Particle["type"],
    })), 
  []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-float-particle"
          style={{
            left: `${particle.left}%`,
            bottom: "-10px",
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          {particle.type === "gold" && (
            <div 
              className="rounded-full bg-gold/70"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                boxShadow: `0 0 ${particle.size * 3}px hsl(var(--gold-glow) / 0.8)`,
              }}
            />
          )}
          {particle.type === "star" && (
            <span 
              className="text-gold drop-shadow-lg" 
              style={{ fontSize: `${particle.size * 3}px` }}
            >
              ✦
            </span>
          )}
          {particle.type === "sparkle" && (
            <span 
              className="text-gold-glow drop-shadow-lg animate-pulse" 
              style={{ fontSize: `${particle.size * 2.5}px` }}
            >
              ✧
            </span>
          )}
        </div>
      ))}
      
      {/* Ambient magical mist */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gold/5 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-magic-glow/5 to-transparent" />
    </div>
  );
});
