import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { createEcosystemCollections } from "@semio-community/ecosystem-content-schema";
import { glob } from "astro/loaders";

export const collections = createEcosystemCollections({
	defineCollection,
	glob,
	z,
});
