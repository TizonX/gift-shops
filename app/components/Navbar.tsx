"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faUser,
  faMagnifyingGlass,
  faShoppingBag,
  faHamburger,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [menuIcon, setMenuIcon] = useState(false);
  const handleToggleMenu = () => {
    setMenuIcon(!menuIcon);
  };
  return (
    <header className="bg-heart text-white w-full ease-in duration-300 fixed top-0 left-0 z-10">
      <nav className="max-w-[1366px] mx-auto h-[100px] flex justify-between items-center p-4">
        <div>
          <Link href={"/"}>
            <span className="font-extrabold text-3xl md:text-2xl xl:text-3xl uppercase">
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
            <Link href={"/"}>
              <button className="mr-5">
                <FontAwesomeIcon icon={faUser} />
              </button>
            </Link>
            <Link href={"/"}>
              <button className="mr-5">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </Link>
            <Link href={"/"}>
              <button className="mr-5">
                <FontAwesomeIcon icon={faShoppingBag} />
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
          device
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
