import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { AdminPageModal } from "./AdminPageModal";
import { demoMenuItems } from "../components/AiCommandCard/AiCommandCard.fixtures";
import "./demo.css";

const meta: Meta = { title: "Demo/AdminPageModal" };
export default meta;
type Story = StoryObj;

/** Menü kartına tıklayınca açılan admin sayfa modalı (demo host katmanı). */
export const Raporlar: Story = {
  render: () => (
    <AdminPageModal
      menuItem={demoMenuItems.find((item) => item.id === "reports") ?? demoMenuItems[0]}
      onClose={fn()}
    />
  ),
};
