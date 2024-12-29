// app/api/moviesAPI/route.ts
import {MovieApiResponse} from '../../types';
import {NextResponse} from 'next/server';


export async function GET(request: Request) {

    const {searchParams} = new URL(request.url);
    const category = searchParams.get('category');


    const endpoints: { [key: string]: string } = {
        upcoming: 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1',
        trending: 'https://api.themoviedb.org/3/trending/movie/day?language=en-US',
        airing: 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'
    };

    const url = endpoints[category as keyof typeof endpoints] || endpoints.upcoming;
    console.log(url);
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
        console.error('Error fetching moviesAPI:', error);
        return NextResponse.json(
            {error: 'Failed to fetch moviesAPI'},
            {status: 500}
        );
    }
}