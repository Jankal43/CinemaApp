"use client"
import {useEffect, useState} from "react";
import Header from "./header";
import Footer from "./footer";
import MovieLabel from "./movieLabel"

export default function Home() {

    const [moviesResults, setMoviesResults] = useState("")


    useEffect(() => {
        async function getData() {
            try {
                const url = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc"
                const request = new Request(url, {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                    }
                })
                const response = await fetch(request)


                if (response.status === 200) {
                    const data = await response.json()

                    const movies = data.results.map(movie =>({
                        id: movie.id,
                        title: movie.title,
                        poster: movie.poster_path
                    }));
                    // console.log(movies);
                    setMoviesResults(movies);
                    console.log(movies)
                } else {
                    console.log("API error")
                }
            } catch (error) {
                console.error(`Error ${error}`)
            }
        }
        getData();
    }, []);

    return (
        <div className="">
            <Header/>
            <div>Hello world</div>
            <div>
                {moviesResults.length > 0 ? (
                    moviesResults.map((movie)=>(
                        <MovieLabel key={movie.id} movieTitle={movie.title} moviePoster={movie.poster}
                        />))
                ) : (
                    <p>Error</p>
                )}
            </div>
            <Footer/>

        </div>
    );
}
