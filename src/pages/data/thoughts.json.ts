import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
    const posts = await getCollection("thoughts");

    const data = posts.map(post => ({
        title: post.data.title,
        type: post.data.type,
        alt: post.data.alt,
    }));

    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    });
};