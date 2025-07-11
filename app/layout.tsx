import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import { CartProvider } from "./context/CartContext";
import { ProfileProvider } from "./context/ProfileContext";
import AuthCheck from "@/components/AuthCheck";

export const metadata: Metadata = {
  title: "Gift Shops",
  description: "Find the best gift shops nearby",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProfileProvider>
          <CartProvider>
            <Navbar />
            {children}
            <AuthCheck />
          </CartProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
