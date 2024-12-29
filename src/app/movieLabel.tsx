import Image from 'next/image';
import Link from "next/link";

interface MovieLabelProps {
    movieTitle: string;
    moviePoster: string;
    className?: string;
    movieId: number;
}

export default function MovieLabel({ movieTitle, moviePoster, className,movieId }: MovieLabelProps) {
    return (
        <Link href={`/movies/${movieId}`} >
        <div className={`flex flex-col w-40 h-auto flex-shrink-0 rounded-lg bg-gray-800 shadow-lg ${className}`}>
            <div className="h-[85%] relative">
                <Image
                    className="w-full h-full object-cover rounded-t-lg"
                    src={moviePoster}
                    alt={`${movieTitle} Poster`}
                    width={160}
                    height={240}
                    priority
                />

            </div>
            <div>
                <h3 className="text-center m-1 text-lg font-semibold truncate">{movieTitle}</h3>
            </div>
        </div>
        </Link>
    );
}

