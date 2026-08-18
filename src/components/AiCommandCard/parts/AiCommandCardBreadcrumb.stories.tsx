import type { Meta, StoryObj } from "@storybook/react";
import { PartStoryShell } from "./partStoryShell";
import { AiCommandCardBreadcrumb } from "./AiCommandCardBreadcrumb";
import { demoBreadcrumbs } from "../AiCommandCard.fixtures";

const meta: Meta = { title: "AiCommandCard/Parçalar/AiCommandCardBreadcrumb" };
export default meta;
type Story = StoryObj;

export const CurrentPageOnly: Story = {
  render: () => (
    <PartStoryShell state="collapsed">
      <AiCommandCardBreadcrumb breadcrumbs={demoBreadcrumbs} isCardExpanded={false} />
    </PartStoryShell>
  ),
};

export const FullPath: Story = {
  render: () => (
    <PartStoryShell>
      <AiCommandCardBreadcrumb breadcrumbs={demoBreadcrumbs} isCardExpanded />
    </PartStoryShell>
  ),
};
