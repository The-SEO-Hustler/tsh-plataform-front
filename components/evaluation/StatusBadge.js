import { Badge } from "@/components/ui/badge";


const getVariant = (type, status) => {
  if (type === "pq") {
    switch (status) {
      case "Highest":
      case "High":
        return "success";
      case "Medium":
        return "warning";
      case "Low":
      case "Lowest":
        return "danger";
      default:
        return "neutral";
    }
  }

  if (type === "nm") {
    switch (status) {
      case "FullyM":
      case "HM":
        return "success";
      case "MM":
        return "warning";
      case "SM":
      case "FailsM":
        return "danger";
      default:
        return "neutral";
    }
  }

  if (type === "check") {
    return status === "Pass" ? "success" : "danger";
  }

  return "neutral";
};

export default function StatusBadge({ type, status }) {
  const variant = getVariant(type, status);

  if (!status) {
    return <Badge variant="neutral">-</Badge>;
  }

  return <Badge variant={variant}>{status}</Badge>;
}
