import {MovieApiResponse} from "@/app/types";
import {NextResponse} from "next/server";

export async function GET(request:Request) {

    console.log(request);
    const {searchParams} = new URL(request.url);
    const movieId = searchParams.get('movieId');

    console.log(movieId);

    const url = `https://api.themoviedb.org/3/movie/${movieId}`
    const params = new URLSearchParams({
        include_adult: 'false',
        include_video: 'false',
        language: 'en-US',
    });
    console.log(url);
    try{
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
    }
    catch(error){
        console.error('Error fetching moviesAPI:', error);
        return NextResponse.json(
            {error: 'Failed to fetch moviesAPI'},
            {status: 500}
        );
    }


}
