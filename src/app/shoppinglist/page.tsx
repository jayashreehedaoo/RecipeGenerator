import { getDb, schema } from "@/db";
import ShoppingListClientWrapper from "./ShoppingListClientWrapper";

// Force dynamic rendering - don't try to statically generate this page
export const dynamic = 'force-dynamic';

export default async function ShoppingListPage() {
  const db = await getDb();
  const items = await db.select().from(schema.ShoppingListItem);

  return <ShoppingListClientWrapper items={items} />;
}