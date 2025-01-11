// @/app/types.ts
export interface MovieApiResponse {
    adult: boolean;
    backdrop_path: string;
    genres: { name: string }[]; // Array of objects with a `name` property
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    spoken_languages: { english_name: string }[];
    runtime: number

    // Array of objects with an `english_name` property
}


