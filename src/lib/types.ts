export type FeedCategory = "release" | "paper" | "update" | "benchmark" | "content";

export interface FeedSlide {
  title: string;
  body: string;
}

export interface FeedItem {
  id: string;
  category: FeedCategory;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  modelTag?: string;
  mediaKind: "image" | "video" | "none";
  slides: FeedSlide[];
}

export type ModelCategory = "texte" | "image" | "video" | "audio" | "code";

export interface ModelScoreSource {
  name: string;
  score: number;
}

export interface ModelEntry {
  id: string;
  slug: string;
  name: string;
  lab: string;
  category: ModelCategory;
  score: number;
  description: string;
  strengths: string[];
  sources: ModelScoreSource[];
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}
