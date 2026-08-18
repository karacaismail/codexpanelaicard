import type { Meta, StoryObj } from "@storybook/react";
import { PartStoryShell } from "./partStoryShell";
import { AiCommandCardStatus } from "./AiCommandCardStatus";

const meta: Meta = { title: "AiCommandCard/Parts/AiCommandCardStatus" };
export default meta;
type Story = StoryObj;

export const Submitting: Story = {
  render: () => (
    <PartStoryShell>
      <AiCommandCardStatus queryState="submitting" />
    </PartStoryShell>
  ),
};

export const Success: Story = {
  render: () => (
    <PartStoryShell>
      <AiCommandCardStatus queryState="success" />
    </PartStoryShell>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <PartStoryShell>
      <AiCommandCardStatus queryState="error" />
    </PartStoryShell>
  ),
};
