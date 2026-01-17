export async function fetchInfrastructure() {
  const res = await fetch("http://localhost:4000/api/infrastructure");
  if (!res.ok) throw new Error("Failed to fetch infrastructure");
  return res.json();
}
