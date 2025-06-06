"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/app/lib/api";

interface Profile {
  data: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profilePic: string;
    role: string;
    isVerified: boolean;
    addresses: string[];
    createdAt: string;
    updatedAt: string;
    cart: {
      items: Array<{
        product: {
          _id: string;
          title: string;
          price: number;
          stock: number;
          images: string[];
        };
        quantity: number;
        price: number;
        _id: string;
        addedAt: string;
      }>;
      totalItems: number;
      totalAmount: number;
    };
  };
  status: number;
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await api("/users/profile", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setError(null);
      } else {
        setError("Failed to fetch profile");
        setProfile(null);
      }
    } catch (err: unknown) {
      err = err as { message?: string }; // narrow the type
      console.log(err);
      setError("Error fetching profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refetchProfile = async () => {
    setLoading(true);
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
