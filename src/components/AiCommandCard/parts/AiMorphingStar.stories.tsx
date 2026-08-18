import type { Meta, StoryObj } from "@storybook/react";
import { AiMorphingStar } from "./AiMorphingStar";

const meta: Meta = { title: "AiCommandCard/Parçalar/AiMorphingStar" };
export default meta;
type Story = StoryObj;

/** 12sn döngüde 5 → 3 → 4 uçlu formlar arasında canlı morph eden yıldız. */
export const Morphing: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        inlineSize: 120,
        blockSize: 120,
        background: "#6c63ee",
        borderRadius: "100%",
        color: "#fff",
      }}
    >
      <AiMorphingStar size={64} />
    </div>
  ),
};

export const SmallOnOrbColor: Story = {
  render: () => (
    <div style={{ color: "#6c63ee", padding: 16 }}>
      <AiMorphingStar size={24} />
    </div>
  ),
};
