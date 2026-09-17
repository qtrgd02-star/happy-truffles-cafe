"use client";

export type EmailTemplate = "order-confirmation" | "order-status-update" | "reservation-confirmation" | "promo-code" | "shift-summary";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  template?: EmailTemplate;
  orderId?: string;
  orderData?: any;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    const response = await fetch("/api/notifications/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(order: any): Promise<boolean> {
  const itemsHtml = order.items
    .map((item: any) => `<tr><td>${item.title} x${item.quantity}</td><td>QAR ${(item.price * item.quantity).toFixed(2)}</td></tr>`)
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #5D4037;">Order Confirmed!</h2>
      <p>Thank you for your order. Here are your order details:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #F5F5F5;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div style="border-top: 2px solid #5D4037; padding-top: 10px; margin-top: 20px;">
        <p style="font-size: 18px; font-weight: bold;">Total: QAR ${order.total.toFixed(2)}</p>
      </div>
      <p style="color: #888; font-size: 12px; margin-top: 20px;">
        Happy Truffles Cafe | C.T Plaza DA, South, CTA<br />
        Tel: +974 1234 5678
      </p>
    </div>
  `;

  return sendEmail({
    to: order.customer.email,
    subject: `Order Confirmation - ${order.id}`,
    html,
    template: "order-confirmation",
    orderId: order.id,
    orderData: order,
  });
}

export async function sendOrderStatusUpdateEmail(order: any, status: string): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    pending: "Your order has been received and is pending.",
    preparing: "Your order is being prepared.",
    ready: "Your order is ready for pickup!",
    completed: "Your order has been completed.",
    cancelled: "Your order has been cancelled.",
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #5D4037;">Order Update</h2>
      <p>Your order <strong>${order.id}</strong> status has been updated.</p>
      <div style="background-color: #F5F5F5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 16px; font-weight: bold; color: #5D4037;">${statusMessages[status] || status}</p>
      </div>
      <p style="color: #888; font-size: 12px; margin-top: 20px;">
        Happy Truffles Cafe | C.T Plaza DA, South, CTA<br />
        Tel: +974 1234 5678
      </p>
    </div>
  `;

  return sendEmail({
    to: order.customer.email,
    subject: `Order Update - ${order.id}`,
    html,
    template: "order-status-update",
    orderId: order.id,
    orderData: order,
  });
}

export async function sendReservationConfirmationEmail(reservation: any): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #5D4037;">Reservation Confirmed!</h2>
      <p>Your table reservation has been confirmed.</p>
      <div style="background-color: #F5F5F5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${reservation.name}</p>
        <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${reservation.time}</p>
        <p><strong>Guests:</strong> ${reservation.guests}</p>
      </div>
      <p style="color: #888; font-size: 12px; margin-top: 20px;">
        Happy Truffles Cafe | C.T Plaza DA, South, CTA<br />
        Tel: +974 1234 5678
      </p>
    </div>
  `;

  return sendEmail({
    to: reservation.email || reservation.phone,
    subject: `Reservation Confirmed - ${reservation.name}`,
    html,
    template: "reservation-confirmation",
    orderData: reservation,
  });
}
