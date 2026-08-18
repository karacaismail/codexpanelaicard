import type { Meta, StoryObj } from "@storybook/react";
import {
  ClosedDealsReport,
  PageExplanationReport,
  PipelineDistributionReport,
  RevenueTrendReport,
  RiskyCustomersReport,
  TeamPerformanceReport,
} from "./AiCommandCard.reports";
import hostStyles from "./AiCommandCard.module.css";

const meta: Meta = { title: "AiCommandCard/Raporlar" };
export default meta;
type Story = StoryObj;

/* Raporlar host tokenlarını (--ai-cc-*) kullanır; story'de host sınıfıyla sarılır. */
function ReportStage({ children }: { children: React.ReactNode }) {
  return (
    <div className={hostStyles.host} style={{ maxInlineSize: 560 }}>
      {children}
    </div>
  );
}

export const KapananFirsatlar: Story = {
  render: () => (
    <ReportStage>
      <ClosedDealsReport />
    </ReportStage>
  ),
};

export const RiskliMusteriler: Story = {
  render: () => (
    <ReportStage>
      <RiskyCustomersReport />
    </ReportStage>
  ),
};

export const SayfaAciklamasi: Story = {
  render: () => (
    <ReportStage>
      <PageExplanationReport />
    </ReportStage>
  ),
};

export const GelirTrendi: Story = {
  render: () => (
    <ReportStage>
      <RevenueTrendReport />
    </ReportStage>
  ),
};

export const SatisHattiDagilimi: Story = {
  render: () => (
    <ReportStage>
      <PipelineDistributionReport />
    </ReportStage>
  ),
};

export const EkipPerformansi: Story = {
  render: () => (
    <ReportStage>
      <TeamPerformanceReport />
    </ReportStage>
  ),
};
