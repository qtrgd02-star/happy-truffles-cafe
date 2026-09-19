"use client";

import { useEffect } from "react";
import { messaging } from "@/app/lib/firebase/config";
import { getToken, onMessage } from "firebase/messaging";
import { useToast } from "@/app/toast-context";

export function FirebaseMessaging() {
  const { showToast } = useToast();

  useEffect(() => {
    if (!messaging) return;

    const fcm = messaging;

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(fcm, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          console.log("FCM Token:", token);
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    };

    requestPermission();

    const unsubscribe = onMessage(fcm, (payload) => {
      console.log("Received foreground message:", payload);
      if (payload.notification) {
        showToast(`${payload.notification.title}: ${payload.notification.body}`);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [showToast]);

  return null;
}
