import type React from "react";
import {
  DetailHero as CoreDetailHero,
  type DetailHeroProps as CoreDetailHeroProps,
  type DetailHeroAvatarRenderProps,
  type DetailHeroFeaturedRenderProps,
} from "@semio-community/ecosystem-site-core";
import { FeaturedStar } from "@/components/ui/FeaturedStar";
import { Avatar, type AvatarType } from "@/components/ui/Avatar";

export type DetailHeroProps = Omit<
  CoreDetailHeroProps,
  "renderAvatar" | "renderFeaturedStar"
>;

function renderAvatar(props: DetailHeroAvatarRenderProps) {
  const avatarTypeMap: Record<string, AvatarType> = {
    person: "person",
    organization: "organization",
    hardware: "hardware",
    software: "software",
    research: "research",
    event: "event",
  };

  return (
    <Avatar
      src={props.image as any}
      alt={props.alt}
      name={props.name}
      type={avatarTypeMap[props.entityType] ?? "organization"}
      size="2xl"
      rounded="full"
      className={props.className}
    />
  );
}

function renderFeaturedStar(props: DetailHeroFeaturedRenderProps) {
  return (
    <FeaturedStar
      state={props.state}
      size={props.size}
      glow
      className={props.className}
    />
  );
}

export const DetailHero: React.FC<DetailHeroProps> = (props) => {
  return (
    <CoreDetailHero
      {...props}
      renderAvatar={renderAvatar}
      renderFeaturedStar={renderFeaturedStar}
    />
  );
};
