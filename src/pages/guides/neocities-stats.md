---
title: "Displaying view count on Neocities (free)"
date: 2025-12-19
---

Here's a quick little guide on displaying your site stats with Neocities.

Add this HTML somewhere in your body:

HTML:
```html
<div id="neocities-stats">Loading</div>
```

<details>
<summary><p style="display: inline;">If you have a supporter site add this JS</p></summary>

```js
const username = "YOUR NAME HERE";
async function displayViewCount() {
    try {
        const response = await fetch(`https://neocities.org/api/info?sitename=${username}`);
        const data = await response.json();

        document.getElementById("neocities-stats").innerHTML = `
        <span id="view-count">Views: ${data.info.views}</span>`;
    } catch (error) {
        console.error("Fetching failed: ", error);
    }
};

displayViewCount();
```

All that you need to modify is the SITENAME-HERE part with just your site's name. Info has sitename, views, hits, created_at, last_updated, domain and tags do you can display any of these by replacing the views in data.info.views with them.

</details>

<details>
<summary><p style="display: inline;">If you have a free site do this</p></summary>

<h1 style="color: red;">THIS COULD GET YOUR SITE BANNED!!</h1>

This is using a workaround to Neocities' CORS limitations on free sites. Nobody has been banned for doing this (yet) and the moderation is pretty slack but still proceed with caution.

```js
const username = "YOUR NAME HERE";
async function displayViewCount() {
    try {
        const response = await fetch(`https://neocities.org/api/info?sitename=${username}`);
        const data = await response.json();

        document.getElementById("neocities-stats").innerHTML = `
        <span id="view-count">Views: ${data.info.views}</span>`;
    } catch (error) {
        console.error("Fetching failed: ", error);
    }
};

displayViewCount();
```


Next is the second script that will work on free sites but do note:

<h1 style="color: red;">THIS COULD GET YOUR SITE BANNED</h1>

I'm unsure if anyone has been punished for using this but the purpose of JB's POSTreq is getting around a restriction on free sites so do use it with caution.

First download: https://cdn.jsdelivr.net/npm/postreq/dist/postreq.min.js and save it somewhere in your site, then on the page you want to display stats link it in a script tag somewhere, for example:

```js
<script src="/postreq.min.js"></script>
```

Now add this HTML:

```html
<div id="neocities-stats">Loading</div>
```

and place this JS in a script tag somewhere:

```js
const username = "YOUR NAME HERE";
async function displayViewCount() {
    try {
      const pt = new POSTreq.POSTreq();
      const response = await pt.fetch(`https://neocities.org/api/info?sitename=${username}`);
      const data = await response.json();

      document.getElementById("neocities-stats").innerHTML = `
        <span id="view-count">Views: ${data.info.views}</span>`;
    } catch (error) {
        console.error("Fetching failed: ", error);
    }
};

displayViewCount();
```

All that you need to do is replace SITENAME-HERE with your site name and you should be set. I have my viewcount being displayed on my own [Neocities site](https://moosyu.neocities.org/stats) so if yours isn't working you can check mine, if it's still working it's probably something you did wrong, if it isn't something either happened to weirdscifi.ratiosemper.com or POSTreq.

That's it! As always, if you do end up adding this somewhere on your site pretty please add my button or something 🥺. Feel free to message me on Discord or email me if you know me and are having problems.