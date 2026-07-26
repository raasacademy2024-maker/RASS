/**
 * Display helpers for course cards.
 */

/**
 * Rating to show on a course card.
 *
 * When a course has real ratings we show the real average. New courses have
 * `rating.average === 0`, which used to render as "0.0" and read like a bad
 * course, so we fall back to a high placeholder instead.
 *
 * The placeholder is derived from the course id rather than Math.random() on
 * purpose: a truly random value would change on every render and every page
 * load, so the same course would flip between 4.9 and 5.0 while you looked at
 * it. Hashing the id gives each course its own stable value.
 */
export const displayRating = (course?: {
  _id?: string;
  rating?: { average?: number; count?: number };
}): string => {
  const actual = course?.rating?.average ?? 0;
  if (actual > 0) return actual.toFixed(1);

  const id = course?._id || '';
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  // Spread across 4.9 / 5.0 so every new course doesn't show an identical number
  return (hash % 2 === 0 ? 4.9 : 5.0).toFixed(1);
};

export default displayRating;
