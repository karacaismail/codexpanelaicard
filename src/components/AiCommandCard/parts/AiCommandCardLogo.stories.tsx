import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiCommandCardLogo } from "./AiCommandCardLogo";
import { demoLogo } from "../AiCommandCard.fixtures";

const meta: Meta = { title: "AiCommandCard/Parçalar/AiCommandCardLogo" };
export default meta;
type Story = StoryObj;

/* Header'daki gibi satır düzeninde göster (kolon flex'te banda yayılmasın). */
function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", alignItems: "center" }}>{children}</div>;
}

/** Placeholder wordmark: karo ikon + sağa uzayan açık bantta "Logo". */
export const Placeholder: Story = {
  render: () => (
    <PartStoryShell>
      <Row><AiCommandCardLogo logo={demoLogo} logoLabel="Logo" /></Row>
    </PartStoryShell>
  ),
};

export const Clickable: Story = {
  render: () => (
    <PartStoryShell>
      <Row><AiCommandCardLogo logo={demoLogo} logoLabel="Logo" onLogoActivate={fn()} /></Row>
    </PartStoryShell>
  ),
};

/** Yalnızca ikon (wordmark alanı olmadan). */
export const IconOnly: Story = {
  render: () => (
    <PartStoryShell>
      <Row><AiCommandCardLogo logo={demoLogo} /></Row>
    </PartStoryShell>
  ),
};
