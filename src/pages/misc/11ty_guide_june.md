---
title: 11ty
---

## Getting started with Eleventy/11ty
*Last updated: <span class="lastupd">{{page.date | formatDate}}</span>*

## Disclaimer

This guide assumes at least some basic knowledge of HTML and JS even though it's been written with the intention of being able to be understood by anyone. I highly recommend getting a grasp on common programming and HTML concepts before attempting to use a SSG. A terminal will also be used here though all the commands needed will be told to you. This is also being written primarily for Windows 10/11 users. If you're on Linux/Mac some instructions may have to be followed differently (mainly in the installation process).

## Overview

Eleventy for the uninitiated is a popular <span title="static site generator" style="cursor: help; font-weight: bold;">SSG</span>. Eleventy (and SSGs in general) provide options to automate aspects of web development that may be tedious. For example, I use Eleventy to keep a consistent navbar throughout my site that can be modified by editing a single file, as well as to implement pagination without the viewer of my site being required to load any JS. This guide will outline the basics of setting up Eleventy, creating a simple blog and hosting your Eleventy site on Nekoweb.

## Installation

The only prerequisite Eleventy has is [NodeJS](https://nodejs.org/en) (or alternatives like [Bun](https://bun.com/) or [Deno](https://deno.com/)). If you've never heard of any of these download NodeJS which is what the rest of this guide will be based around. Eleventy recommends downloading at least version 18 of NodeJS. Once installed run <code>node -v</code> and <code>npm -v</code> in your console. If they both return their versions you can continue. If not I recommend restarting your computer, if the issue persists (and you're on Windows) look into your system environment variables and see if path contains a NodeJs/npm variable.

Now you can create a new folder for your Eleventy project. <span style="cursor: help; font-weight: bold;" title="Shift-right-click inside of your project folder and click 'Open in Terminal' if you're using Windows">Inside</span> of this folder open a terminal and run the following commands: <code>npm init -y</code> and <code>npm i @11ty/eleventy</code>.

The first command will create a basic package.json file for you. You can omit the -y or edit the file later in your file editor if you'd like to change the content however for your actual site most of this file doesn't matter. The second command installs Eleventy into your project. This is all the setup required to begin working on an Eleventy project.

## Creating a basic site with Eleventy

Firstly, to ensure everything is working you can create an index.md file (could also be HTML/Nunjucks file, just personal preference) in the root of your project. Eleventy has out of the box markdown support so all you need to do in here is write something. Then with a terminal with a working directory inside of your project's root run <code>npx @11ty/eleventy --serve</code>.

Something along the lines of the following output should be produced:

```bash
[11ty] Writing ./_site/index.html from ./index.md (liquid)
[11ty] Wrote 1 file in 0.15 seconds (v3.1.2)
[11ty] Watching…
[11ty] Server at http://localhost:8080/
```

The first part of this command, <code>npx @11ty/eleventy</code> is building your site and then the flag --serve added onto it is creating a local web server to easily view it. If you open the server's URL in your browser you should see whatever you wrote in your index file displayed. The default behaviour is to watch for any changes (e.g. when a file is saved) and rebuild your site after such a change, so the web server it creates should always be up to date (though it has some issues mentioned later). If localhost:8080 is correctly displaying your index.md file we can continue. Do CTRL + C in your terminal to stop Eleventy from running.

Create a file named (exactly) <span style="cursor: help; font-weight: bold;" title="You can also call it eleventy.config.js and it'll act the same">.eleventy.js</span>. This will be the most important file in your Eleventy project. If you don't quite understand JS just yet, don't worry. This guide won't be getting into anything too complex and I'll be including code examples, however if you'd like to be able to use everything Eleventy has to offer (like <span style="cursor: help; font-weight: bold;" title="Used to transform values during build with JS">custom filters</span>) you're going to need to learn it at some point. Inside of your new .eleventy.js file include the following code:

```js
module.exports = function(eleventyConfig) {
    return {
        dir: {
            input: "src",
            output: "_site"
        }
    };
};
```

This is setting an input folder of the name src and an output folder of the name _site (which is the default). Technically you could leave the input folder as the root but I find that ends up messy and is generally advised against. If you choose to set src as your input (as I'll assume you've done moving forward), you'll need to create a folder named src or you'll get an error. Unless you put your index.md inside that folder Eleventy will no longer be able to find it and this goes for every new file unless specified otherwise. Both input and output folders can really be anything, but common names for input are "src" and "content" and common names for output are "_site" and "dist". You may even want to change your output to your site's name if you just want to be upload everything at once from the root of your Nekoweb dashboard.

## Using layouts with Eleventy

Layouts allow you stitch parts of your site (navbars, footers, headers, etc) onto content in order to create new stuff quickly without worrying about things like your navbar staying consistent between pages. The templating language I prefer is Nunjucks but using Eleventy leaves you in no way [starved for choice](https://www.11ty.dev/docs/languages/). I've only ever used Nunjucks however so I don't know whether some parts of this guide will work for anyone using another template language so bare that in mind. Create a folder named <span style="cursor: help; font-weight: bold;" title='This is just the default name, you can change it putting includes: "INCLUDES_FOLDER_NAME" inside dir in your .eleventy.js file.'>_includes</span> inside your previously created src folder and create a file named base.njk. Before editing this, if you're using VSCode I highly recommend downloading the [Nunjucks Template](https://marketplace.visualstudio.com/items?itemName=eseom.nunjucks-template) extension. It provides code snippets and syntax highlighting however it's completely optional. Nunjucks is basically HTML with some fancy things like variables, for loops and if statements you'd find in a real programming language that make it useful for our purposes. I won't go over everything Nunjucks specific here so if you'd like to learn more I recommend giving the [Nunjucks Docs](https://mozilla.github.io/nunjucks/templating.html) a read. Now, open your base.njk.

When setting up a base layout like this I generally set it up mostly like one would a normal HTML page. For this guide this is my base.njk layout:

{% raw %}
```njk
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title or "My website"}}</title>
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/blog">Blog</a>
    </nav>
        {{ content | safe }}
</body>
</html>
```

The Eleventy specific changes here are <code>{{title or "My website"}}</code> and <code>{{ content | safe }}</code>.

{% endraw %}

In Nunjucks two curly brackets indicate a variable. The first part is trying to find a "title" variable and if it can't, the title will fall back to "My website". It's doing this using the Nunjucks logical operator "or" which checks the left operand first and if it doesn't exist (returns false) it will use the right operand instead. The second part is looking for page content and injecting it into the layout. In Nunjucks the pipe (|) (which isn't an uppercase i) denotes a filter. In this layout we are using the safe filter. Without it, by default, instead of rendering your content properly Eleventy it will escape the HTML and your content will display with their tags/attributes converted as seen below:

![safe vs no safe side-by-side](/assets/eleventy/safe.png)

Now you can go to your index.md and add this directly at the top of your file:

```
---
title: home page
layout: base.njk
---
```

If the three dashes aren't on the first line it will break. This is one way to define data in Eleventy. Title isn't a built in piece of data, we added it ourselves by setting the variable in our layout and entering the data here while, layout is built-in and automatically searches inside the _includes folder unless you changed the includes folder in your .eleventy.js. You can [click here](https://www.11ty.dev/docs/data-configuration/) to view all Eleventy built-in data keys and their functions.

## Assets and external stylesheets

In Eleventy if you were to do the usual method of linking a stylesheet or displaying an image you'd find your file can't be found even if the file seems to be there on your end. The solution to this is rather simple. First make two folders in your src, one for your css and the other for your assets (images, fonts, etc). Go into your .eleventy.js file and add these lines somewhere inside the <code>module.exports = function(eleventyConfig)</code>'s curly brackets:

```js
eleventyConfig.addPassthroughCopy("src/css/*");
eleventyConfig.addPassthroughCopy("src/assets/*");
```

This is ~what your .eleventy.js would look like now if you're confused:

```js
module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("src/css/*.css");
    eleventyConfig.addPassthroughCopy("src/assets/*");

    return {
        dir: {
            input: "src",
            output: "_site"
        }
    };
};
```

This change will make Eleventy look inside of these folders and any .css file it finds inside your CSS folder will be available in your built site as well as any file in assets. This will NOT search subfolders. If you want that behaviour you'll need to use a glob pattern like so: <code>eleventyConfig.addPassthroughCopy("src/css/**/*.css");</code>. If you want to access these images don't link to the src folder, the passthrough copies will be in the root of your built version of your site. E.g. for an image do <code>src="/assets/image.png"</code> not <code>src="/src/assets/image.png"</code>.

## Partials/components

I'll be referring to partials/components as just partials here but the name can change depending on who you're talking to, likely because they're quite similar to Astro's components. Partials allow you to further break up components of your site and can be important if you want to maintain consistency between layouts while not using the somewhat janky method of extending your layouts. Partials will be important for a later section of this guide.

Firstly create a new folder inside _includes and name it partials. Inside this folder create two new files, head.njk and nav.njk. These will store the generic content of your head and nav that you want to be consistent between pages. All you need to do in these is copy the the content of your head and nav into them like so:

head.njk:

```njk
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{title or "My website"}}</title>
```

nav.njk

```njk
<nav>
    <a href="/">Home</a>
    <a href="/blog">Blog</a>
</nav>
```

Now in the place of where the content of head and nav were in your base.njk once were add {% raw %}<code>{% include "partials/head.njk" %}</code> and <code>{% include "partials/nav.njk" %}</code> respectively.{% endraw %}

Your base.njk should look something like this now:

{% raw %}
```njk
<!DOCTYPE html>
<html lang="en">
<head>
    {% include "partials/head.njk" %}
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    {% include "partials/nav.njk" %}
    {{ content | safe }}
</body>
</html>
```
{% endraw %}

I've left the stylesheet link out of the head.njk partial in case you want to use a completely separate stylesheet for a page but if that's not a concern it should work fine if left in.

## Collections

Collections in Eleventy allow you to group content, most commonly this is used to create blogs so I'll instruct you on doing that though they are quite varied in their possible use-cases. Personally I use collections to display an interactive calendar of my thoughts as well as my sitemap.

Firstly create a new folder named <span style="cursor: help; font-weight: bold;" title="It actually doesn't matter what you call it, if it's inside your input folder (src) Eleventy will be able to find it. You don't even need a folder at all, I just like to organize">blog-posts</span> in src. Inside your folder create a new file called blog-posts.11tydata.json. This is a special file that will apply the <span style="cursor: help; font-weight: bold;" title='Front matter data is the data we placed between two sets of dashes on our homepage.'>front matter data</span> we put inside of it to every blog post inside that folder or its subdirectories:

```json
{
"tags": "posts",
"layout": "base.njk"
}
```

When making an 11tydata file it's important the file's name corresponds with the folder it's inside of. If you named the folder you store you blog posts inside something other than blog-posts, make sure to modify accordingly. These 11tydata files can also be JS if you'd like, [it's just personal preference](https://www.11ty.dev/docs/data-template-dir/) and for simple things like this it doesn't matter. Now, create a document inside your new blog-posts folder, it can be any supported file type but for writing-heavy pages like blogs I prefer to use markdown so I'll be creating first-post.md. Inside this new file I'll be adding this data like we did earlier with our index:

```
---
title: My first blog post
date: 2026-01-17
---
```

The date data key is special just like layout from earlier and can have either a date written in the YYYY-MM-DD format, Created, git Created, git Last Modified or Last Modified. Personally I avoid using Create or Last Modified as I've found them to end up broken especially with all the compressing and moving of my site I've done, though they're technically options. The git versions are good but require you to have a git repository for your site. Because of our blog-posts.11tydata.json file this blog post is automatically placed into the posts collection. Now we can create a blog.njk file that will display a list of our blog posts. This file will need to be out of the blog-posts folder or it will be given the posts tag and be displayed as a blog post. Ensure this is a Nunjucks file or the following code won't work:

```njk
---
title: blog posts
layout: base.njk
---

<ul>{% raw %}
    {% for post in collections["posts"] | reverse %}
        <a href="{{ post.url }}"><li>{{ post.data.title }} - {{ post.date.toLocaleDateString('en-US', { dateStyle: 'medium' }) }}</li></a>
    {% endfor %}
{% endraw %}</ul>
```

This code is using a Nunjucks for loop to go through the posts collection (which is just an glorified array) and displays the data of each list item. The reverse filter is used because by default Eleventy displays oldest first. It's recommended by Eleventy's creator to use a [library instead of Node's built in toLocaleDateString](https://github.com/11ty/eleventy/issues/1157#issuecomment-629695501), Luxon is actually already a dependency so you'll have it when you install Eleventy, however for simplicity's sake I haven't included it here. If the list is empty try restarting Eleventy's web server (CTRL + C in your console and run <code>npx @11ty/eleventy --serve</code> again). Eleventy can act weirdly with detecting changes made if collections, changes to the config file or filters are involved.

## Pagination

This part is on using pagination, collections and permalinks to categorise blog posts into "tags". Much of it is using code I made years ago while following [this guide on the Eleventy website](https://www.11ty.dev/docs/quicktips/tag-pages/).

Firstly go your previously made blog post and update the top data section to look somewhat like this:

```
---
title: blog post
date: 2026-01-17
tags:
    - art
    - gaming
    - movies
---
```

You can add as many or as few tags as you'd like to a post in this format and you can choose any name you'd like. Now inside src (but not inside blog-posts) create a new Nunjucks file to display all posts under a certain tag. I'm naming mine tags.njk. Then add this to the tags.njk file:

{% raw %}
```njk
---
layout: base.njk
pagination:
    data: collections
    size: 1
    alias: tag
    filter:
        - posts
        - all
permalink: /tags/{{ tag | slugify }}/
---

<h3>Blog posts tagged "{{ tag }}"</h3>

{% for post in collections[tag] | reverse %}
    <a href="{{ post.url }}"><li>{{ post.data.title }} - {{ post.date.toLocaleDateString('en-US', { dateStyle: 'medium' }) }}</li></a>
{% endfor %}
```
{% endraw %}

You may notice that most of the Nunjucks code is identical to the blog posts list we created earlier, the main difference is that the collection is now tag not posts and quotation marks aren't used, as it's now a variable being created in the pagination section of the front matter data not a string. Pagination is fortunately very simple in Eleventy. We're first setting our dataset as the built-in "collections", we're splitting each tag into it's own page by setting the size to one, we're setting an alias of tag because it's a lot cleaner than writing pagination.items and we're filtering out posts and all because they're both not needed and just display unnecessary information. Then we're using Eleventy's permalink feature to set where each of these pages will end up with their own specially named URLs and not just /tags/0-.../. We're also using slugify which is a built in filter in order to convert the tag to a slug which will cause things like whitespace to become dashes. The default slugify filter does however currently [ignore most non-latin characters](https://github.com/sindresorhus/transliterate/issues/1). This means that any tags with no unicode characters in their name will not work (eg a tag entirely in Chinese). If this is an issue I'd consider looking into creating your own slugify filter.

Now, for users to access these tag lists I like displaying them on blog posts. If you'd prefer having just a list of all your tags (or both), you can put this code somewhere in a Nunjucks file:

{% raw %}
```
<ul>
{% for tag, posts in collections %}
  {% if tag != "all" and tag != "posts" %}
    <li>
      <a href="/tags/{{ tag }}/">{{ tag }}</a>
    </li>
  {% endif %}
{% endfor %}
</ul>
```
{% endraw %}

for tag, posts in collections iterates through all Eleventy collections in the collections object which looks something like:

```js
collections = {
  "all": [...],
  "posts": [...],
  "another-tag": [...]
}
```

The "tag" variable symbolises the key (all, posts, another-tag) and posts symbolises the value (the posts in that collection). Even though we don't use posts we'll still need it as without it Nunjucks won't know what to do and won't be able to iterate over the object. In this we're also filtering out "all" and "posts" as once again they aren't necessary.

If you want to display the tags each blog post has inside of the post itself I recommend making a new layout. Go into your _includes folder and make a Nunjucks file, I'm calling mine blog-layout.njk. Inside your new layout do the usual setup we did in our base.njk but in the body we can adding this:

{% raw %}
```njk
{% for tag in tags %}
    {% if tag != "posts" %}
        <a href="/tags/{{ tag }}">#{{ tag }}</a>
    {% endif %}
{% endfor %}
```
{% endraw %}

This is a for loop that will loop through the tags array we created in our post's front matter. If the tag it's currently iterating through is "posts" it will skip to the next tag in the array without adding anything as it's unnecessary. No need to filter out all this time as it's not a tag in the tags array.

My blog-layout.njk looked like this:

{% raw %}
```njk
<!DOCTYPE html>
<html lang="en">
<head>
    {% include "partials/head.njk" %}
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    {% include "partials/nav.njk" %}

    {% for tag in tags %}
        {% if tag != "posts" %}
            <a href="/tags/{{ tag }}">#{{ tag }}</a>
        {% endif %}
    {% endfor %}

    {{ content | safe }}
</body>
</html>
```
{% endraw %}

Each post will now display its tags and links to the list of every post under that particular tag:

![blog post with tags](/assets/eleventy/completed.png)

## Getting your site onto Nekoweb

Now that we've set up the foundations of our new Eleventy site it's time to upload it onto Nekoweb. In your terminal run the command <code>npx @11ty/eleventy</code> to build your project to its output folder.

<details>
  <summary>If your output folder is named something other than your Nekoweb site url/custom url open this</summary>
  <span>Go into your output folder and zip everything up. It has to be a zip not 7z or rar and make sure your zipped file doesn't have the output folder itself inside, just the contents of it. If you don't know how and you're on Windows you can select all the files, click "Send to" which should be in your right-click menu somewhere and select "Compressed (zipped) folder". Now go to your Nekoweb dashboard, go into the site you'd like to import into (not the root) and click "Import ZIP". Select your zipped output contents and you're done! Do bear in mind that any files currently on your Nekoweb site with the same names as those you're importing will be overwritten so be sure to backup beforehand by clicking "Export ZIP" if you're worried about losing things.</span>
</details>

<details>
  <summary>If your output folder is the name of your Nekoweb site url/custom url connected to your Nekoweb site open this</summary>
  <p>Go to your output folder and zip it up. It has to be a zip not 7z or rar and make sure your zipped file has the output folder itself inside. If you don't know how and you're on Windows you can select all the files, click "Send to" which should be in your right-click menu somewhere and select "Compressed (zipped) folder". Now go to your Nekoweb dashboard, go into your root and click "Import ZIP". Select your zipped output contents and you're done! Do bear in mind that any files currently on your Nekoweb site with the same names as those you're importing will be overwritten so be sure to backup beforehand by clicking "Export ZIP" if you're worried about losing things.</p>
</details>

If you'd like to download the project we created it's hosted on [github.com/moosyu/moosyu.github.io/examples/11ty-blog](https://github.com/moosyu/moosyu.github.io/examples/11ty-blog).