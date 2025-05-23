// routes/orders/data/data.ts

// Example: If an order can have "Open", "Closed", "Cancelled" statuses
export const orderStatuses = ["Open", "Closed", "Cancelled"];

export function getTotalOrderValue(order: any): number {
  // your logic to sum shipments/items
  return 0;
}
