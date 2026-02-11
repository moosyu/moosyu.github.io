export default function slugify(str: string) {
    return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9']+/g, "-")
    .replace(/'/g, "-")
    .replace(/(^-|-$)/g, "");
}