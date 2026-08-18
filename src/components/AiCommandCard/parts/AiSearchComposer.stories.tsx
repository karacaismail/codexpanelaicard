import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PartStoryShell } from "./partStoryShell";
import { AiSearchComposer } from "./AiSearchComposer";

const meta: Meta = { title: "AiCommandCard/Parts/AiSearchComposer" };
export default meta;
type Story = StoryObj;

function ComposerHarness({ initialValue = "" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
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
}

export const Empty: Story = { render: () => <ComposerHarness /> };

export const WithQuery: Story = {
  render: () => <ComposerHarness initialValue="Riskli müşterileri listele" />,
};
