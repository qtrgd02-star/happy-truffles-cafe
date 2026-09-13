"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Printer, Download, FileText } from "lucide-react";

interface ReceiptItem {
  title: string;
  quantity: number;
  price: number;
}

interface ReceiptProps {
  orderId: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  total: number;
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  orderType: "dine-in" | "takeaway" | "delivery";
  paymentMethod: "cash" | "card" | "wallet";
  createdAt: string;
}

export default function Receipt({ order }: { order: ReceiptProps }) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${order.orderId}</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .items { margin: 10px 0; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { border-top: 2px dashed #000; padding-top: 10px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Happy Truffles Cafe</h2>
            <p>Gold Plaza, Abu Hamour</p>
            <p>Doha, Qatar</p>
            <p>Tel: +974 3159 0002</p>
          </div>
          <p><strong>Order:</strong> ${order.orderId}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Customer:</strong> ${order.customer.name}</p>
          <p><strong>Phone:</strong> ${order.customer.phone}</p>
          <p><strong>Type:</strong> ${order.orderType}</p>
          <div class="items">
            ${order.items.map(item => `
              <div class="item">
                <span>${item.title} x${item.quantity}</span>
                <span>QAR ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join("")}
          </div>
          <div class="total">
            <div class="item">
              <span>Subtotal:</span>
              <span>QAR ${order.subtotal.toFixed(2)}</span>
            </div>
            ${order.discount > 0 ? `
              <div class="item">
                <span>Discount:</span>
                <span>- QAR ${order.discount.toFixed(2)}</span>
              </div>
            ` : ""}
            <div class="item" style="font-weight: bold; font-size: 1.2em;">
              <span>Total:</span>
              <span>QAR ${order.total.toFixed(2)}</span>
            </div>
            <div class="item">
              <span>Payment:</span>
              <span>${order.paymentMethod.toUpperCase()}</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for your order!</p>
            <p>Visit us again!</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleDownload = () => {
    const receiptText = `
Happy Truffles Cafe
Gold Plaza, Abu Hamour
Doha, Qatar
Tel: +974 3159 0002

Order: ${order.orderId}
Date: ${new Date(order.createdAt).toLocaleString()}
Customer: ${order.customer.name}
Phone: ${order.customer.phone}
Type: ${order.orderType}

Items:
${order.items.map(item => `  ${item.title} x${item.quantity} - QAR ${(item.price * item.quantity).toFixed(2)}`).join("\n")}

Subtotal: QAR ${order.subtotal.toFixed(2)}
${order.discount > 0 ? `Discount: - QAR ${order.discount.toFixed(2)}\n` : ""}Total: QAR ${order.total.toFixed(2)}
Payment: ${order.paymentMethod.toUpperCase()}

Thank you for your order!
Visit us again!
    `;

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${order.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-playfair text-xl font-bold text-chocolate">Receipt</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-2 bg-truffle/10 text-truffle px-4 py-2 rounded-lg hover:bg-truffle/20 transition-colors"
          >
            <Printer size={16} />
            {isPrinting ? "Printing..." : "Print"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-chocolate/10 text-chocolate px-4 py-2 rounded-lg hover:bg-chocolate/20 transition-colors"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      <div className="border border-chocolate/10 rounded-xl p-4 space-y-2">
        <div className="text-center border-b border-dashed border-chocolate/20 pb-4 mb-4">
          <h4 className="font-bold text-lg">Happy Truffles Cafe</h4>
          <p className="text-xs text-chocolate/60">Gold Plaza, Abu Hamour, Doha</p>
          <p className="text-xs text-chocolate/60">Tel: +974 3159 0002</p>
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-mono">{order.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{order.customer.name}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-chocolate/20 pt-2 mt-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm py-1">
              <span>{item.title} x{item.quantity}</span>
              <span>QAR {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-chocolate/20 pt-2 mt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>QAR {order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span>- QAR {order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-chocolate/10">
            <span>Total:</span>
            <span>QAR {order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Payment:</span>
            <span className="capitalize">{order.paymentMethod}</span>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-dashed border-chocolate/20 mt-4">
          <p className="text-sm font-semibold">Thank you for your order!</p>
          <p className="text-xs text-chocolate/60">Visit us again!</p>
        </div>
      </div>
    </div>
  );
}
