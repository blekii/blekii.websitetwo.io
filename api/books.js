export async function handler() {
    try {
      const subjects = ["fiction", "fantasy", "romance", "adventure"];
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${randomSubject}&maxResults=20&key=${process.env.GOOGLE_API_KEY}`
      );
      const data = await res.json();
      return { statusCode: 200, body: JSON.stringify(data) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: "Google Books fetch failed" }) };
    }
  }
  