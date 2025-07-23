"use client";

import Image from "next/image";
import logo from "@/assets/trelloIcon.svg";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "../../../store/BoardStore";
function Header() {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);
  return (
    <header>
      <div className="flex flex-col md:flex-row items-center justify-between py-2 px-5 bg-gray-500/10 rounded-b-2xl">
        <div className="absolute w-full top-0 left-0 h-96 bg-gradient-to-r from-[#12C2E9] to-[#F64F59] filter blur-3xl -z-50 opacity-50" />
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setSearchString("")}
        >
          <Image src={logo} alt="trello logo" className="w-6 object-contain" />
          <h4 className="font-bold text-2xl ms-2 text-slate-700">Trello</h4>
        </div>
        <div className="flex items-center mt-3 md:m-0 w-full flex-1 justify-end">
          {/* search box */}
          <form className="flex item-center space-x-3 bg-white items-center p-1 shadow-md flex-1 md:flex-initial rounded-md">
            <MagnifyingGlassIcon className="h-5 w-6 text-gray-400 " />
            <input
              type="text"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              placeholder="Search"
              className="flex-1 outline-none p-1 text-slate-700 md:w-64 "
            />

            <button type="submit" hidden>
              Search
            </button>
          </form>
          <div
            className="p-2 w-10 h-10 inline-flex justify-center font-semibold ms-3 text-white rounded-full bg-[#0055D1] 
        "
          >
            AP
          </div>
        </div>
      </div>
      <div className=" p-4 flex m-2 md:mx-5 mx-2 rounded-lg justify-center items-center  bg-white/55">
        <h2 className=" font-bold text-2xl text-gray-800 ">
          Project Management
        </h2>
        <span className="ms-6 bg-white text-gray-800 px-2 py-1 rounded-lg text-sm font-semibold">
          Template
        </span>
      </div>
    </header>
  );
}

export default Header;
