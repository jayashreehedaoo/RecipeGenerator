export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    expiryDate: string; // ISO date string
    addedDate: string; // ISO date string
}
