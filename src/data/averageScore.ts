import { getCollection } from "astro:content";

export async function getAverageScore() {
  const thoughts = await getCollection("thoughts");
  const total = thoughts.reduce((sum, t) => sum + (t.data.score || 0), 0);
  return thoughts.length ? total / thoughts.length : 0;
}