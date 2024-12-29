// page.tsx
"use client"
import { useEffect, useState } from "react";
import Carousel from "./carousel";
import { MovieApiResponse } from "./types";
import MovieSlider from "@/app/movieSlider";

interface MovieCategories {
    upcoming: MovieApiResponse[];
    trending: MovieApiResponse[];
    airing: MovieApiResponse[];
}

export default function Home() {
    const [moviesByCategory, setMoviesByCategory] = useState<MovieCategories>({
        upcoming: [],
        trending: [],
        airing: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                //const response = await fetch("/api/moviesAPI");
                const responses = await Promise.all([
                    fetch("/api/moviesAPI?category=upcoming"),
                    fetch("/api/moviesAPI?category=airing"),
                    fetch("/api/moviesAPI?category=upcomingtrending")
                ]);

                responses.forEach((response) =>{
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                })

                const data = await Promise.all(responses.map((response) =>{
                    return response.json()
                }));

                const categories = ['upcoming', 'airing', 'trending'];

                categories.forEach((category, index)=>{

                    setMoviesByCategory(prevState => ({
                        ...prevState,
                        [category]: data[index].results
                    }));
                })
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error("Error fetching moviesAPI:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
            console.log("Movies",moviesByCategory.airing);
    }, [moviesByCategory]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">

            <main className="flex-grow">
                {moviesByCategory.trending.length > 0 ? (
                    <>
                        <Carousel movies={moviesByCategory.trending.slice(0,5)}/>
                        <h1 className="text-2xl font-semibold m-12 ml-52 mb-4">AIRING</h1>
                        <MovieSlider movies={moviesByCategory.airing}/>
                        <h1 className="text-2xl font-semibold m-12 ml-52 mb-4">UPCOMING</h1>
                        <MovieSlider movies={moviesByCategory.upcoming}/>
                    </>
                ) : (
                    <p className="text-center py-4">No movies found</p>
                )}
            </main>
        </div>
    );
}