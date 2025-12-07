"use client";

import Image from 'next/image';
import Link from 'next/link'

export default function Header() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="bg-black border-b-2 w-full sticky top-0 flex flex-row-reverse px-12 h-12 z-50">
            <Link 
                href="/benchmark"
                className="flex items-center justify-between p-4 hover:underline cursor-pointer text-white"
            >
                Benchmark
            </Link>
            <Link 
                href="/performance"
                className="flex items-center justify-between p-4 hover:underline cursor-pointer text-white"
            >
                Performance
            </Link>
            <button 
                onClick={() => scrollToSection('contact')}
                className="flex items-center justify-between p-4 pr-12 hover:underline cursor-pointer text-white"
            >
                Contact
            </button>
            <button 
                onClick={() => scrollToSection('upcoming')}
                className="flex items-center justify-between p-4 hover:underline cursor-pointer text-white"
            >
                Upcoming
            </button>
            <button 
                onClick={() => scrollToSection('airing')}
                className="flex items-center justify-between p-4 hover:underline cursor-pointer text-white"
            >
                Airing
            </button>
            <button 
                onClick={() => scrollToSection('home')}
                className="flex items-center justify-between p-4 hover:underline cursor-pointer text-white"
            >
                Home
            </button>

            <Link className="flex items-center grow  p-4 pl-12" href="/">
                <Image
                    src="/logo.png"
                    alt="Icon"
                    width={50}
                    height={50}
                    priority
                />
                <p className="font-semibold ">CINEMA PLANET</p>
            </Link>
        </div>
    );
}
