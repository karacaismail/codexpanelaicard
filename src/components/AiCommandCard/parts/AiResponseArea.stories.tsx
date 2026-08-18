import type { Meta, StoryObj } from "@storybook/react";
import { PartStoryShell } from "./partStoryShell";
import { AiResponseArea } from "./AiResponseArea";
import {
  ClosedDealsReport,
  RevenueTrendReport,
  RiskyCustomersReport,
} from "../AiCommandCard.reports";

const meta: Meta = { title: "AiCommandCard/Parts/AiResponseArea" };
export default meta;
type Story = StoryObj;

export const Thinking: Story = {
  render: () => (
    <PartStoryShell>
      <AiResponseArea response={null} queryState="submitting" motion="full" />
    </PartStoryShell>
  ),
};

export const StreamedText: Story = {
  render: () => (
    <PartStoryShell>
      <AiResponseArea
        response="Bu sayfadaki verilere göre önce satış hattındaki bekleyen fırsatları gözden geçirmenizi öneririm."
        queryState="success"
        motion="full"
      />
    </PartStoryShell>
  ),
};

export const RichClosedDeals: Story = {
  render: () => (
    <PartStoryShell>
      <AiResponseArea response={<ClosedDealsReport />} queryState="success" motion="full" />
    </PartStoryShell>
  ),
};

export const RichRevenueTrend: Story = {
  render: () => (
    <PartStoryShell>
      <AiResponseArea response={<RevenueTrendReport />} queryState="success" motion="full" />
    </PartStoryShell>
  ),
};

export const RichRiskTable: Story = {
  render: () => (
    <PartStoryShell>
      <AiResponseArea response={<RiskyCustomersReport />} queryState="success" motion="full" />
    </PartStoryShell>
  ),
};
