import type { FeedCategory } from "./types";

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: FeedCategory;
  /** Certaines sources (ex: redirections Google News) n'exposent pas d'image exploitable côté serveur. */
  skipImage?: boolean;
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
  {
    id: "techcrunch",
    name: "TechCrunch",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "moves",
  },
  {
    id: "verge",
    name: "The Verge",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    category: "moves",
  },
  {
    id: "gnews-anthropic",
    name: "Anthropic (presse)",
    url: "https://news.google.com/rss/search?q=Anthropic+Claude+when:2d&hl=fr&gl=FR&ceid=FR:fr",
    category: "release",
    skipImage: true,
  },
  {
    id: "gnews-founders",
    name: "Dirigeants IA",
    url: "https://news.google.com/rss/search?q=(%22Sam+Altman%22+OR+%22Dario+Amodei%22+OR+%22Demis+Hassabis%22+OR+%22Elon+Musk%22+OR+%22Mustafa+Suleyman%22+OR+%22Mira+Murati%22)+(IA+OR+%22intelligence+artificielle%22+OR+OpenAI+OR+Anthropic+OR+xAI+OR+DeepMind)+when:2d&hl=fr&gl=FR&ceid=FR:fr",
    category: "moves",
    skipImage: true,
  },
];
