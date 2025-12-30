import { getDb, schema } from "@/db";
import { InventoryClientWrapper } from "./InventoryClientWrapper";
import { InventoryItem } from "@/types/recipe-generator";

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  // ✅ Direct database query on the server
  const db = await getDb();
  const items: InventoryItem[] = await db.select().from(schema.InventoryItem);

  // ✅ Pass data to client component
  return <InventoryClientWrapper initialItems={items} />;
}