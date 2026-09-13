const BASE_URL = "http://localhost:3000";

export async function fetchRoutines() {
  try {
    const res = await fetch(BASE_URL);

    return res.json();
  } catch (err) {
    console.error(err);

    return null;
  }
}
