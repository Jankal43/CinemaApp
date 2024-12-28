import {MovieApiResponse} from "@/app/types";
import MovieLabel from "@/app/movieLabel";
import ArrowButton from "@/app/arrowButton";
import {useState} from "react";

interface MovieSliderProps {
    movies: MovieApiResponse[];
}


export default function MovieSlider({movies}: MovieSliderProps) {
    const [movieIndexNumber, setMovieIndexNumber] = useState(1)


    function showNextImage() {
        if (movies.length > 0) {
            setMovieIndexNumber(movieIndexNumber + 1);
            const firstMovie = movies.shift();
            if (firstMovie) {
                movies.push(firstMovie);
            }
        }
    }

    function showPrevImage() {
        if (movies.length > 0) {
            setMovieIndexNumber(movieIndexNumber - 1);
            const lastMovie = movies.pop();
            if (lastMovie) {
                movies.unshift(lastMovie);
            }
        }
    }


    return (
        <div className="relative w-full">
            <div className="relative mx-auto w-full overflow-hidden">

                <div className="flex flex-row justify-start items-center gap-4 p-4">
                    {movies.map((movie: MovieApiResponse, index: number) => (
                        <MovieLabel
                            key={`${movie.id}-${index}`}
                            movieTitle={movie.title}
                            moviePoster={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                            className=""
                        />
                    ))}
                </div>

                <ArrowButton onClick={showNextImage}
                             className="z-50 flex items-center justify-center absolute -translate-x-12 border-gray-500 border-2 bg-gray-800 p-4 right-0 top-1/2 -translate-y-1/2"
                             direction={"right"}/>
                <ArrowButton onClick={showPrevImage}
                             className="z-50 flex items-center justify-center absolute translate-x-12 border-gray-500 border-2 bg-gray-800 p-4 left-0 top-1/2 -translate-y-1/2 "
                             direction={"left"}/>

            </div>
        </div>
    );
}
