import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { AiCommandCard } from "./AiCommandCard";
import type { AiCommandQueryRequest } from "./AiCommandCard.types";
import {
  demoBreadcrumbs,
  demoLogo,
  demoMenuItems,
  demoProfile,
  demoQuerySuggestions,
  simulateAiQuery,
} from "./AiCommandCard.fixtures";

const meta = {
  title: "AiCommandCard/Bütün Kart",
  component: AiCommandCard,
  args: {
    logo: demoLogo,
    breadcrumbs: demoBreadcrumbs,
    menuItems: demoMenuItems,
    querySuggestions: demoQuerySuggestions,
    notificationCount: 3,
    profile: demoProfile,
    searchPlaceholder: "Bu sayfada AI ile ara",
    submitLabel: "Sor",
    onAiQuerySubmit: fn(simulateAiQuery),
    onMenuItemSelect: fn(),
    onNotificationActivate: fn(),
    onProfileActivate: fn(),
    onExpandedChange: fn(),
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof AiCommandCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CollapsedMobile320: Story = {
  parameters: { viewport: { defaultViewport: "mobile320" } },
};

export const ExpandedMobile320: Story = {
  args: { defaultExpanded: true },
  parameters: { viewport: { defaultViewport: "mobile320" } },
};

export const CollapsedDesktop: Story = {
  parameters: { viewport: { defaultViewport: "desktop1440" } },
};

export const ExpandedDesktop: Story = {
  args: { defaultExpanded: true },
  parameters: { viewport: { defaultViewport: "desktop1440" } },
};

export const ExpandInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shellBeforeExpansion = canvas.getByTestId("ai-command-card-shell");
    const collapsedRect = shellBeforeExpansion.getBoundingClientRect();

    await userEvent.click(
      canvas.getByRole("button", { name: "AI komuta alanını aç" }),
    );
    await waitFor(() =>
      expect(shellBeforeExpansion).toHaveAttribute("data-state", "expanded"),
    );

    const shellAfterExpansion = canvas.getByTestId("ai-command-card-shell");
    await expect(shellAfterExpansion).toBe(shellBeforeExpansion);
    await expect(
      document.querySelectorAll('[data-slot="ai-command-card-shell"]'),
    ).toHaveLength(1);

    // No alternate surface of any kind.
    await expect(document.querySelector('[role="dialog"]')).toBeNull();

    const trigger = canvas.getByRole("button", { name: "AI komuta alanını kapat" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("textbox")).toBeVisible();
    await expect(
      canvasElement.querySelectorAll('[data-slot="ai-command-menu-item"]'),
    ).toHaveLength(12);

    const expandedRect = shellAfterExpansion.getBoundingClientRect();
    await expect(expandedRect.height).toBeGreaterThan(collapsedRect.height * 4);
    await expect(expandedRect.width).toBeGreaterThanOrEqual(collapsedRect.width);
  },
};

export const RapidToggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shell = canvas.getByTestId("ai-command-card-shell");
    const trigger = canvas.getByRole("button", { name: /AI komuta alanını/ });

    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(trigger);

    await expect(
      document.querySelectorAll('[data-slot="ai-command-card-shell"]'),
    ).toHaveLength(1);
    await waitFor(() => expect(shell).toHaveAttribute("data-state", "expanded"), {
      timeout: 2000,
    });
  },
};

export const ReducedMotion: Story = {
  args: { motionPreference: "reduced", defaultExpanded: true },
};

export const LongLocalizedContent: Story = {
  args: {
    defaultExpanded: true,
    breadcrumbs: [
      { id: "home", label: "Kurumsal Kaynak Planlaması Ana Merkezi" },
      { id: "hr", label: "İnsan Kaynakları ve Yetenek Yönetimi" },
      { id: "perf", label: "Performans Değerlendirme Dönemleri" },
      {
        id: "report",
        label:
          "2026 Yılı İkinci Yarıyıl Çalışan Performans Değerlendirme Sonuçları Detay Raporu",
      },
    ],
    querySuggestions: [
      { id: "l1", label: "Bu dönemde hedefini aşan çalışanları departman bazında özetle" },
      { id: "l2", label: "Değerlendirme sonuçlarını geçen yılla karşılaştır" },
    ],
  },
  parameters: { viewport: { defaultViewport: "mobile320" } },
};

export const RTL: Story = {
  args: { defaultExpanded: true },
  decorators: [
    (StoryComponent) => (
      <div dir="rtl">
        <StoryComponent />
      </div>
    ),
  ],
};

export const DarkTheme: Story = {
  args: { defaultExpanded: true },
  decorators: [
    (StoryComponent) => (
      <div
        style={{
          background: "#101318",
          padding: 24,
          ["--ai-cc-surface" as string]: "#1a1f27",
          ["--ai-cc-surface-muted" as string]: "#232a35",
          ["--ai-cc-border" as string]: "#39414e",
          ["--ai-cc-text" as string]: "#e8eaee",
          ["--ai-cc-text-muted" as string]: "#9aa3b0",
        }}
      >
        <StoryComponent />
      </div>
    ),
  ],
};

export const QuerySubmitting: Story = {
  args: {
    defaultExpanded: true,
    onAiQuerySubmit: fn((_request: AiCommandQueryRequest) => new Promise<string>(() => {})),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "özet çıkar");
    await userEvent.click(canvas.getByRole("button", { name: "Sor" }));
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent("Sorgu gönderiliyor…"),
    );
  },
};

export const QueryError: Story = {
  args: {
    defaultExpanded: true,
    onAiQuerySubmit: fn((_request: AiCommandQueryRequest) =>
      Promise.reject<string>(new Error("network")),
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "özet çıkar");
    await userEvent.click(canvas.getByRole("button", { name: "Sor" }));
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent("Sorgu gönderilemedi"),
    );
  },
};

export const SuggestionAiSimulation: Story = {
  args: { defaultExpanded: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Riskli müşterileri listele" }),
    );
    // Thinking indicator appears while the fake backend "works"...
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="ai-command-card-response"]'),
      ).toBeInTheDocument(),
    );
    // ...then the canned rich report (table + status badges) renders in-shell.
    await waitFor(
      () =>
        expect(
          canvasElement.querySelector('[data-slot="ai-command-card-response"]'),
        ).toHaveTextContent(/Riskli Müşteriler/),
      { timeout: 8000 },
    );
    await expect(
      document.querySelectorAll('[data-slot="ai-command-card-shell"]'),
    ).toHaveLength(1);
  },
};

export const NoHorizontalOverflowMobile320: Story = {
  args: { defaultExpanded: true },
  parameters: { viewport: { defaultViewport: "mobile320" } },
  play: async () => {
    await expect(
      document.documentElement.scrollWidth,
    ).toBeLessThanOrEqual(document.documentElement.clientWidth);
  },
};
