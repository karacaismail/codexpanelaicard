import { useEffect, useRef, useState } from "react";
import { SquaresFour, X } from "@phosphor-icons/react";
import type { AiCommandMenuItem } from "../components/AiCommandCard";
import {
  PipelineDistributionReport,
  RevenueTrendReport,
  RiskyCustomersReport,
} from "../components/AiCommandCard/AiCommandCard.reports";

/**
 * Demo-host feature (NOT part of AiCommandCard): each command card acts as an
 * admin main-menu item; selecting one opens that page as a modal. The card's
 * own single-shell invariant is untouched — this dialog belongs to the page.
 */

const CHILD_SECTIONS = ["Özet", "Detay", "Segmentler", "Karşılaştırma", "Arşiv", "Ayarlar"] as const;

interface AdminPageModalProps {
  menuItem: AiCommandMenuItem;
  onClose: () => void;
}

export function AdminPageModal({ menuItem, onClose }: AdminPageModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [activeChild, setActiveChild] = useState(0);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="adminModalBackdrop" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${menuItem.label} yönetim sayfası`}
        className="adminModal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="adminModalHeader">
          <span className="adminModalIcon" aria-hidden="true">
            {menuItem.icon ?? <SquaresFour size={18} />}
          </span>
          <div className="adminModalTitles">
            <h2 className="adminModalTitle">{menuItem.label}</h2>
            {menuItem.description ? (
              <p className="adminModalSubtitle">{menuItem.description}</p>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="adminModalClose"
            aria-label="Sayfayı kapat"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <nav className="adminChildGrid" aria-label={`${menuItem.label} alt bölümleri`}>
          {CHILD_SECTIONS.map((child, index) => (
            <button
              key={child}
              type="button"
              className="adminChildCard"
              aria-pressed={index === activeChild}
              onClick={() => setActiveChild(index)}
            >
              <span className="adminChildIndex">{index + 1}</span>
              <span>{child}</span>
            </button>
          ))}
        </nav>

        <div className="adminModalBody">
          <RevenueTrendReport />
          <PipelineDistributionReport />
          <RiskyCustomersReport />
        </div>
      </section>
    </div>
  );
}
