import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiCommandTrigger } from "./AiCommandTrigger";
import { AiParticleField } from "./AiParticleField";
import { AiNotificationAction } from "./AiNotificationAction";
import { AiProfileAction } from "./AiProfileAction";
import { AiSearchComposer } from "./AiSearchComposer";
import { AiQuerySuggestionList } from "./AiQuerySuggestionList";
import { AiCommandMenuGrid } from "./AiCommandMenuGrid";
import { AiCommandMenuItemCard } from "./AiCommandMenuItem";
import { AiCommandCardBreadcrumb } from "./AiCommandCardBreadcrumb";
import { AiCommandCardStatus } from "./AiCommandCardStatus";
import {
  demoBreadcrumbs,
  demoMenuItems,
  demoProfile,
  demoQuerySuggestions,
} from "../AiCommandCard.fixtures";

const meta: Meta = {
  title: "AiCommandCard/Parts",
};

export default meta;
type Story = StoryObj;

export const Trigger: Story = {
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

export const ParticleField: Story = {
  render: () => (
    <PartStoryShell>
      <div style={{ position: "relative", inlineSize: 44, blockSize: 44 }}>
        <AiParticleField />
      </div>
    </PartStoryShell>
  ),
};

export const NotificationUnread: Story = {
  render: () => (
    <PartStoryShell>
      <AiNotificationAction notificationCount={7} onNotificationActivate={fn()} />
    </PartStoryShell>
  ),
};

export const NotificationEmpty: Story = {
  render: () => (
    <PartStoryShell>
      <AiNotificationAction notificationCount={0} onNotificationActivate={fn()} />
    </PartStoryShell>
  ),
};

export const Profile: Story = {
  render: () => (
    <PartStoryShell>
      <AiProfileAction profile={demoProfile} onProfileActivate={fn()} />
    </PartStoryShell>
  ),
};

export const SearchComposer: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const orbSlotRef = useRef<HTMLSpanElement>(null);
    return (
      <PartStoryShell>
        <AiSearchComposer
          queryValue={value}
          queryState={value ? "typing" : "idle"}
          searchPlaceholder="Bu sayfada AI ile ara"
          onQueryValueChange={setValue}
          onQuerySubmitRequested={fn()}
          orbSlotRef={orbSlotRef}
        />
      </PartStoryShell>
    );
  },
};

export const SuggestionListWrappedMobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile320" } },
  render: () => (
    <PartStoryShell>
      <AiQuerySuggestionList
        querySuggestions={demoQuerySuggestions}
        onSuggestionSelect={fn()}
      />
    </PartStoryShell>
  ),
};

export const MenuItemDefault: Story = {
  render: () => (
    <PartStoryShell>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        <AiCommandMenuItemCard
          menuItem={demoMenuItems[0]}
          staggerIndex={0}
          onMenuItemSelect={fn()}
        />
      </ul>
    </PartStoryShell>
  ),
};

export const MenuItemDisabled: Story = {
  render: () => (
    <PartStoryShell>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        <AiCommandMenuItemCard
          menuItem={{ ...demoMenuItems[0], disabled: true }}
          staggerIndex={0}
          onMenuItemSelect={fn()}
        />
      </ul>
    </PartStoryShell>
  ),
};

export const MenuGridTwelveItems: Story = {
  render: () => (
    <PartStoryShell>
      <AiCommandMenuGrid menuItems={demoMenuItems} onMenuItemSelect={fn()} />
    </PartStoryShell>
  ),
};

export const BreadcrumbCurrentPageOnly: Story = {
  render: () => (
    <PartStoryShell state="collapsed">
      <AiCommandCardBreadcrumb breadcrumbs={demoBreadcrumbs} isCardExpanded={false} />
    </PartStoryShell>
  ),
};

export const BreadcrumbFullPath: Story = {
  render: () => (
    <PartStoryShell>
      <AiCommandCardBreadcrumb breadcrumbs={demoBreadcrumbs} isCardExpanded />
    </PartStoryShell>
  ),
};

export const StatusSubmitting: Story = {
  render: () => (
    <PartStoryShell>
      <AiCommandCardStatus queryState="submitting" />
    </PartStoryShell>
  ),
};

export const StatusError: Story = {
  render: () => (
    <PartStoryShell>
      <AiCommandCardStatus queryState="error" />
    </PartStoryShell>
  ),
};

/** Expanded + pending query: the orb reads as the "ask AI" control. */
export const TriggerAskMode: Story = {
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
