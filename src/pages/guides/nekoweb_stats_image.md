---
title: Displaying Nekoweb follower count as images
date: 2025-11-18
---

Wrote some jank code for rice to do this:
![follower count on rice.place](https://i.imgur.com/nJI9CDs.png)

and thought I may as well share. I made it in a way that hopefully it should be a drop in replacement for [Max's Nekoweb Stats script](https://maxpixels.moe/resources/nekoweb-stats/) though you may have to modify depending on your needs.

## Setup

Firstly make or find images that number 0 to 9 and name them as such, make sure each image has the same format (named something like 0.png) and the same extension. If you have 8 images named 0.png -> 8.png but 9 is 9.gif this isn't going to work. Next up if you don't already create HTML elements with the ids created, updated, visitors and followers, for example:

```html
<div id="created"></div>
<div id="updated"></div>
<div id="visitors"></div>
<div id="followers"></div>
```

If you don't want all these things (eg you just want visitors like rice) and you're unfamiliar with JS I'll explain how to get rid of the rest without resulting in console errors later in this guide. Next put the JS below somewhere on the page, if you don't know here read [this Mozilla page](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/Add_JavaScript_to_your_web_page). If you already have Max's script just place this one where that was as it should be a drag and drop replacement.

```js
const domain = "YOUR DOMAIN HERE"
const creation_date = document.getElementById("created");
const updated_date = document.getElementById("updated");
const views = document.getElementById("visitors");
const follows = document.getElementById("followers")

async function displayStats() {
    try {
        const response = await fetch(`https://nekoweb.org/api/site/info/${domain}`);
        const data = await response.json();

        const creation_date_formatted = new Date(data.created_at).toLocaleDateString();
        const updated_date_formatted = new Date(data.updated_at).toLocaleDateString();

        creation_date.innerHTML = `<em>Made</em>: ${creation_date_formatted}`;
        updated_date.innerHTML = `<em>Updated</em>: ${updated_date_formatted}`;
        views.innerHTML = "<em>Views</em>:";
        convertTextToImage(data.views.toString().split(""), views);
        follows.innerHTML = "<em>Followers</em>:";
        convertTextToImage(data.followers.toString().split(""), follows);
    } catch (error) {
        console.error("failed to fetch!!", error)
    }
}

function convertTextToImage(stringValue, elementValue) {
    stringValue.forEach(n => {
        const img = document.createElement("img");
        img.src = `${n}.png`;
        elementValue.appendChild(img);
    });
}

