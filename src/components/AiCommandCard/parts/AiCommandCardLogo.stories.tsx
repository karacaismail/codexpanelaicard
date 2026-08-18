import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiCommandCardLogo } from "./AiCommandCardLogo";
import { demoLogo } from "../AiCommandCard.fixtures";

const meta: Meta = { title: "AiCommandCard/Parçalar/AiCommandCardLogo" };
export default meta;
type Story = StoryObj;

export const Static: Story = {
  render: () => (
    <PartStoryShell>
      <AiCommandCardLogo logo={demoLogo} />
    </PartStoryShell>
  ),
};

export const Clickable: Story = {
  render: () => (
    <PartStoryShell>
      <AiCommandCardLogo logo={demoLogo} onLogoActivate={fn()} />
    </PartStoryShell>
  ),
};
