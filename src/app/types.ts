export interface Movie {
    id: string;
    title: string;
    poster: string;
    backDropPoster: string
}

export interface MovieApiResponse {
    results: {
        id: number;
        title: string;
        poster_path: string;
        backdrop_path: string;
    }[];
}