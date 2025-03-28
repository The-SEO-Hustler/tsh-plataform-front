export const commonOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
    tooltip: {
      bodyFont: { size: 12 },
      callbacks: {
        label: function (context) {
          const label = context.label || "";
          const value = context.raw || 0;
          return `${label}: ${value}`;
        },
      },
    },
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 20,
    },
  },
};
