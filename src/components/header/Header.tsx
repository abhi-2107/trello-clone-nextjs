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
      <div className="flex flex-col md:flex-row items-center justify-between p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="absolute w-full top-0 left-0 h-96 bg-gradient-to-r from-[#12C2E9] to-[#F64F59] filter blur-3xl -z-50 opacity-50" />
        <div className="flex items-center">
          <Image
            src={logo}
            alt="trello logo"
            width={300}
            height={100}
            className="w-9 object-contain"
          />
          <h4 className="font-bold text-4xl ms-2 text-slate-700">Trello</h4>
        </div>
        <div className="flex items-center mt-3 md:m-0">
          {/* search box */}
          <form className="flex item-center space-x-3 bg-white items-center p-2 shadow-md flex-1 md:flex-initial rounded-md">
            <MagnifyingGlassIcon className="h-5 w-6 text-gray-400 " />
            <input
              type="text" 
              value={searchString}
              onChange={(e)=> setSearchString(e.target.value)}
              placeholder="Search"
              className="flex-1 outline-none p-2 text-slate-700 md:w-64 "
            />

            <button type="submit" hidden>
              Search
            </button>
          </form>
          <div
            className="p-3 ms-3 text-white rounded-full bg-[#0055D1] 
        "
          >
            US
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center px-5 py-3 md:py-5  ">
        <p className="text-[#0055D1] bg-white font-light shadow-xl rounded-xl p-5 md:w-2/4 italic">
          <UserCircleIcon className="inline-block text-[#0055D1] w-9 mr-2" />
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque non
          cumque hic, iusto deleniti in quam, debitis modi, minus earum? Est,
          ducimus?
        </p>
      </div>
    </header>
  );
}

export default Header;