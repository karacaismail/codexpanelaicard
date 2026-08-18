import type { Meta, StoryObj } from "@storybook/react";
import { PartStoryShell } from "./partStoryShell";
import { AiParticleField } from "./AiParticleField";

const meta: Meta = { title: "AiCommandCard/Parts/AiParticleField" };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <PartStoryShell>
      <div style={{ position: "relative", inlineSize: 44, blockSize: 44 }}>
        <AiParticleField />
      </div>
    </PartStoryShell>
  ),
};
