import type { CollectionEntry } from "astro:content";
import type { PersonPopoverProps } from "@/components/people/PersonPopover";

type PersonEntry = CollectionEntry<"people"> | null | undefined;

export function serializePersonForPopover(
  personEntry: PersonEntry,
): PersonPopoverProps["person"] {
  if (!personEntry?.data) {
    return null;
  }

  const { data } = personEntry;
  const avatar = data.images?.avatar;

  return {
    id: personEntry.id,
    name: data.name,
    honorific: data.honorific,
    pronouns: data.pronouns,
    title: data.title,
    bio: data.bio,
    expertise: data.expertise,
    links: data.links,
    images: avatar
      ? {
          avatar: {
            src: avatar.src,
            width: avatar.width,
            height: avatar.height,
            format: avatar.format,
          },
        }
      : undefined,
  };
}
