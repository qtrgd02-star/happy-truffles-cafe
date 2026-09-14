"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

import type { LucideIcon } from "lucide-react";

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  fiber: number;
  servingSize: string;
}

export interface AllergenInfo {
  contains: string[];
  mayContain: string[];
}

export interface MenuItemWithExtras {
  id: number;
  category: string;
  title: string;
  description: string;
  price: number;
  highlight: boolean;
  icon: LucideIcon;
  image: string;
  sizes?: { name: string; price: number }[];
  nutrition?: NutritionInfo;
  allergens?: AllergenInfo;
  customizations?: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: "select" | "multi-select" | "checkbox";
  options: { label: string; price: number }[];
  required: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "weekly" | "monthly";
  items: { itemId: number; quantity: number }[];
  features: string[];
}

export interface CorporateAccount {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  taxNumber?: string;
  creditLimit: number;
  balance: number;
}

export interface BirthdayReward {
  phone: string;
  name: string;
  birthday: string;
  rewardClaimed: boolean;
  lastClaimed?: string;
}

export interface PhotoReview {
  id: string;
  url: string;
  caption?: string;
}

export interface WhatsAppMessage {
  from: string;
  text: string;
  timestamp: string;
  type: "incoming" | "outgoing";
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export interface SyncResult {
  success: boolean;
  imported: number;
  errors: string[];
}