displayStats()
```

To make this work for you you'll need to edit two things. Firstly replace the domain in the first line with your domain, not just the first part, the full thing (eg: const domain = "moosyu.nekoweb.org"). If you're using a custom domain with Nekoweb I believe you can use either your NAME.nekoweb.org or the domain you bought but I'd use your proper domain name just to be safe. Next inside function ConvertTextToImage change:

```js
img.src = `${n}.png`;
```

to wherever your number images are stored. For example if all your images are stored in /images, have the extension .png and are ALL named something like counter-0.png you would do:

```js
img.src = `/images/counter-${n}.png`;
```

That's it! Now your stats display looks something like this:

![](https://i.imgur.com/1knqDt6.png)

so you can style it with CSS as you wish. If you're not comfortable with JS and want to make some modifications stick around however!

## Modifications

### Removing stats

Firstly, if you want to remove any of the displayed stats you could always just delete the corresponding div but that will be a little messy as your code will still attempt to find that id then throw an error in the console when it can't find it so this is what needs to be removed in the code if you wish to remove a stat:

To remove creation date remove:

```html
<div id="created"></div>
```

in your HTML and remove:

```js
const creation_date = document.getElementById("created");
...
const creation_date_formatted = new Date(data.created_at).toLocaleDateString();
...
creation_date.innerHTML = `<em>Made</em>: ${creation_date_formatted}`;
```

lines from your JS.

To remove last updated date remove:

```html
<div id="updated"></div>
```

in your HTML and remove:

```js
const updated_date = document.getElementById("updated");
...
const updated_date_formatted = new Date(data.updated_at).toLocaleDateString();
...
updated_date.innerHTML = `<em>Updated</em>: ${updated_date_formatted}`;
```

lines from your JS.

To remove view count remove:

```html
<div id="visitors"></div>
```

in your HTML and remove:

```js
views.innerHTML = "<em>Views</em>:";
convertTextToImage(data.views.toString().split(""), views);
```

lines from your JS.

To remove follower count remove:

```html
<div id="followers"></div>
```

in your HTML and remove:

```js
follows.innerHTML = "<em>Followers</em>:";
convertTextToImage(data.followers.toString().split(""), follows);
```

lines from your JS.

## Adding borders edges to your images

![borders](https://i.imgur.com/D4XcUtZ.png)

If you'd like to things like rounded edges on your counter simply create two images, one for the front and one for the back. Then inside the convertTextToImage function add this:

```js
const imgFront = document.createElement("img");
imgFront.src = "PATH TO FRONT IMAGE";
elementValue.appendChild(imgFront);
```

before the

```js
stringValue.forEach(n => {
```

line and then add

```js
const imgBack = document.createElement("img");
imgBack.src = "PATH TO BACK IMAGE";
elementValue.appendChild(imgBack);
```

after the

```js
});
```

line in convertTextToImage but NOT after the closing curly bracket of the convertTextToImage function. After this the function should look something like this:

```js
function convertTextToImage(stringValue, elementValue) {
    const imgFront = document.createElement("img");
    imgFront.src = "PATH TO FRONT IMAGE";
    elementValue.appendChild(imgFront);

    stringValue.forEach(n => {
      const img = document.createElement("img");
      img.src = `${n}.png`;
      elementValue.appendChild(img);
    });

    const imgBack = document.createElement("img");
    imgBack.src = "PATH TO BACK IMAGE";
    elementValue.appendChild(imgBack);
}
```

and it will make your stat display look something like:

![](https://i.imgur.com/8BTz9Q6.png)

Beautiful!

## Displaying dates as images

You may be wondering if you can convert your date into images just like the views/follows, the answer is yes but it's a little bit of a pain to do. Technically the convertTextToImage could already do it however images can't include /'s in their name so the current way it's working wouldn't work for slashes, fortunately it's not particularly difficult to fix. Inside of the stringValue forEach loop add:

```js
if (n == "/") {
n = "slash";
}
```

and then have an image in your folder with the rest of your numbers named slash with the same extension. Your convertTextToImage function should now look something like this:

```js
function convertTextToImage(stringValue, elementValue) {
    stringValue.forEach(n => {
      if (n == "/") {
        n = "slash";
      }
      const img = document.createElement("img");
      img.src = `${n}.png`;
      elementValue.appendChild(img);
    });
}
```

and this will give you something like this:

![displayed date](https://i.imgur.com/sszviq5.png)

This is lowkey a really ugly fix as if statements are my #1 opp but it's simple enough so I think it's fine.

## Common issues

<details>
<summary><p style="display: inline;">If you're getting Access to fetch at 'https://nekoweb.org/api/site/info/YOURURL' from origin 'https://YOURURL' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'https://nekoweb.org' that is not equal to the supplied origin. Have the server send the header with a valid value...</p></summary>

You've sent too many requests to the Nekoweb API in a short period of time. Just wait a few minutes and it should start working again.

</details>

<details>
<summary><p style="display: inline;">If you're getting TypeError: can't access property "innerHTML", views is null...</p></summary>

Either add a defer to your script like so:

```html
<script src="stats.js" defer></script>
```

or put your script right at the bottom of your HTML, just above the closing body tag. This issue is being caused by the script loading before the DOM and therefore when the script is running there really is nothing with the ID views.

</details>

That's about it for me, thanks for giving my guide a read. If you do end up adding this somewhere on your site pretty please add my button or something 🥺. Feel free to message me on Discord or email me if you know me and are having problems.

# All the example images were made using [rice's numbers](https://rice.place/). Go follow her 😡!!