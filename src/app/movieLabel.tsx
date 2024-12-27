interface MovieLabelProps {
    movieTitle: string;
    moviePoster: string;
    className?: string;
}

export default function MovieLabel({movieTitle, moviePoster, className}: MovieLabelProps) {
    return (
        <div className={`flex flex-col w-40 h-auto flex-shrink-0 rounded-lg bg-gray-800 shadow-lg ${className}`}>
            <div className="h-[85%]">
                <img className="w-full h-full object-cover" src={moviePoster} alt={`${movieTitle} Poster`}/>
            </div>
            <div>
                <h3 className="text-center m-1 text-lg font-semibold truncate">{movieTitle}</h3>
            </div>
        </div>
    );
}
