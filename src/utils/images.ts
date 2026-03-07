import {
  resolveCardImagePolicy as resolveCardImagePolicyShared,
  resolveDetailImagePolicy as resolveDetailImagePolicyShared,
  resolveImageLike as resolveImageLikeShared,
  resolveImagePolicy as resolveImagePolicyShared,
  resolveLogoAsset as resolveLogoAssetShared,
  type ImagePolicy,
  type LogoContainer,
} from "@semio-community/ecosystem-site-core";
import type { ImageMetadata } from "astro";

export type ImageLike =
  | ImageMetadata
  | {
      src: string;
      alt?: string;
    }
  | string
  | undefined;

export { type ImagePolicy, type LogoContainer };

export const resolveImagePolicy = (
  policy?: Partial<ImagePolicy> | null,
): ImagePolicy => {
  return resolveImagePolicyShared(policy);
};

export const resolveImageLike = (image?: ImageLike) => {
  return resolveImageLikeShared(image as
    | {
        src: string;
        alt?: string;
      }
    | string
    | undefined);
};

export const resolveLogoAsset = (images?: LogoContainer): ImageLike => {
  return resolveLogoAssetShared(images) as ImageLike;
};

export const resolveCardImagePolicy = ({
  hero,
  logoOrAvatar,
  policy,
}: {
  hero?: ImageLike;
  logoOrAvatar?: ImageLike;
  policy?: Partial<ImagePolicy> | null;
}): {
  image?: ImageLike;
  logo?: ImageLike;
  showFallbackIcon: boolean;
  logoBackdrop: boolean;
} => {
  return resolveCardImagePolicyShared({
    hero: hero as
      | {
          src: string;
          alt?: string;
        }
      | string
      | undefined,
    logoOrAvatar: logoOrAvatar as
      | {
          src: string;
          alt?: string;
        }
      | string
      | undefined,
    policy,
  }) as {
    image?: ImageLike;
    logo?: ImageLike;
    showFallbackIcon: boolean;
    logoBackdrop: boolean;
  };
};

export const resolveDetailImagePolicy = ({
  hero,
  logoOrAvatar,
  policy,
}: {
  hero?: ImageLike;
  logoOrAvatar?: ImageLike;
  policy?: Partial<ImagePolicy> | null;
}): {
  image?: ImageLike;
  profile?: ImageLike;
  showFallbackIcon: boolean;
  logoBackdrop: boolean;
} => {
  return resolveDetailImagePolicyShared({
    hero: hero as
      | {
          src: string;
          alt?: string;
        }
      | string
      | undefined,
    logoOrAvatar: logoOrAvatar as
      | {
          src: string;
          alt?: string;
        }
      | string
      | undefined,
    policy,
  }) as {
    image?: ImageLike;
    profile?: ImageLike;
    showFallbackIcon: boolean;
    logoBackdrop: boolean;
  };
};
