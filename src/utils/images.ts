import type { ImageMetadata } from "astro";

export type ImageLike =
  | ImageMetadata
  | {
      src: string;
      alt?: string;
    }
  | string
  | undefined;

export const resolveImageLike = (image?: ImageLike) => {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  return image.src;
};

export type LogoContainer =
  | {
      logo?: ImageLike;
      logoUrl?: string;
    }
  | Record<string, unknown>
  | null
  | undefined;

export const resolveLogoAsset = (images?: LogoContainer): ImageLike => {
  if (!images) return undefined;
  const source =
    (images as { logo?: ImageLike })?.logo ??
    (images as { logoUrl?: string })?.logoUrl;
  return source;
};
