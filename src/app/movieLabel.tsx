export default function movieLabel(props) {
    const posterPath = "https://image.tmdb.org/t/p/original/"

    //console.log("PROPS",props)
    const movieTitle = props.movieTitle;
    const poster = props.moviePoster;

    const posterLink= posterPath + poster;
    // console.log(poster)
    return (
        <div className="movieLabel">
            <div>
                Title: {movieTitle}
            </div>
            <div>
                Poster: {posterLink}
            </div>
            <img className="w-80 h-80" src={posterLink} alt="Poster" />
        </div>
    )
}