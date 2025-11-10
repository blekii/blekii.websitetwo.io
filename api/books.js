// api/books.js
export default async function handler(req, res) {
  try {
    const subjects = ["fiction", "fantasy", "romance", "adventure"];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${randomSubject}&maxResults=20&key=${process.env.GOOGLE_API_KEY}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Books fetch failed", details: error.message });
  }
}
