import Image from "next/image";
import {MovieApiResponse} from "@/app/types";

interface MovieCard {
    movie: MovieApiResponse;
}


export default function MovieCard({movie}: MovieCard) {


    return (
        <div className="w-1/3 h-dvh flex flex-col align-middle justify-center bg-gradient-to-r bg-clip-text" >
            <div className=" m-5 ">
                <Image
                    className="object-cover pt-4 relative"
                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    alt={`${movie.title} Poster`}
                    width={600}
                    height={800}

                />
                <div className="text-white text-center p-5 border-t-2">
                    <h2 className="font-bold text-2xl">{movie.title}</h2>
                    <p>Genre: </p>
                    <div>
                        {Object.values(movie.genres).map((genre, index) => (
                            <span key={index} className="inline-block px-2 py-1 text-sm bg-gray-700 rounded-md m-1">
                                {genre.name}
                            </span>
                        ))}
                    </div>
                    <div>
                        <p>Spoken Languages: </p>
                        {Object.values(movie.spoken_languages).map((lang, index) => (
                            <span key={index} className="inline-block px-2 py-1 text-sm bg-gray-700 rounded-md m-1">
                                 {lang.english_name}
                             </span>))}
                    </div>
                </div>

            </div>
        </div>
    );
}