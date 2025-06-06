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
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useCart } from "@/app/context/CartContext";
import { useProfile } from "@/app/context/ProfileContext";

const Navbar = () => {
  const router = useRouter();
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
        credentials: "include",
      });
      if (res.ok) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="bg-heart text-white w-full ease-in duration-300 fixed top-0 left-0 z-10">
      <nav className="max-w-[1366px] mx-auto h-[60px] flex justify-between items-center p-4">
        <div>
          <Link href={"/"}>
            <span className="font-extrabold text-2xl md:text-2xl xl:text-2xl uppercase">
              Gift Shops
            </span>
          </Link>
        </div>
        {/*  */}
        <ul className="hidden md:flex font-semibold text-1xl lg:text-[20px] text-slate-800">
          <li className="mr-4 lg:mr-8 text-white hover:text-red-200">
            <Link href={"/"}>Gifts</Link>
          </li>
          <li className="mr-4 lg:mr-8 text-white hover:text-red-200">
            <Link href={"/"}>Home Decor</Link>
          </li>
        </ul>
        {/*  */}
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
              <button className="mr-5 relative">
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
        {/*  */}
        <div className="flex md:hidden" onClick={handleToggleMenu}>
          {!menuIcon ? (
            <FontAwesomeIcon icon={faBars} />
          ) : (
            <FontAwesomeIcon icon={faXmark} />
          )}
        </div>
        {/* small screen - Navbar */}
        <div
          className={
            menuIcon
              ? "md:hidden absolute top-[100px] right-0 bottom-0 left-0 flex justify-center items-center w-full h-screen bg-heart text-white ease-in duration-300"
              : "md:hidden absolute top-[100px] right-0 bottom-0 left-[-100%] flex justify-center items-center w-full h-screen bg-heart text-white ease-in duration-300"
          }
        >
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
      </nav>
    </header>
  );
};

export default Navbar;
