import Fuse from "fuse.js";
import slugify from "../scripts/slugify";

fetch("/data/thoughts.json")
.then(response => response.json())
.then(data => {
    const options = {
        keys: ["title", "alt"],
        threshold: 0.3, // lower the number the more strict
    };

    const fuse = new Fuse(data, options);
    const searchInput  = document.getElementById("mediaSearchInput") as HTMLInputElement;
    const searchResults = document.getElementById("searchResults") as HTMLInputElement;

    if (searchInput && searchResults) {
        searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        const results = fuse.search(query, { limit: 20 });
        searchResults.innerHTML = results.map(result => {
            let item: any = result.item;
            return `
            <div class="background-div">
                <h3 style="margin: 0;"><a href="/thoughts/${slugify(item.title)}-${slugify(item.type)}/">${item.title}</a></h3>
            </div>
        `;
        }).join("")});
    }
    /*i asked some smart people and they said this script is gonna blow up if my json file gets too large, but i asked what they meant and they said like 1mb or larger and since its only 1/10th of that right now im just not gonna worry about it. im sure like 25 year old version of me will be able to solve this issue (technology will probably be so good by then that it wont matter anyways). life hack.*/
});