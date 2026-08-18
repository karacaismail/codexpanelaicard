import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiQuerySuggestionList } from "./AiQuerySuggestionList";
import { demoQuerySuggestions } from "../AiCommandCard.fixtures";

const meta: Meta = { title: "AiCommandCard/Parçalar/AiQuerySuggestionList" };
export default meta;
type Story = StoryObj;

/** Six pills with the staggered beckon glow (expanded shell context). */
export const SixPills: Story = {
  render: () => (
    <PartStoryShell>
      <AiQuerySuggestionList
        querySuggestions={demoQuerySuggestions}
        onSuggestionSelect={fn()}
      />
    </PartStoryShell>
  ),
};

export const WrappedMobile: Story = {
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
