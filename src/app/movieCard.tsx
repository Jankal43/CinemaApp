import Image from "next/image";
import {MovieApiResponse} from "@/app/types";

interface MovieCard {
    movie: MovieApiResponse;
}




export default function MovieCard({movie}: MovieCard) {

    console.log("Genre id", movie.genre_ids)

    return (
        <div className="w-1/3 h-dvh flex flex-col align-middle justify-center">
            <div className= "border-2 m-5">
                <Image
                    className="object-cover p-4 relative"
                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    alt={`${movie.title} Poster`}
                    width={600}
                    height={800}

                />
                <div className="text-white text-center p-5 bg-gray-900 border-t-2 ">
                    <h2 className="font-bold text-2xl">{movie.title}</h2>
                    {/*<p className="">Produced by: {movie.genre}</p>*/}
                    <p className="">Di {movie.overview}</p>
                </div>
            </div>
        </div>
    );
}