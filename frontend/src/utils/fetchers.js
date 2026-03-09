export async function fetchSubjects(token) {
  try {
    const result = await fetch(import.meta.env.VITE_API_URL + "/subjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await result.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}