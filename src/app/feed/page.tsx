import { FeedClient } from "@/components/FeedClient";
import { getFeedItems } from "@/lib/get-feed";

export const revalidate = 3600;

export default async function FeedPage() {
  const items = await getFeedItems();
  return <FeedClient items={items} />;
}
