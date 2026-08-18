import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { AiCommandCard, type AiCommandMenuItem } from "../components/AiCommandCard";
import { AdminPageModal } from "./AdminPageModal";
import {
  demoBreadcrumbs,
  demoLogo,
  demoMenuItems,
  demoProfile,
  demoQuerySuggestions,
  simulateAiQuery,
} from "../components/AiCommandCard/AiCommandCard.fixtures";
import "./demo.css";

/**
 * The page loaded inside the device iframe: the component running on a
 * realistic host page at the iframe's true viewport size, so media and
 * container queries behave exactly as on a real device.
 */
function FramePage() {
  const [openAdminPage, setOpenAdminPage] = useState<AiCommandMenuItem | null>(null);
  return (
    <div className="framePage">
      <div className="framePageContent">
        <AiCommandCard
          logo={demoLogo}
          logoLabel="Logo"
          breadcrumbs={demoBreadcrumbs}
          menuItems={demoMenuItems}
          querySuggestions={demoQuerySuggestions}
          notificationCount={3}
          profile={demoProfile}
          searchPlaceholder="Bu sayfada AI ile ara"
          submitLabel="Sor"
          onAiQuerySubmit={simulateAiQuery}
          onMenuItemSelect={(item) => setOpenAdminPage(item)}
          onNotificationActivate={() => console.info("notifications")}
          onProfileActivate={() => console.info("profile")}
        />
        <section className="framePlaceholder">
          <h2 className="framePlaceholderTitle">Sayfa içeriği</h2>
          <p>
            Bu alan, AiCommandCard'ın gerçek bir ürün sayfasının üstünde nasıl durduğunu
            göstermek için var. Kart, sayfa akışının içinde kalır; genişlerken modal veya
            overlay açmaz, altındaki içeriği aşağı iter.
          </p>
        </section>
        <section className="framePlaceholder" aria-hidden="true">
          <h2 className="framePlaceholderTitle">Rapor bölümü</h2>
          <p>
            3. çeyrek kurumsal satış fırsatları raporunun gövde içeriği burada yer alır.
            Kartı açıp önerilerden birine tıklayarak AI simülasyonunu deneyin.
          </p>
        </section>
      </div>
      {openAdminPage ? (
        <AdminPageModal menuItem={openAdminPage} onClose={() => setOpenAdminPage(null)} />
      ) : null}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FramePage />
  </StrictMode>,
);
