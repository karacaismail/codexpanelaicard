import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiCommandMenuItemCard } from "./AiCommandMenuItem";
import { demoMenuItems } from "../AiCommandCard.fixtures";

const meta: Meta = { title: "AiCommandCard/Parçalar/AiCommandMenuItem" };
export default meta;
type Story = StoryObj;

const listStyle = { listStyle: "none", margin: 0, padding: 0 } as const;

export const Default: Story = {
  render: () => (
    <PartStoryShell>
      <ul style={listStyle}>
        <AiCommandMenuItemCard
          menuItem={demoMenuItems[0]}
          staggerIndex={0}
          onMenuItemSelect={fn()}
        />
      </ul>
    </PartStoryShell>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <PartStoryShell>
      <ul style={listStyle}>
        <AiCommandMenuItemCard
          menuItem={demoMenuItems.find((item) => item.badge) ?? demoMenuItems[0]}
          staggerIndex={0}
          onMenuItemSelect={fn()}
        />
      </ul>
    </PartStoryShell>
  ),
};

export const Disabled: Story = {
  render: () => (
    <PartStoryShell>
      <ul style={listStyle}>
        <AiCommandMenuItemCard
          menuItem={{ ...demoMenuItems[0], disabled: true }}
          staggerIndex={0}
          onMenuItemSelect={fn()}
        />
      </ul>
    </PartStoryShell>
  ),
};
