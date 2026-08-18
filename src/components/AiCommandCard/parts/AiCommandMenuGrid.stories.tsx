import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiCommandMenuGrid } from "./AiCommandMenuGrid";
import { demoMenuItems } from "../AiCommandCard.fixtures";

const meta: Meta = { title: "AiCommandCard/Parts/AiCommandMenuGrid" };
export default meta;
type Story = StoryObj;

export const TwelveItemsDesktop: Story = {
  parameters: { viewport: { defaultViewport: "desktop1440" } },
  render: () => (
    <PartStoryShell>
      <AiCommandMenuGrid menuItems={demoMenuItems} onMenuItemSelect={fn()} />
    </PartStoryShell>
  ),
};

export const TwelveItemsMobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile320" } },
  render: () => (
    <PartStoryShell>
      <AiCommandMenuGrid menuItems={demoMenuItems} onMenuItemSelect={fn()} />
    </PartStoryShell>
  ),
};
