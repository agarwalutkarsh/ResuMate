import { BASE_URL } from "./config";

/**
 * Sends a question to the FastAPI backend and returns the assistant's answer.
 *
 * Contract:
 *   POST {BASE_URL}/chat   body: { "question": "..." }
 *   200  ->  { "answer": "..." }
 *
 * @param {string} question
 * @param {AbortSignal} [signal]
 * @returns {Promise<string>} the answer text
 */
export async function askQuestion(question, signal) {
  let res;

  try {
    res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question }),
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new Error(
      "Could not reach the server. Please check your connection and try again."
    );
  }

  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body?.detail || body?.error || "";
    } catch {
      /* body was not JSON — ignore */
    }
    throw new Error(
      detail || `The server returned an error (${res.status}). Please try again.`
    );
  }

  const data = await res.json();
  const answer = data?.reply;

  if (typeof answer !== "string" || !answer.trim()) {
    throw new Error("The server sent back an empty answer. Please try again.");
  }

  return answer.trim();
}

export const reset = async () => {
  try {
    const response = await fetch(`${BASE_URL}/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Reset request failed.");
    }

    window.location.reload();
    return true;
  } catch (e) {
    console.error("Reset failed:", e);
    return false;
  }
};
