'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';

interface Movie {
    title: string;
    description: string;
}

interface PageParams {
    params: Promise<{
        movieId: number;
    }>;
}

export default function MovieDetailsPage({ params }: PageParams) {
    // Type assertion for unwrapped params
    const unwrappedParams = use(params) as { movieId: number };
    const movieId = unwrappedParams.movieId;

    const [movie, setMovie] = useState<Movie | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchMovieDetails() {
            try {
                const response = await fetch(`/api/movieAPI?movieId=${movieId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch movie details: ${response.status}`);
                }

                const movieAPI: Movie = await response.json();
                setMovie(movieAPI);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchMovieDetails();
    }, [movieId]);

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
        <div>
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>
        </div>
    );
}