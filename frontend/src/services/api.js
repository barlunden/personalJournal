// src/services/api.js

export async function addEntry(entry) {
  const response = await fetch("/api/add-entry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "Noko gjekk galt");
  }
  return response.json();
}

export async function getEntries() {
  const response = await fetch("/api/get-entries");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "Noko gjekk galt");
  }
  return response.json();
}