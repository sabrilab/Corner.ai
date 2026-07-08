import { ProfilClient } from "@/components/ProfilClient";
import { getFeedItems } from "@/lib/get-feed";

export const revalidate = 900;

export default async function ProfilPage() {
  const items = await getFeedItems();
  return <ProfilClient items={items} />;
}
