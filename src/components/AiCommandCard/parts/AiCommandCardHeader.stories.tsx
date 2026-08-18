import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiCommandCardHeader } from "./AiCommandCardHeader";
import { demoBreadcrumbs, demoLogo, demoProfile } from "../AiCommandCard.fixtures";

const meta: Meta = { title: "AiCommandCard/Parçalar/AiCommandCardHeader" };
export default meta;
type Story = StoryObj;

function HeaderHarness({ expanded }: { expanded: boolean }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerHomeRef = useRef<HTMLSpanElement>(null);
  const profileHostRef = useRef<HTMLSpanElement>(null);
  return (
    <PartStoryShell state={expanded ? "expanded" : "collapsed"}>
      <div
        style={{
          position: "relative",
          ["--orb-x" as string]: "0px",
          ["--orb-y" as string]: "0px",
        }}
      >
        <AiCommandCardHeader
          logo={demoLogo}
          logoLabel="Logo"
          breadcrumbs={demoBreadcrumbs}
          notificationCount={3}
          profile={demoProfile}
          isCardExpanded={expanded}
          hasPendingQuery={false}
          askLabel="Sor"
          expandedContentId="demo-region"
          triggerRef={triggerRef}
          triggerHomeRef={triggerHomeRef}
          profileHostRef={profileHostRef}
          onToggleRequested={fn()}
          onNotificationActivate={fn()}
          onProfileActivate={fn()}
        />
      </div>
    </PartStoryShell>
  );
}

export const Collapsed: Story = { render: () => <HeaderHarness expanded={false} /> };
export const Expanded: Story = { render: () => <HeaderHarness expanded /> };
