import { FeedClient } from "@/components/FeedClient";
import { getFeedItems } from "@/lib/get-feed";

export const revalidate = 900;

export default async function FeedPage() {
  const items = await getFeedItems();
  return <FeedClient items={items} />;
}
