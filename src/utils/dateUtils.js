export function formatDate(date) {
  if (!date) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(undefined, options);
}
