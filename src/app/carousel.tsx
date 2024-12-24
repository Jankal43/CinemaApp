export default function Carousel({ movies }) {
    if (!movies) {
        return <div>Loading...</div>; // Możesz pokazać spinner lub inną informację
    }

    const firstMoviePoster = movies[0]?.backDropPoster;

    return (
        // Container with relative positioning and full width
        <div className="relative w-full">
            <div className="relative mx-auto w-2/3">
                <img
                    className="w-full h-auto"
                    src={firstMoviePoster}
                    alt="Movie Poster"
                />

                {/* Left arrow positioned relative to the image container */}
                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-8 h-8 flex items-center justify-center"
                    aria-label="Previous slide"
                >
                    <div className="arrow left border-white hover:border-gray-300 transition-colors"></div>
                </button>

                {/* Right arrow positioned relative to the image container */}
                <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-8 h-8 flex items-center justify-center"
                    aria-label="Next slide"
                >
                    <div className="arrow right border-white hover:border-gray-300 transition-colors"></div>
                </button>
            </div>
        </div>
    );
};
