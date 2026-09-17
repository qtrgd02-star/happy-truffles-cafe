"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useUser } from "@/app/user-context";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  favoriteItems: number[];
  orderHistory: string[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  isDefault: boolean;
}

interface CustomerContextType {
  profile: CustomerProfile | null;
  isProfileLoaded: boolean;
  createProfile: (profile: Omit<CustomerProfile, "id" | "createdAt">) => void;
  updateProfile: (updates: Partial<CustomerProfile>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (addressId: string) => void;
  addFavoriteItem: (itemId: number) => void;
  removeFavoriteItem: (itemId: number) => void;
  isFavorite: (itemId: number) => boolean;
  loadProfile: (phone: string) => CustomerProfile | null;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const { getUserKey } = useUser();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  const profileKey = getUserKey("customerProfile");

  useEffect(() => {
    const saved = localStorage.getItem(profileKey);
    if (saved) {
      setProfile(JSON.parse(saved));
    }
    setIsProfileLoaded(true);
  }, [profileKey]);

  const saveProfile = (newProfile: CustomerProfile | null) => {
    if (newProfile) {
      localStorage.setItem(profileKey, JSON.stringify(newProfile));
    } else {
      localStorage.removeItem(profileKey);
    }
    setProfile(newProfile);
  };

  const createProfile = (profileData: Omit<CustomerProfile, "id" | "createdAt">) => {
    const newProfile: CustomerProfile = {
      ...profileData,
      id: "cust-" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    saveProfile(newProfile);
  };

  const updateProfile = (updates: Partial<CustomerProfile>) => {
    if (!profile) return;
    saveProfile({ ...profile, ...updates });
  };

  const addAddress = (address: Omit<Address, "id">) => {
    if (!profile) return;
    const newAddress = { ...address, id: "addr-" + Date.now() };
    saveProfile({
      ...profile,
      addresses: [...profile.addresses, newAddress],
    });
  };

  const removeAddress = (addressId: string) => {
    if (!profile) return;
    saveProfile({
      ...profile,
      addresses: profile.addresses.filter((a) => a.id !== addressId),
    });
  };

  const addFavoriteItem = (itemId: number) => {
    if (!profile) return;
    if (!profile.favoriteItems.includes(itemId)) {
      saveProfile({
        ...profile,
        favoriteItems: [...profile.favoriteItems, itemId],
      });
    }
  };

  const removeFavoriteItem = (itemId: number) => {
    if (!profile) return;
    saveProfile({
      ...profile,
      favoriteItems: profile.favoriteItems.filter((id) => id !== itemId),
    });
  };

  const isFavorite = (itemId: number) => {
    return profile?.favoriteItems.includes(itemId) || false;
  };

  const loadProfile = useCallback((phone: string) => {
    const saved = localStorage.getItem(profileKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.phone === phone) {
        setProfile(parsed);
        return parsed;
      }
    }
    return null;
  }, [profileKey]);

  return (
    <CustomerContext.Provider
      value={{
        profile,
        isProfileLoaded,
        createProfile,
        updateProfile,
        addAddress,
        removeAddress,
        addFavoriteItem,
        removeFavoriteItem,
        isFavorite,
        loadProfile,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within CustomerProvider");
  }
  return context;
}
