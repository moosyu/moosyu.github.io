import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const thoughts = await getCollection("thoughts");
  return rss ({
    title: "moosyus awesome blog",
    description: 'moosyu is online',
    site: context.site,
    items: thoughts.filter((thought) => thought.data.dateModified).map((thought) => ({
      title: thought.data.title,
      pubDate: thought.data.dateModified,
      link: `/thoughts/${thought.id}-${thought.data.type.toLowerCase().replace(" ", "-")}/`,
    })),
  });
}
