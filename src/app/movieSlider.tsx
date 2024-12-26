import {Movie} from "@/app/types";
import MovieLabel from "@/app/movieLabel";


interface SliderProps {
    movies: Movie[];
}

export default function MovieSlider({movies}: SliderProps) {

    const NumberOfMovies:Number = 5;
    const currentIndex:Number = 0;
    const lastIndex:Number = currentIndex+NumberOfMovies;

    return (
        <div className="w-full overflow-hidden">
            <div className="flex">
                {movies.slice(currentIndex, lastIndex).map((movie) => (
                    <MovieLabel
                        key={movie.id}
                        movieTitle={movie.title}
                        moviePoster={movie.poster}
                    />
                ))}
            </div>
        </div>
    );
}
