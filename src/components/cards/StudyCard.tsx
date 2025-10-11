import React from "react";
import { ItemCard } from "@/components/ItemCard";

export interface StudyCardProps {
  studyId: string;
  data: {
    title?: string;
    abstract?: string;
    type?: string;
    status?: string;
    publishDate?: Date | string;
    venue?: string;
    doi?: string;
    arxivId?: string;
    images?: {
      logo?: any;
      hero?: any;
    };
    links?: {
      projectPage?: string;
      code?: string;
      demo?: string;
    };
    featured?: boolean;
  };
  className?: string;
}

export const StudyCard: React.FC<StudyCardProps> = ({
  studyId,
  data,
  className,
}) => {
  // Build category from study type and year
  const year = data.publishDate ? new Date(data.publishDate).getFullYear() : "";
  const typeLabel = data.type
    ? data.type.charAt(0).toUpperCase() + data.type.slice(1)
    : "";
  const category = [typeLabel, year].filter(Boolean).join(" • ");

  // Determine status based on publication status
  let status = data.status;
  if (!status) {
    if (data.type === "preprint") {
      status = "preprint";
    } else if (data.arxivId || data.venue?.includes("arXiv")) {
      status = "preprint";
    } else if (data.doi) {
      status = "published";
    }
  }

  return (
    <ItemCard
      title={data.title || studyId}
      description={data.abstract}
      href={`/studies/${studyId}`}
      type="studies"
      image={data.images?.hero}
      imageAlt={data.images?.hero?.alt || data.title}
      logo={data.images?.logo}
      status={status}
      category={category}
      featured={data.featured}
      links={{
        website: data.links?.projectPage,
        github: data.links?.code,
        demo: data.links?.demo,
        docs: data.doi
          ? `https://doi.org/${data.doi}`
          : data.arxivId
            ? `https://arxiv.org/abs/${data.arxivId}`
            : undefined,
      }}
    />
  );
};
