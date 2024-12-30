import Image from "next/image";
import {MovieApiResponse} from "@/app/types";

interface MovieCard {
    movie: MovieApiResponse;
}


export default function MovieCard({movie}: MovieCard) {
    return (
        <div className="m-12 h-full">
            <div className="flex flex-col align-middle justify-center h-full w-1/4 bg-red-500">
                <Image
                    className="object-cover p-4 relative"
                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    alt={`${movie.title} Poster`}
                    width={600}
                    height={800}

                />
                <div className="text-black absolute w-1/4">
                    <h1 className="font-bold">{movie.title}</h1>
                    <p>{movie.overview}</p>
                </div>
            </div>
        </div>
    );
}