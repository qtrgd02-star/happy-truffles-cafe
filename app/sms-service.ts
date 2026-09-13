"use client";

export type SmsTemplate = "order-confirmation" | "order-status-update" | "reservation-confirmation" | "promo-code" | "verification";

export interface SmsPayload {
  to: string;
  message: string;
  template?: SmsTemplate;
  orderId?: string;
}

export async function sendSms(payload: SmsPayload): Promise<boolean> {
  try {
    const response = await fetch("/api/notifications/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to send SMS:", error);
    return false;
  }
}

export async function sendOrderConfirmationSms(order: any): Promise<boolean> {
  const message = `Hi ${order.customer.name}, your order ${order.id} at Happy Truffles Cafe has been confirmed. Total: QAR ${order.total.toFixed(2)}. Thank you!`;
  return sendSms({
    to: order.customer.phone,
    message,
    template: "order-confirmation",
    orderId: order.id,
  });
}

export async function sendOrderStatusUpdateSms(order: any, status: string): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    pending: "Your order has been received.",
    preparing: "Your order is being prepared.",
    ready: "Your order is ready for pickup!",
    completed: "Your order has been completed.",
    cancelled: "Your order has been cancelled.",
  };

  const message = `Hi ${order.customer.name}, your order ${order.id} update: ${statusMessages[status] || status}. - Happy Truffles Cafe`;
  return sendSms({
    to: order.customer.phone,
    message,
    template: "order-status-update",
    orderId: order.id,
  });
}

export async function sendReservationConfirmationSms(reservation: any): Promise<boolean> {
  const message = `Hi ${reservation.name}, your reservation at Happy Truffles Cafe for ${new Date(reservation.date).toLocaleDateString()} at ${reservation.time} for ${reservation.guests} guests has been confirmed. See you soon!`;
  return sendSms({
    to: reservation.phone,
    message,
    template: "reservation-confirmation",
  });
}
