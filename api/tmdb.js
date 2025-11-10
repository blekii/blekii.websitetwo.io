export async function handler() {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US`
      );
      const data = await res.json();
      return { statusCode: 200, body: JSON.stringify(data) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: "TMDB fetch failed" }) };
    }
  }
  