"use client";

export type NotificationPermission = "granted" | "denied" | "default";

export function requestNotificationPermission(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  if (Notification.permission === "granted") {
    return "granted";
  }
  return Notification.permission;
}

export async function requestNotificationPermissionAsync(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  const permission = await Notification.requestPermission();
  return permission;
}

export function sendNotification(title: string, body: string, icon?: string) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }
  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        icon: icon || "/favicon.ico",
        badge: icon || "/favicon.ico",
      });
    } catch (e) {
      console.error("Failed to send notification", e);
    }
  }
}
