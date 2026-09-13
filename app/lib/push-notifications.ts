export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function subscribeToPush(subscription: PushSubscription, userId: string) {
  try {
    localStorage.setItem("pushSubscription_" + userId, JSON.stringify(subscription));
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function unsubscribeFromPush(userId: string) {
  try {
    localStorage.removeItem("pushSubscription_" + userId);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function sendPushNotification(userId: string, title: string, body: string, data?: any) {
  try {
    const subscriptionJson = localStorage.getItem("pushSubscription_" + userId);
    if (!subscriptionJson) return { success: false };

    const subscription = JSON.parse(subscriptionJson);

    await fetch("/api/notifications/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription,
        title,
        body,
        data,
      }),
    });

    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if ("Notification" in window) {
    return Notification.requestPermission();
  }
  return Promise.resolve("denied");
}

export function showBrowserNotification(title: string, body: string) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    });
  }
}
