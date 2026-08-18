import type { ReactNode } from "react";
import styles from "./AiCommandCardLogo.module.css";

interface AiCommandCardLogoProps {
  logo: ReactNode;
  onLogoActivate?: () => void;
}

/** Marka ikonu. Aksiyonu varsa button, yoksa dekoratif statik yüzey. */
export function AiCommandCardLogo({ logo, onLogoActivate }: AiCommandCardLogoProps) {
  if (onLogoActivate) {
    return (
      <button
        type="button"
        className={styles.logoAction}
        data-slot="ai-command-card-logo"
        aria-label="Ana sayfa"
        onClick={(event) => {
          event.stopPropagation();
          onLogoActivate();
        }}
      >
        {logo}
      </button>
    );
  }
  return (
    <span
      className={`${styles.logoAction} ${styles.logoStatic}`}
      data-slot="ai-command-card-logo"
      aria-hidden="true"
    >
      {logo}
    </span>
  );
}
