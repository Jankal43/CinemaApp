"use client"
import {useState} from "react";
import {Movie} from "./types";
import {LuCircle, LuCircleDot} from "react-icons/lu";
import Image from 'next/image';

interface CarouselProps {
    movies: Movie[];
}

export default function Carousel({movies}: CarouselProps) {

    const [movieIndexNumber, setMovieIndexNumber] = useState(0)

    if (!movies) {
        return <div>Loading...</div>;
    }

    function showNextImage() {
        if (movieIndexNumber < movies.length - 1) {
            setMovieIndexNumber(movieIndexNumber + 1)
        } else {
            setMovieIndexNumber(0)
        }

    }

    function showPrevImage() {
        if (movieIndexNumber > 0) {
            setMovieIndexNumber(movieIndexNumber - 1)
        } else (
            setMovieIndexNumber(movies.length - 1)
        )
    }

    return (
        <div className="relative w-full">
            <div className="relative mx-auto w-2/3">
                <div className="overflow-hidden">
                    <div className="flex transition-transform duration-700"
                         style={{transform: `translateX(-${movieIndexNumber * 100}%)`}}>


                        {movies.map((movie: Movie) => (
                            <Image
                                key={movie.id}
                                className="w-full h-auto"
                                src={movie.backDropPoster}
                                alt="Movie Poster"
                                width={1920}
                                height={1080}
                                priority={movieIndexNumber === movies.indexOf(movie)} // Opcjonalnie: ładowanie priorytetowe
                            />
                        ))}

                    </div>
                </div>

                <p className="absolute font-sans hover:bg-opacity-80 hover:scale-110 transition-transform rounded-md duration-700  bottom-0 bg-gray-800 bg-opacity-70 text-3xl left-1/2 border-2 p-2 px-8 text-white shadow-text-border -translate-x-1/2 -translate-y-10">{movies[movieIndexNumber].title}</p>
                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-8 h-8 flex items-center justify-center"
                    aria-label="Previous slide"
                    onClick={() => showPrevImage()}
                >
                    <div className="arrow left border-white hover:border-gray-300 transition-colors"></div>
                </button>

                <div className="absolute right-1/2 translate-x-1/2 -translate-y-6">

                    {movies.map((movie: Movie) => (
                        <button className="transition duration-500 hover:scale-125 m-1"
                                key={movie.id}
                                onClick={() => setMovieIndexNumber(movies.indexOf(movie))}
                        >
                            {movieIndexNumber !== movies.indexOf(movie) ? <LuCircle/> : <LuCircleDot/>}
                        </button>
                    ))}
                </div>


                <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-8 h-8 flex items-center justify-center"
                    aria-label="Next slide"
                    onClick={() => showNextImage()}
                >
                    <div className="arrow right border-white hover:border-gray-300 transition-colors"></div>
                </button>
            </div>
        </div>
    );
};
