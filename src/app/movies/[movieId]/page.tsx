'use client';

import {use, useEffect, useState} from 'react';
import {MovieApiResponse} from "@/app/types";
import MovieCard from "@/app/movieCard";

interface PageParams {
    params: Promise<{
        movieId: number;
    }>;
}

export default function MovieDetailsPage({params}: PageParams) {
    const unwrappedParams = use(params) as { movieId: number };
    const movieId = unwrappedParams.movieId;

    const [movie, setMovie] = useState<MovieApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchMovieDetails() {
            try {
                const response = await fetch(`/api/movieAPI?movieId=${movieId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch movie details: ${response.status}`);
                }

                const movieAPI: MovieApiResponse = await response.json();
                setMovie(movieAPI);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchMovieDetails();
    }, [movieId]);

    useEffect(() => {
        console.log(movie)
    }, [movie]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                <h1>Error loading movie details</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (!movie) {
        return <div>No movie data available</div>;
    }

    return (
        <div className="relative min-h-screen h-[70vh] w-full flex items-center justify-center">
            <MovieCard movie={movie}></MovieCard>
        </div>
    );

}