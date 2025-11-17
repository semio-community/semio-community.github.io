import {
  TestTube,
  UserHandUp,
  Calendar,
  UsersGroupTwoRounded,
  UserPlusRounded,
} from "@solar-icons/react-perf/LineDuotone";
import type { ComponentType } from "react";

export const navIconMap: Record<string, ComponentType<{ className?: string }>> = {
  "/projects/": TestTube,
  "/services/": UserHandUp,
  "/events/": Calendar,
  "/contributors/": UsersGroupTwoRounded,
  "/get-involved/": UserPlusRounded,
};
