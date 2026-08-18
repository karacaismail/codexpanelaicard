import type { ReactNode } from "react";
import styles from "../AiCommandCard.module.css";

/**
 * Storybook-only harness: puts an isolated part inside a real shell element in
 * the expanded state so state-scoped CSS (reveal, stagger) applies.
 */
export function PartStoryShell({
  children,
  state = "expanded",
}: {
  children: ReactNode;
  state?: "collapsed" | "expanded";
}) {
  return (
    <div className={styles.host}>
      <section
        className={styles.shell}
        data-slot="ai-command-card-shell"
        data-state={state}
        style={{ blockSize: "auto", minBlockSize: 0, padding: 12 }}
      >
        {children}
      </section>
    </div>
  );
}
