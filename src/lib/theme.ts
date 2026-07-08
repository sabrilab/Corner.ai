import type { FeedCategory, ModelCategory } from "./types";

export const feedCategoryStyles: Record<
  FeedCategory,
  { label: string; bg: string; text: string; chip: string; solid: string; ring: string }
> = {
  release: {
    label: "Sortie",
    bg: "bg-violet-200",
    text: "text-violet-950",
    chip: "bg-violet-600 text-white",
    solid: "bg-violet-500",
    ring: "ring-violet-400",
  },
  paper: {
    label: "Recherche",
    bg: "bg-sky-200",
    text: "text-sky-950",
    chip: "bg-sky-600 text-white",
    solid: "bg-sky-500",
    ring: "ring-sky-400",
  },
  update: {
    label: "Mise à jour",
    bg: "bg-pink-200",
    text: "text-pink-950",
    chip: "bg-pink-600 text-white",
    solid: "bg-pink-500",
    ring: "ring-pink-400",
  },
  benchmark: {
    label: "Classement",
    bg: "bg-lime-200",
    text: "text-lime-950",
    chip: "bg-lime-600 text-white",
    solid: "bg-lime-500",
    ring: "ring-lime-400",
  },
  content: {
    label: "Contenu généré",
    bg: "bg-orange-200",
    text: "text-orange-950",
    chip: "bg-orange-600 text-white",
    solid: "bg-orange-500",
    ring: "ring-orange-400",
  },
  moves: {
    label: "Dirigeants & moves",
    bg: "bg-rose-200",
    text: "text-rose-950",
    chip: "bg-rose-600 text-white",
    solid: "bg-rose-500",
    ring: "ring-rose-400",
  },
};

export const modelCategoryStyles: Record<
  ModelCategory,
  { label: string; bg: string; text: string; solid: string; ring: string }
> = {
  texte: {
    label: "Texte",
    bg: "bg-violet-200",
    text: "text-violet-950",
    solid: "bg-violet-500",
    ring: "ring-violet-500",
  },
  image: {
    label: "Image",
    bg: "bg-pink-200",
    text: "text-pink-950",
    solid: "bg-pink-500",
    ring: "ring-pink-500",
  },
  video: {
    label: "Vidéo",
    bg: "bg-orange-200",
    text: "text-orange-950",
    solid: "bg-orange-500",
    ring: "ring-orange-500",
  },
  audio: {
    label: "Audio",
    bg: "bg-lime-200",
    text: "text-lime-950",
    solid: "bg-lime-500",
    ring: "ring-lime-500",
  },
  code: {
    label: "Code",
    bg: "bg-amber-200",
    text: "text-amber-950",
    solid: "bg-amber-500",
    ring: "ring-amber-500",
  },
};
