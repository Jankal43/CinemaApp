// app/api/movies/route.ts
import { MovieApiResponse } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
    const url = "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1";
    const params = new URLSearchParams({
        include_adult: 'false',
        include_video: 'false',
        language: 'en-US',
        page: '1',
        sort_by: 'popularity.desc'
    });

    try {
        const response = await fetch(`${url}?${params}`, {
            headers: {
                Authorization: `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data: MovieApiResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching movies:', error);
        return NextResponse.json(
            { error: 'Failed to fetch movies' },
            { status: 500 }
        );
    }
}