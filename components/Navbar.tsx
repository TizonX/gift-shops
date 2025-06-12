"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMagnifyingGlass,
  faShoppingBag,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/app/lib/api";
import { useCart } from "@/app/context/CartContext";
import { useProfile } from "@/app/context/ProfileContext";
import Cookies from "js-cookie";

const Navbar = () => {
  const { cartItems } = useCart();
  const { profile } = useProfile();
  const [menuIcon, setMenuIcon] = useState(false);

  const handleToggleMenu = () => {
    setMenuIcon(!menuIcon);
  };

  const handleLogout = async () => {
    try {
      const res = await api("/auth/logout", {
        method: "GET",
      });
      
      if (res.ok) {
        // Clear the token from both localStorage and cookies
        localStorage.removeItem('token');
        Cookies.remove('token');
        // Force a full page refresh to login page
        window.location.href = '/login';
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="fixed w-full bg-white z-50 top-0 shadow-sm">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          Gift Shops
        </Link>

        <div className="hidden md:flex">
          <div className="flex">
            <div className="relative inline-block group">
              <button className="mr-5 flex items-center">
                <FontAwesomeIcon icon={faUser} />
                {profile && profile.data && (
                  <span className="ml-2 text-sm hidden lg:inline">
                    {profile.data.name}
                  </span>
                )}
              </button>
              <div className="absolute right-0 hidden group-hover:block w-48 bg-white rounded-md shadow-lg z-50 border text-gray-700">
                <ul className="py-1 text-sm">
                  <li>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Manage Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <Link href={"/"}>
              <button className="mr-5">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </Link>
            <Link href={"/checkout"}>
              <button className="relative">
                <FontAwesomeIcon icon={faShoppingBag} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>

        <div className="md:hidden">
          <button onClick={handleToggleMenu}>
            {menuIcon ? (
              <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
            ) : (
              <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
            )}
          </button>
        </div>

        <div
          className={`${
            menuIcon ? "block" : "hidden"
          } md:hidden fixed inset-0 bg-gray-900 bg-opacity-25 backdrop-blur-sm`}
        >
          <div className="fixed top-[68px] right-0 w-[250px] bg-white h-full shadow-xl">
            <div className="w-full">
              <ul className="text-center">
                <li className="py-4">
                  <Link href="/" onClick={handleToggleMenu}>
                    Gifts
                  </Link>
                </li>
                <li className="py-4">
                  <Link href="/" onClick={handleToggleMenu}>
                    Home Decor
                  </Link>
                </li>
                <li className="py-4">
                  <Link href="/profile" onClick={handleToggleMenu}>
                    Profile
                  </Link>
                </li>
                <li className="py-4">
                  <Link href="/orders" onClick={handleToggleMenu}>
                    Orders
                  </Link>
                </li>
                <li className="py-4">
                  <Link href="/checkout" onClick={handleToggleMenu}>
                    Cart ({cartItems.length})
                  </Link>
                </li>
                <li className="py-4">
                  <button onClick={handleLogout} className="text-red-300">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
