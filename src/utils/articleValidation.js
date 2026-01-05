
export function isValidArticle(data) {

  if (!data) return false;

  if (typeof data.id !== "number") return false;
  if (typeof data.publisher_id !== "number") return false;
  if (!data.title || typeof data.title !== "string" || data.title.trim() === "") return false;
  if (!data.content || typeof data.content !== "string") return false;

  return true;
}