export interface InventoryAlert {
  id: string;
  itemId: number;
  itemName: string;
  currentStock: number;
  threshold: number;
  type: "low_stock" | "out_of_stock";
  message: string;
  createdAt: string;
  notified: boolean;
}

export function checkInventoryAlerts(items: any[]): InventoryAlert[] {
  const alerts: InventoryAlert[] = [];

  items.forEach((item) => {
    if (item.stock === undefined) return;

    if (item.stock === 0) {
      alerts.push({
        id: "alert-" + item.id + "-" + Date.now(),
        itemId: item.id,
        itemName: item.title,
        currentStock: item.stock,
        threshold: item.lowStockThreshold || 5,
        type: "out_of_stock",
        message: `${item.title} is out of stock!`,
        createdAt: new Date().toISOString(),
        notified: false,
      });
    } else if (item.stock <= (item.lowStockThreshold || 5)) {
      alerts.push({
        id: "alert-" + item.id + "-" + Date.now(),
        itemId: item.id,
        itemName: item.title,
        currentStock: item.stock,
        threshold: item.lowStockThreshold || 5,
        type: "low_stock",
        message: `${item.title} is running low on stock (${item.stock} remaining)`,
        createdAt: new Date().toISOString(),
        notified: false,
      });
    }
  });

  return alerts;
}

export async function sendInventoryAlertNotifications(alerts: InventoryAlert[]) {
  const unNotified = alerts.filter((a) => !a.notified);

  for (const alert of unNotified) {
    try {
      await fetch("/api/notifications/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "+97431590002",
          message: `Inventory Alert: ${alert.message}`,
        }),
      });

      alert.notified = true;
    } catch (e) {
      console.error("Failed to send inventory alert:", e);
    }
  }

  return alerts;
}
