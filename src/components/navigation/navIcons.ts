import {
  TestTube,
  UserHandUp,
  Calendar,
  UsersGroupTwoRounded,
  UserPlusRounded,
  Document2,
} from "@solar-icons/react-perf/LineDuotone";
import type { ComponentType, SVGProps } from "react";

export type NavigationIcon = ComponentType<SVGProps<SVGSVGElement>>;

const baseRouteIconMap: Record<string, NavigationIcon> = {
  projects: TestTube,
  services: UserHandUp,
  events: Calendar,
  contributors: UsersGroupTwoRounded,
  "get-involved": UserPlusRounded,
  about: Document2,
};

export const navIconMap = Object.fromEntries(
  Object.entries(baseRouteIconMap).map(([slug, Icon]) => [`/${slug}/`, Icon]),
) as Record<string, NavigationIcon>;

export const mainRouteIconMap = baseRouteIconMap;
