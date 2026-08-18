import styles from "../AiCommandCard.module.css";

/**
 * Deterministic particle offsets — no per-render randomness, so renders are
 * stable and reduced-motion snapshots stay reproducible.
 */
const PARTICLES: readonly { top: string; left: string; dx: string; dy: string; delay: string }[] = [
  { top: "18%", left: "20%", dx: "2px", dy: "-3px", delay: "0s" },
  { top: "26%", left: "72%", dx: "-2px", dy: "-2px", delay: "0.6s" },
  { top: "68%", left: "26%", dx: "3px", dy: "2px", delay: "1.2s" },
  { top: "74%", left: "66%", dx: "-3px", dy: "3px", delay: "1.8s" },
];

/** Decorative AI particles. Hidden from AT, never intercepts pointer events. */
export function AiParticleField() {
  return (
    <span className={styles.particleField} data-slot="ai-particle-field" aria-hidden="true">
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className={styles.particle}
          style={{
            top: particle.top,
            left: particle.left,
            animationDelay: particle.delay,
            ["--particle-dx" as string]: particle.dx,
            ["--particle-dy" as string]: particle.dy,
          }}
        />
      ))}
    </span>
  );
}
