// page.tsx
"use client"
import { useEffect, useState } from "react";
import Header from "./header";
import Footer from "./footer";
import MovieLabel from "./movieLabel";
import Carousel from "./carousel";
import { Movie } from "./types";

export default function Home() {
    const [moviesResults, setMoviesResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/movies");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const posterPath = "https://image.tmdb.org/t/p/original/";

                const movies = data.results.map((movie: MovieApiResponse['results'][0]) => ({
                    id: movie.id,
                    title: movie.title,
                    poster: `${posterPath}${movie.poster_path}`,
                    backDropPoster: `${posterPath}${movie.backdrop_path}`
                }));

                setMoviesResults(movies);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error("Error fetching movies:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {moviesResults.length > 0 ? (
                    <>
                        <Carousel movies={moviesResults} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                            {moviesResults.map((movie) => (
                                <MovieLabel
                                    key={movie.id}
                                    movieTitle={movie.title}
                                    moviePoster={movie.poster}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-center py-4">No movies found</p>
                )}
            </main>
            <Footer />
        </div>
    );
}