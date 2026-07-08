import type { FeedCategory, ModelCategory } from "./types";

export const feedCategoryStyles: Record<
  FeedCategory,
  { label: string; bg: string; text: string; chip: string; solid: string }
> = {
  release: {
    label: "Sortie",
    bg: "bg-violet-100",
    text: "text-violet-950",
    chip: "bg-violet-950/10 text-violet-950",
    solid: "bg-violet-500",
  },
  paper: {
    label: "Recherche",
    bg: "bg-sky-100",
    text: "text-sky-950",
    chip: "bg-sky-950/10 text-sky-950",
    solid: "bg-sky-500",
  },
  update: {
    label: "Mise à jour",
    bg: "bg-pink-100",
    text: "text-pink-950",
    chip: "bg-pink-950/10 text-pink-950",
    solid: "bg-pink-500",
  },
  benchmark: {
    label: "Classement",
    bg: "bg-lime-100",
    text: "text-lime-950",
    chip: "bg-lime-950/10 text-lime-950",
    solid: "bg-lime-500",
  },
  content: {
    label: "Contenu généré",
    bg: "bg-orange-100",
    text: "text-orange-950",
    chip: "bg-orange-950/10 text-orange-950",
    solid: "bg-orange-500",
  },
};

export const modelCategoryStyles: Record<
  ModelCategory,
  { label: string; bg: string; text: string; solid: string; ring: string }
> = {
  texte: {
    label: "Texte",
    bg: "bg-violet-100",
    text: "text-violet-950",
    solid: "bg-violet-500",
    ring: "ring-violet-500",
  },
  image: {
    label: "Image",
    bg: "bg-pink-100",
    text: "text-pink-950",
    solid: "bg-pink-500",
    ring: "ring-pink-500",
  },
  video: {
    label: "Vidéo",
    bg: "bg-orange-100",
    text: "text-orange-950",
    solid: "bg-orange-500",
    ring: "ring-orange-500",
  },
  audio: {
    label: "Audio",
    bg: "bg-lime-100",
    text: "text-lime-950",
    solid: "bg-lime-500",
    ring: "ring-lime-500",
  },
  code: {
    label: "Code",
    bg: "bg-amber-100",
    text: "text-amber-950",
    solid: "bg-amber-500",
    ring: "ring-amber-500",
  },
};
