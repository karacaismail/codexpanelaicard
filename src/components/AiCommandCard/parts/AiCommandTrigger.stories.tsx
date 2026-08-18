import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiCommandTrigger } from "./AiCommandTrigger";

const meta: Meta = { title: "AiCommandCard/Parts/AiCommandTrigger" };
export default meta;
type Story = StoryObj;

/** Collapsed orb: heartbeat idle animation, opens the card. */
export const Idle: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);
    return (
      <PartStoryShell>
        <AiCommandTrigger
          isCardExpanded={expanded}
          hasPendingQuery={false}
          askLabel="Sor"
          expandedContentId="demo-region"
          onActivate={() => setExpanded((value) => !value)}
        />
      </PartStoryShell>
    );
  },
};

/** Expanded + pending query: the orb reads as the "ask AI" control. */
export const AskMode: Story = {
  render: () => (
    <PartStoryShell>
      <AiCommandTrigger
        isCardExpanded
        hasPendingQuery
        askLabel="Sor"
        expandedContentId="demo-region"
        onActivate={fn()}
      />
    </PartStoryShell>
  ),
};
