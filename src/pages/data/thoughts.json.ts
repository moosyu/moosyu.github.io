import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
    const thoughts = await getCollection("thoughts");
    const filteredThoughts = thoughts.filter(thought => thought.body?.trim());
    const data = filteredThoughts.map(thought => ({
        title: thought.data.title,
        type: thought.data.type,
        alt: thought.data.alt,
    }));

    return Response.json(data);
};