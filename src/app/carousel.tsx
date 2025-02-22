"use client"
import {useState} from "react";
import {MovieApiResponse} from "./types";
import {LuCircle, LuCircleDot} from "react-icons/lu";
import Image from 'next/image';
import Link from 'next/link';
import ArrowButton from "@/app/arrowButton";

interface CarouselProps {
    movies: MovieApiResponse[];
}

export default function Carousel({movies}: CarouselProps) {
    const [movieIndexNumber, setMovieIndexNumber] = useState(0)

    if (!movies) {
        return <div>Loading...</div>;
    }

    function showNextImage() {
        setMovieIndexNumber((prev) => prev < movies.length - 1 ? prev + 1 : 0);
    }

    function showPrevImage() {
        setMovieIndexNumber((prev) => prev > 0 ? prev - 1 : movies.length - 1);
    }

    return (
        <div className="relative w-full px-4 md:px-24 lg:px-24">
            <div className="relative mx-auto w-full md:w-11/12 lg:w-4/5">
                <div className="overflow-hidden rounded-lg shadow-lg">
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{transform: `translateX(-${movieIndexNumber * 100}%)`}}
                    >
                        {movies.map((movie) => (
                            <div key={movie.id} className="relative w-full flex-shrink-0">
                                <Link href={`/movies/${movie.id}`}  >
                                <Image
                                    className="w-full h-auto object-cover"
                                    src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                                    alt={movie.title}
                                    width={1920}
                                    height={1080}
                                    priority={movieIndexNumber === movies.indexOf(movie)}
                                />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative border-t-2 min-h-[4rem] mt-2">
                    <p className={`
                        absolute font-sans font-semibold w-full bottom-0 left-0 p-2  ml-3
                        text-white shadow-text-border truncate
                        text-lg sm:text-xl md:text-2xl lg:text-3xl
                        ${movies[movieIndexNumber].title.length > 20 ? "md:text-xl lg:text-2xl" : ""}
                    `}>
                        {movies[movieIndexNumber].title}
                    </p>

                    <div className="absolute right-1/2 translate-x-1/2 translate-y-3 flex flex-wrap justify-center">
                        {movies.map((movie) => (
                            <button
                                className="transition duration-500 hover:scale-125 m-1 text-sm md:text-base"
                                key={movie.id}
                                onClick={() => setMovieIndexNumber(movies.indexOf(movie))}
                                aria-label={`Go to slide ${movies.indexOf(movie) + 1}`}
                            >
                                {movieIndexNumber !== movies.indexOf(movie) ? <LuCircle/> : <LuCircleDot/>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hidden sm:block">
                    <ArrowButton
                        onClick={showPrevImage}
                        direction="left"
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 lg:-translate-x-12 w-8 h-8 flex items-center justify-center"
                    />
                    <ArrowButton
                        onClick={showNextImage}
                        direction="right"
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 lg:translate-x-12 w-8 h-8 flex items-center justify-center"
                    />
                </div>
            </div>
        </div>
    );
}