import { Trophy, Award, Medal, AlertCircle } from "lucide-react";

export const getScoreAppearance = (score) => {
  if (score >= 90) {
    return {
      icon: Trophy,
      gradient: "from-emerald-500 to-emerald-400",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      bgColor: "bg-emerald-50",
    };
  } else if (score >= 70) {
    return {
      icon: Award,
      gradient: "from-blue-500 to-blue-400",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
    };
  } else if (score >= 50) {
    return {
      icon: Medal,
      gradient: "from-amber-500 to-amber-400",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
      bgColor: "bg-amber-50",
    };
  } else {
    return {
      icon: AlertCircle,
      gradient: "from-red-500 to-red-400",
      textColor: "text-red-600",
      borderColor: "border-red-200",
      bgColor: "bg-red-50",
    };
  }
};