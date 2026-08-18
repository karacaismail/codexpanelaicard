import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiProfileAction } from "./AiProfileAction";
import { demoProfile } from "../AiCommandCard.fixtures";

const meta: Meta = { title: "AiCommandCard/Parts/AiProfileAction" };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <PartStoryShell>
      <AiProfileAction profile={demoProfile} onProfileActivate={fn()} />
    </PartStoryShell>
  ),
};
