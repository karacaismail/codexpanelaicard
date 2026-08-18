import { useState, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiCommandTrigger } from "./AiCommandTrigger";

const meta: Meta = { title: "AiCommandCard/Parçalar/AiCommandTrigger" };
export default meta;
type Story = StoryObj;

/* Orb gerçek kartta shell'e mutlak konumlu bir üst katmandır; izole story'de
 * ona positioned bir sahne + --orb-x/--orb-y konumu veriyoruz. */
function OrbStage({ children }: { children: ReactNode }) {
  const stageStyle: CSSProperties = {
    position: "relative",
    inlineSize: 72,
    blockSize: 64,
    ["--orb-x" as string]: "14px",
    ["--orb-y" as string]: "10px",
  };
  return <div style={stageStyle}>{children}</div>;
}

/** Collapsed orb: heartbeat idle animation, opens the card. */
export const Idle: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);
    return (
      <PartStoryShell>
        <OrbStage>
          <AiCommandTrigger
            isCardExpanded={expanded}
            hasPendingQuery={false}
            askLabel="Sor"
            expandedContentId="demo-region"
            onActivate={() => setExpanded((value) => !value)}
          />
        </OrbStage>
      </PartStoryShell>
    );
  },
};

/** Expanded + pending query: the orb reads as the "ask AI" control. */
export const AskMode: Story = {
  render: () => (
    <PartStoryShell>
      <OrbStage>
        <AiCommandTrigger
          isCardExpanded
          hasPendingQuery
          askLabel="Sor"
          expandedContentId="demo-region"
          onActivate={fn()}
        />
      </OrbStage>
    </PartStoryShell>
  ),
};
