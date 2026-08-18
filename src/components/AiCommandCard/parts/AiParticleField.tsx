import styles from "./AiParticleField.module.css";

/**
 * Takımyıldız alanı: 5 deterministik nokta, 12 sn'lik sonsuz döngüde farklı
 * formasyonlar kurar (3'lü → 5'li → 4'lü), görünür nokta sayısı 2-5 arasında
 * değişir. Noktalar taban ölçüsünü korur; derinlik hissi scale 1x↔2x
 * (yakınlaşma/uzaklaşma) ile verilir. Randomsuz — her render aynı.
 */
const PARTICLES: readonly { className: string; top: string; left: string }[] = [
  { className: "particleA", top: "12%", left: "18%" },
  { className: "particleB", top: "22%", left: "74%" },
  { className: "particleC", top: "76%", left: "46%" },
  { className: "particleD", top: "40%", left: "88%" },
  { className: "particleE", top: "70%", left: "10%" },
];

/** Decorative AI constellation. Hidden from AT, never intercepts pointers. */
export function AiParticleField() {
  return (
    <span className={styles.particleField} data-slot="ai-particle-field" aria-hidden="true">
      {PARTICLES.map((particle) => (
        <span
          key={particle.className}
          className={`${styles.particle} ${styles[particle.className]}`}
          style={{ top: particle.top, left: particle.left }}
        />
      ))}
    </span>
  );
}
