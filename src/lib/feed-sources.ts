import type { FeedCategory } from "./types";

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: FeedCategory;
}

export const feedSources: FeedSource[] = [
  { id: "openai", name: "OpenAI", url: "https://openai.com/news/rss.xml", category: "release" },
  {
    id: "deepmind",
    name: "Google DeepMind",
    url: "https://deepmind.google/blog/rss.xml",
    category: "release",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    url: "https://huggingface.co/blog/feed.xml",
    category: "update",
  },
  {
    id: "arxiv",
    name: "Arxiv · cs.AI",
    url: "https://export.arxiv.org/rss/cs.AI",
    category: "paper",
  },
  {
    id: "willison",
    name: "Simon Willison",
    url: "https://simonwillison.net/atom/everything/",
    category: "paper",
  },
];
