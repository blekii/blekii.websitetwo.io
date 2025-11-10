export async function handler() {
    try {
      const res = await fetch("https://www.freetogame.com/api/games");
      const data = await res.json();
      return { statusCode: 200, body: JSON.stringify(data) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: "Games fetch failed" }) };
    }
  }
  