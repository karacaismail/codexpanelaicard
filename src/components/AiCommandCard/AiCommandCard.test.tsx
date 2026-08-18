import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AiCommandCard } from "./AiCommandCard";
import type { AiCommandCardProps, AiCommandQueryRequest } from "./AiCommandCard.types";
import {
  demoBreadcrumbs,
  demoLogo,
  demoMenuItems,
  demoProfile,
  demoQuerySuggestions,
} from "./AiCommandCard.fixtures";

function renderCard(overrides: Partial<AiCommandCardProps> = {}) {
  const handlers = {
    onAiQuerySubmit: vi.fn(),
    onMenuItemSelect: vi.fn(),
    onNotificationActivate: vi.fn(),
    onProfileActivate: vi.fn(),
  };
  const view = render(
    <AiCommandCard
      logo={demoLogo}
      breadcrumbs={demoBreadcrumbs}
      menuItems={demoMenuItems}
      querySuggestions={demoQuerySuggestions}
      notificationCount={3}
      profile={demoProfile}
      searchPlaceholder="Bu sayfada AI ile ara"
      submitLabel="Sor"
      motionPreference="reduced"
      {...handlers}
      {...overrides}
    />,
  );
  return { ...view, handlers };
}

function getShell(): HTMLElement {
  return screen.getByTestId("ai-command-card-shell");
}

function getTrigger(): HTMLElement {
  return screen.getByRole("button", { name: /AI komuta alanını/ });
}

async function expandViaTrigger(user: ReturnType<typeof userEvent.setup>) {
  await user.click(getTrigger());
  await waitFor(() => expect(getShell()).toHaveAttribute("data-state", "expanded"));
}

