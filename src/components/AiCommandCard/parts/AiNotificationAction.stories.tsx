import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiNotificationAction } from "./AiNotificationAction";

const meta: Meta = { title: "AiCommandCard/Parçalar/AiNotificationAction" };
export default meta;
type Story = StoryObj;

export const Unread: Story = {
  render: () => (
    <PartStoryShell>
      <AiNotificationAction notificationCount={7} onNotificationActivate={fn()} />
    </PartStoryShell>
  ),
};

export const Empty: Story = {
  render: () => (
    <PartStoryShell>
      <AiNotificationAction notificationCount={0} onNotificationActivate={fn()} />
    </PartStoryShell>
  ),
};
