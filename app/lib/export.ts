export function exportToCsv<T extends Record<string, any>>(data: T[], filename: string, columns?: { key: string; label: string }[]) {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const keys = columns ? columns.map((c) => c.key) : Object.keys(data[0]);
  const labels = columns ? columns.map((c) => c.label) : keys;

  const escapeCsvValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = labels.map(escapeCsvValue).join(",");
  const rows = data.map((row) =>
    keys.map((key) => escapeCsvValue(row[key])).join(",")
  );

  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportOrdersToCsv(orders: any[]) {
  const columns = [
    { key: "id", label: "Order ID" },
    { key: "createdAt", label: "Date" },
    { key: "customer.name", label: "Customer" },
    { key: "status", label: "Status" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "subtotal", label: "Subtotal" },
    { key: "discount", label: "Discount" },
    { key: "total", label: "Total" },
  ];

  const formattedData = orders.map((order) => ({
    id: order.id,
    createdAt: new Date(order.createdAt).toLocaleString(),
    customer: order.customer?.name || "",
    status: order.status,
    paymentMethod: order.paymentMethod || "N/A",
    subtotal: order.subtotal?.toFixed(2) || "0.00",
    discount: order.discount?.toFixed(2) || "0.00",
    total: order.total?.toFixed(2) || "0.00",
  }));

  exportToCsv(formattedData, "orders", columns);
}

export function exportStaffToCsv(staff: any[]) {
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
  ];

  const formattedData = staff.map((member) => ({
    name: member.name,
    email: member.email,
    phone: member.phone,
    role: member.role,
    status: member.status,
    createdAt: new Date(member.createdAt).toLocaleDateString(),
  }));

  exportToCsv(formattedData, "staff", columns);
}

export function exportInventoryToCsv(inventory: any[]) {
  const columns = [
    { key: "menuItemId", label: "Item ID" },
    { key: "title", label: "Title" },
    { key: "stock", label: "Stock" },
    { key: "lowStockThreshold", label: "Low Stock Threshold" },
    { key: "unit", label: "Unit" },
    { key: "category", label: "Category" },
    { key: "updatedAt", label: "Last Updated" },
  ];

  const formattedData = inventory.map((item) => ({
    menuItemId: item.menuItemId,
    title: item.title,
    stock: item.stock,
    lowStockThreshold: item.lowStockThreshold,
    unit: item.unit,
    category: item.category,
    updatedAt: new Date(item.updatedAt).toLocaleDateString(),
  }));

  exportToCsv(formattedData, "inventory", columns);
}
