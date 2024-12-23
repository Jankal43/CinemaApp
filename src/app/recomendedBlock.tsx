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
