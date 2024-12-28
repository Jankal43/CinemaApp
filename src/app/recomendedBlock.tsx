// export default async function Home() {
//     const apiUrl =
//         "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
//
//     let data = null;
//
//     try {
//         const res = await fetch(apiUrl, {
//             method: "GET",
//             headers: {
//                 Authorization: `Bearer ${process.env.API_KEY}`, // Upewnij się, że API_KEY to token typu Bearer.
//                 "Content-Type": "application/json",
//             },
//         });
//
//         if (!res.ok) {
//             throw new Error(`HTTP error! status: ${res.status}`);
//         }
//
//         data = await res.json();
//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
//
//     if (!data) {
//         return <div>Nie udało się pobrać danych.</div>;
//     }
//
//     return (
//         <div>
//             <h1>Dane pobrane z API</h1>
//             <pre>{JSON.stringify(data, null, 2)}</pre>
//         </div>
//     );
// }

//2
//
// import {useEffect} from "react";
// useEffect(() => {
//     const fetchMovies = async () => {
//         try {
//             setIsLoading(true);
//             const responses = await Promise.all([
//                 fetch("/api/movies?category=upcoming"),
//                 fetch("/api/movies?category=airing"),
//                 fetch("/api/movies?category=trending")
//             ]);
//             responses.forEach(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//             });
//             const data = await Promise.all(responses.map(r => r.json()));
//
//             const posterPath = "https://image.tmdb.org/t/p/original/";
//
//             const categories = ['upcoming', 'airing', 'trending'];
//             const processedData = categories.reduce((acc, category, index) => {
//                 const movies = data[index].results.map((movie: MovieApiResponse['results'][0]) => ({
//                     id: movie.id,
//                     title: movie.title,
//                     poster: `${posterPath}${movie.poster_path}`,
//                     backDropPoster: `${posterPath}${movie.backdrop_path}`
//                 }));
//                 return {
//                     ...acc,
//                     [category]: movies
//                 };
//             }, {} as MoviesByCategory);
//
//             setMoviesByCategory(processedData);
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'An error occurred');
//             console.error("Error fetching movies:", err);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     fetchMovies();
// }, []);

import {MovieApiResponse} from "@/app/types";
