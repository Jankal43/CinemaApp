import Image from 'next/image';
import {BsPersonFill} from "react-icons/bs";
import {FaSearch} from "react-icons/fa";
import Link from 'next/link'

export default function Header() {
    return (
        <div className="bg-black border-b-2 w-full sticky top-0 flex flex-row-reverse h-12 z-50">

            <div className="flex items-center justify-between  p-4 pr-12">
                <FaSearch className="text-xl"/>
            </div>
            <div className="flex items-center justify-between p-4 hover:underline">
                Register
            </div>
            {/*<div className="border-r-2 border-gray-200">*/}

            {/*</div>*/}
            <div className="flex items-center justify-between p-4 hover:underline">
                <div>
                    Login
                </div>
                <BsPersonFill className="text-xl ml-3"></BsPersonFill>
            </div>

            <Link className="flex items-center grow  p-4 pl-12" href="/">

                <Image
                    src="/logo.png"
                    alt="Icon"
                    width={50}
                    height={50}
                />
                <p className="font-semibold ">CINEMA PLANET</p>

            </Link>


        </div>
    )
        ;
}
