export default function MovieLabel({ movieTitle, moviePoster }) {
    return (
        <div className="movie-label">
            <h3>{movieTitle}</h3>
            <img className="poster w-80 h-80" src={moviePoster} alt={`${movieTitle} Poster`} />
        </div>
    );
}
