import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { BiSearch } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";

export const TopNav: React.FC = () => {
    const pathname = usePathname();
    const [searchName, setSearchName] = useState("");
    const [searchProfiles, setSearchProfiles] = useState([]);

    const handleSearchName = (e: any) => {
        console.log(e.target.value);
    };

    return (
        <div id="TopNav" className="fixed bg-theme-dark z-30 flex items-center w-full h-[60px] overflow-hidden">
            <div className={`flex items-center justify-between gap-6 w-full px-4 mx-auto ${pathname === '/' ? 'max-w-[1150px]' : ''}`}>

                <Link href="/">
                    <img className="min-w-[60px] w-[60px]" src="/assets/logo.png" />
                </Link>

                <div className="relative flex items-center justify-end bg-theme-dark-100 p-1 rounded-full max-w-[430px] w-full">
                    <input
                        type="text"
                        onChange={handleSearchName}
                        className="w-full pl-3 my-2 bg-transparent placeholder-white/35 text-[15px] focus:outline-none text-white"
                        placeholder="Search events, venues..."
                    />

                    {searchProfiles.length > 0 ?
                        <div className="absolute bg-white max-w-[910px] h-auto w-full z-20 left-0 top-12 border p-1">
                            {searchProfiles.map((profile: any, index) => (
                                <div className="p-1" key={index}>
                                    <Link
                                        href={`/profile/${profile?.id}`}
                                        className="flex items-center justify-between w-full cursor-pointer hover:bg-[#F12B56] p-1 px-2 hover:text-white"
                                    >
                                        <div className="flex items-center">
                                            <img className="rounded-md" width="40" src={""} />
                                            <div className="truncate ml-2">{profile?.name}</div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        : null}

                    <div className="px-3 py-1 flex items-center border-l border-l-gray-300">
                        <BiSearch color="#A1A2A7" size="22" />
                    </div>
                </div>
                <div className="flex items-center gap-3 ">
                    <button
                        onClick={() => { }}
                        className="flex items-center border rounded-sm py-[6px] hover:bg-gray-100 pl-1.5"
                    >
                        <AiOutlinePlus color="#000000" size="22" />
                        <span className="px-2 font-medium text-[15px]">Upload</span>
                    </button>
                </div>
            </div>
        </div>
    );
};