describe("AiCommandCard", () => {
  it("keeps the exact same shell DOM node across expansion (persistent shell identity)", async () => {
    const user = userEvent.setup();
    renderCard();

    const shellBeforeExpansion = getShell();
    expect(shellBeforeExpansion).toHaveAttribute("data-state", "collapsed");

    await expandViaTrigger(user);

    const shellAfterExpansion = getShell();
    expect(shellAfterExpansion).toBe(shellBeforeExpansion);
    expect(
      document.querySelectorAll('[data-slot="ai-command-card-shell"]'),
    ).toHaveLength(1);
  });

  it("never opens an alternate surface (no dialog, portal, backdrop or second shell)", async () => {
    const user = userEvent.setup();
    const { container } = renderCard();
    await expandViaTrigger(user);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="ai-command-card-shell"]')).toHaveLength(1);
    // Nothing rendered outside the component's own container (no portals).
    expect(document.body.children).toHaveLength(1);
    expect(document.body.firstElementChild).toBe(container);
  });

  it("hides expanded content from focus and AT while collapsed, reveals it expanded", async () => {
    const user = userEvent.setup();
    renderCard();

    const expandedRegion = document.querySelector(
      '[data-slot="ai-command-card-expanded-region"]',
    ) as HTMLElement;
    expect(expandedRegion).toHaveAttribute("aria-hidden", "true");
    expect(expandedRegion).toHaveAttribute("inert");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    await expandViaTrigger(user);

    expect(expandedRegion).toHaveAttribute("aria-hidden", "false");
    expect(expandedRegion).not.toHaveAttribute("inert");
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders exactly 12 menu items when expanded", async () => {
    const user = userEvent.setup();
    renderCard();
    await expandViaTrigger(user);
    expect(
      document.querySelectorAll('[data-slot="ai-command-menu-item"]'),
    ).toHaveLength(12);
  });

  it("supports keyboard: Enter/Space expand, Escape collapses and restores focus", async () => {
    const user = userEvent.setup();
    renderCard();

    const trigger = getTrigger();
    trigger.focus();
    await user.keyboard("{Enter}");
    await waitFor(() => expect(getShell()).toHaveAttribute("data-state", "expanded"));
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(getShell()).toHaveAttribute("data-state", "collapsed"));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("isolates interactive children: notification click does not expand the card", async () => {
    const user = userEvent.setup();
    const { handlers } = renderCard();

    await user.click(screen.getByRole("button", { name: /Bildirimler/ }));

    expect(handlers.onNotificationActivate).toHaveBeenCalledTimes(1);
    expect(getShell()).toHaveAttribute("data-state", "collapsed");
  });

  it("collapses when the user clicks outside the card", async () => {
    const user = userEvent.setup();
    renderCard();
    await expandViaTrigger(user);

    await user.click(document.body);
    await waitFor(() => expect(getShell()).toHaveAttribute("data-state", "collapsed"));
  });

  it("expands from a click on the empty collapsed surface", async () => {
    const user = userEvent.setup();
    renderCard();
    await user.click(getShell());
    await waitFor(() => expect(getShell()).toHaveAttribute("data-state", "expanded"));
  });

  it("survives rapid toggling without duplicate shells or errors", async () => {
    const user = userEvent.setup();
    renderCard({ motionPreference: "full" });

    const shell = getShell();
    const trigger = getTrigger();
    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);

    expect(document.querySelectorAll('[data-slot="ai-command-card-shell"]')).toHaveLength(1);
    expect(getShell()).toBe(shell);
    await waitFor(() => expect(getShell()).toHaveAttribute("data-state", "expanded"));
  });

  it("submits the query with the current page context", async () => {
    const user = userEvent.setup();
    const { handlers } = renderCard();
    await expandViaTrigger(user);

    await user.type(screen.getByRole("textbox"), "riskli müşteriler");
    await user.click(screen.getByRole("button", { name: "Sor" }));

    expect(handlers.onAiQuerySubmit).toHaveBeenCalledTimes(1);
    const request = handlers.onAiQuerySubmit.mock.calls[0][0] as AiCommandQueryRequest;
    expect(request.query).toBe("riskli müşteriler");
    expect(request.currentPageId).toBe("q3");
    expect(request.currentPageLabel).toBe("3. Çeyrek Kurumsal Satış Fırsatları Raporu");
    expect(request.currentBreadcrumbPath).toEqual(demoBreadcrumbs.map((b) => b.label));
  });

  it("keeps menu, notification and profile callbacks isolated", async () => {
    const user = userEvent.setup();
    const { handlers } = renderCard();
    await expandViaTrigger(user);

    await user.click(screen.getByRole("button", { name: /Raporlar/ }));
    expect(handlers.onMenuItemSelect).toHaveBeenCalledTimes(1);
    expect(handlers.onMenuItemSelect.mock.calls[0][0].id).toBe("reports");

    await user.click(screen.getByRole("button", { name: /Profil/ }));
    expect(handlers.onProfileActivate).toHaveBeenCalledTimes(1);
    expect(handlers.onNotificationActivate).not.toHaveBeenCalled();
    expect(getShell()).toHaveAttribute("data-state", "expanded");
  });

  it("supports controlled usage via the expanded prop", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    const { rerender, handlers } = renderCard({ expanded: false, onExpandedChange });

    expect(getShell()).toHaveAttribute("data-state", "collapsed");
    await user.click(getTrigger());
    expect(onExpandedChange).toHaveBeenCalledWith(true, "trigger-activation");
    // Controlled: state only moves when the prop changes.
    expect(getShell()).toHaveAttribute("data-state", "collapsed");

    rerender(
      <AiCommandCard
        logo={demoLogo}
        breadcrumbs={demoBreadcrumbs}
        menuItems={demoMenuItems}
        querySuggestions={demoQuerySuggestions}
        notificationCount={3}
        profile={demoProfile}
        searchPlaceholder="Bu sayfada AI ile ara"
        submitLabel="Sor"
        motionPreference="reduced"
        expanded
        onExpandedChange={onExpandedChange}
        {...handlers}
      />,
    );
    await waitFor(() => expect(getShell()).toHaveAttribute("data-state", "expanded"));
  });

  it("runs the full AI flow from a suggestion pill: fill, submit, stream answer", async () => {
    const user = userEvent.setup();
    const { handlers } = renderCard({
      onAiQuerySubmit: vi.fn().mockResolvedValue("3 müşteri risk sinyali veriyor."),
    });
    await expandViaTrigger(user);

    await user.click(
      screen.getByRole("button", { name: "Riskli müşterileri listele" }),
    );

    expect(screen.getByRole("textbox")).toHaveValue("Riskli müşterileri listele");
    // handlers.onAiQuerySubmit was overridden; the override carries the call.
    expect(handlers.onAiQuerySubmit).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(
        document.querySelector('[data-slot="ai-command-card-response"]'),
      ).toHaveTextContent("3 müşteri risk sinyali veriyor."),
    );
    // Still one shell, no dialog — the answer renders inside the same surface.
    expect(document.querySelectorAll('[data-slot="ai-command-card-shell"]')).toHaveLength(1);
  });
});
