import type { ImageMetadata } from "astro";

export type ImageLike =
  | ImageMetadata
  | {
      src: string;
      alt?: string;
    }
  | string
  | undefined;

const normalizeImagePath = (value: string) => {
  if (!value) return value;
  let next = value;
  if (next.startsWith("@/")) {
    next = next.replace(/^@\//, "/src/");
  }
  if (next.startsWith("/assets/")) {
    next = `/src${next}`;
  }
  return next;
};

export const resolveImageLike = (image?: ImageLike) => {
  if (!image) return undefined;
  if (typeof image === "string") return normalizeImagePath(image);
  return normalizeImagePath(image.src);
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
  return resolveImageLike(source);
};
