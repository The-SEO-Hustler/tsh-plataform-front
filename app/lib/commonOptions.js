export const commonOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",

    },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#111827", // gray-900
      titleFont: {
        size: 13,
        weight: "600",
        family: "'Inter', sans-serif"
      },
      bodyColor: "#374151", // gray-700
      bodyFont: {
        size: 12,
        family: "'Inter', sans-serif"
      },
      padding: 12,
      cornerRadius: 8,
      borderColor: "#E5E7EB", // gray-200
      borderWidth: 1,
      boxPadding: 6,
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
