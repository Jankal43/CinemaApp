"use client"
import SeatMap from "@/app/seatMap";
import {useState} from "react";
import ThreeScene from "@/app/ThreeScene";
import Link from 'next/link'

interface CinemaLayoutProps {
    rating: number;
    title: string;
    runtime: number;
}

export default function CinemaLayout({rating, title, runtime}: CinemaLayoutProps) {

    const [currentScene, setCurrentScene] = useState(1)

    console.log(rating,title,runtime)
    return (
        <div className="w-full min-h-dvh flex flex-col items-center justify-center text-gray-100">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
                Cinema Layout
            </h2>
            <div className="">
                <button
                    onClick={() => setCurrentScene(1)}
                    className="group bg-gradient-to-r from-red-500 via-red-600 to-red-800 m-3 p-2 hover:font-semibold hover:text-white">Select
                    a seat

                </button>
                <button
                    onClick={() => setCurrentScene(0)}

                    className="group bg-gradient-to-r from-red-500 via-red-600 to-red-800 m-3 p-2 hover:font-semibold hover:text-white">View
                    preview
                </button>

                <Link href="/scene"
                      className="group bg-gradient-to-r from-red-500 via-red-600 to-red-800 m-3 p-2 hover:font-semibold hover:text-white">
                   View
                    preview
                </Link>
            </div>
            {currentScene ? <SeatMap /> : <ThreeScene/> }


        </div>)
}