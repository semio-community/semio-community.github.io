/**
 * Centralized status configuration for consistent styling across all components
 */

// Status types for different content types
export type HardwareStatus =
  | "available"
  | "in-progress"
  | "coming-soon"
  | "deprecated";
export type SoftwareStatus =
  | "stable"
  | "beta"
  | "alpha"
  | "in-progress"
  | "deprecated";
export type EventStatus = "upcoming" | "ongoing" | "past";
export type GenericStatus = HardwareStatus | SoftwareStatus | EventStatus;

// Color definitions - consistent across the application
export const STATUS_COLORS = {
  // Success/Available states - Green
  available: {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/80",
    bullet: "bg-green-500",
    border: "border-green-500",
    chip: "green" as const,
  },
  stable: {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/80",
    bullet: "bg-green-500",
    border: "border-green-500",
    chip: "green" as const,
  },
  ongoing: {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/80",
    bullet: "bg-green-500",
    border: "border-green-500",
    chip: "green" as const,
  },

  // In Development states - Yellow for in-progress, Blue for beta
  "in-progress": {
    text: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/80",
    bullet: "bg-yellow-500",
    border: "border-yellow-500",
    chip: "yellow" as const,
  },
  beta: {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/80",
    bullet: "bg-blue-500",
    border: "border-blue-500",
    chip: "blue" as const,
  },
  upcoming: {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/80",
    bullet: "bg-blue-500",
    border: "border-blue-500",
    chip: "blue" as const,
  },

  // Early/Planning states - Blue for coming-soon, Orange for alpha
  "coming-soon": {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/80",
    bullet: "bg-blue-500",
    border: "border-blue-500",
    chip: "blue" as const,
  },
  alpha: {
    text: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/80",
    bullet: "bg-orange-500",
    border: "border-orange-500",
    chip: "orange" as const,
  },

  // Deprecated/Past states - Gray
  deprecated: {
    text: "text-neutral-600 dark:text-neutral-400",
    bg: "bg-neutral-500/80",
    bullet: "bg-neutral-500",
    border: "border-neutral-500",
    chip: "neutral" as const,
  },
  past: {
    text: "text-neutral-600 dark:text-neutral-400",
    bg: "bg-neutral-500/80",
    bullet: "bg-neutral-500",
    border: "border-neutral-500",
    chip: "gray" as const,
  },
} as const;

// Status labels for display
export const STATUS_LABELS: Record<GenericStatus, string> = {
  // Hardware
  available: "Available",
  "in-progress": "In Progress",
  "coming-soon": "Coming Soon",

  // Software
  stable: "Stable",
  beta: "Beta",
  alpha: "Alpha",

  // Events
  upcoming: "Upcoming",
  ongoing: "Happening Now",
  past: "Past Event",

  // Shared
  deprecated: "Deprecated",
};

// Helper function to get status color
export function getStatusColor(
  status: string | undefined,
  colorType: "text" | "bg" | "bullet" | "border" | "chip" = "text",
): string {
  if (!status || !(status in STATUS_COLORS)) {
    return colorType === "chip"
      ? "gray"
      : "text-neutral-600 dark:text-neutral-400";
  }

  const statusConfig = STATUS_COLORS[status as keyof typeof STATUS_COLORS];

  switch (colorType) {
    case "text":
      return statusConfig.text;
    case "bg":
      return statusConfig.bg;
    case "bullet":
      return statusConfig.bullet;
    case "border":
      return statusConfig.border;
    case "chip":
      return statusConfig.chip;
    default:
      return statusConfig.text;
  }
}

// Helper function to get status label
export function getStatusLabel(status: string | undefined): string {
  if (!status || !(status in STATUS_LABELS)) {
    return status || "";
  }
  return STATUS_LABELS[status as GenericStatus];
}

// Category labels for different content types
export const CATEGORY_LABELS = {
  // Hardware categories
  hardware: {
    mobile: "Mobile Robot",
    social: "Social Robot",
    assistive: "Assistive Robot",
    research: "Research Platform",
    educational: "Educational Robot",
  },

  // Software categories
  software: {
    framework: "Framework",
    library: "Library",
    tool: "Tool",
    simulation: "Simulation",
    dataset: "Dataset",
    model: "Model",
  },
} as const;

// Helper function to get category label
export function getCategoryLabel(
  type: "hardware" | "software",
  category: string | undefined,
): string {
  if (!category || !CATEGORY_LABELS[type]) {
    return category || "";
  }

  const labels = CATEGORY_LABELS[type];
  if (category in labels) {
    return labels[category as keyof typeof labels];
  }

  return category;
}

// Export types for TypeScript usage
export type StatusColorConfig =
  (typeof STATUS_COLORS)[keyof typeof STATUS_COLORS];
export type ChipColor = StatusColorConfig["chip"];
