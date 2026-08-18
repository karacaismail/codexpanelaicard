import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: {
        mobile320: {
          name: "Mobile 320",
          styles: { width: "320px", height: "480px" },
        },
        desktop1440: {
          name: "Desktop 1440",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
  },
};

export default preview;
