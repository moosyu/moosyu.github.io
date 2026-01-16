---
title: docs ♡ eleventy
---

<h2>Disclaimer</h2>

This guide assumes at least some basic knowledge of HTML and JS, though it's been written with the intention of being able to be understood by anyone. I highly recommend getting a grasp on common concepts before attempting to use a SSG. A terminal will also be used here though all the commands needed will be told to you. This is also being written primarily for Windows. If you're on Linux/Mac some instructions may have to be followed differently.

<h2>Overview</h2>

11ty for the uninitiated is a <span title="static site generator" style="cursor: help; font-weight: bold;">SSG</span> popular in the indieweb space. 11ty (and SSGs in general) provide easy options to automate aspects of web development that may be tedious. For example, I use 11ty to keep a consistent navbar throughout my site that can be modified by editing just a single file as well as to implement pagination without the viewer of my site being required to load any JS. This guide will outline the basics of setting up 11ty as well as Nekoweb specifics like how to get your 11ty site up on Nekoweb.

<h2>Getting started with Eleventy/11ty</h2>

The only prerequisite to beginning with 11ty is [NodeJS](https://nodejs.org/en) (or alternatives like [Bun](https://bun.com/) or [Deno](https://deno.com/)). If you've never heard of any of these download NodeJS which is what the rest of this guide will be based around. Eleventy recommends downloading at least version 18 of NodeJS. Once installed run <code>node -v</code> and <code>npm -v</code>

in your console. If they both return their versions you can continue. If not I recommend restarting your computer, if the issue persists look into your system environment variables and see if path contains a NodeJs/npm variable.

Now you can create a new folder for your 11ty project. <span style="cursor: help; font-weight: bold;" title="Shift-right-click inside of your project folder and click 'Open in Terminal' if using Windows 10/11">Inside</span> of this folder open a terminal and run the following commands, <code>npm init -y</code> and <code>npm i @11ty/eleventy</code>.

The first command will create a basic package.json file for you. You can omit the -y or edit the file later in your file editor if you'd like to change the content however for your actual site it doesn't matter. The second command installs 11ty into your project. This is all the setup required to begin working on your 11ty project.

<h2>Creating a basic site with 11ty</h2>

Firstly to ensure everything is working you can create an index.md file (could also and HTML/NJK etc file, just personal preference) in the root of your project. 11ty has out of the box markdown support so all you need to do in here is write something. Then with a terminal with a working directory inside of your project's root run <code>npx @11ty/eleventy --serve</code>.

Something along the lines of the following output should be produced:

```bash
[11ty] Writing ./_site/index.html from ./index.md (liquid)
[11ty] Wrote 1 file in 0.15 seconds (v3.1.2)
[11ty] Watching…
[11ty] Server at http://localhost:8080/
```

The first part of this command npx @11ty/eleventy is building your site and then the flag --serve added onto it is creating a local web server to easily view it. The default behaviour is to watch for any changes (e.g. when a file is saved) and rebuild your site after such a change so the web server it creates should always be up to date. If localhost:8080 is displaying your index.md file we can continue.

Create a file named (exactly) <span style="cursor: help; font-weight: bold;" title="You can also call it eleventy.config.js and it'll act the same">.eleventy.js</span>. This will be the most important file in your 11ty project. If you don't quite understand JS just yet, don't worry. This guide won't be getting into anything too complex and I'll be including code examples, however if you'd like to be able to use everything 11ty has to offer (like <span style="cursor: help; font-weight: bold;" title="Used to transform values during build with JS">custom filters</span>) you're going to need to learn it at some point. Inside of your new .eleventy.js file include the following code:

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

This is setting an input folder of the name src and an output folder of the name _site (which is the default). Technically you could leave the input folder as the root but I find that ends up messy and is generally advised against. If you choose to set src as your input you need to create a folder named src you'll get an error and unless you put your index.md inside that folder 11ty will no longer be able to find it. Both input and output folders can really be anything but common names for input are "src" and "content" and common names for output are "_site" and "dist".

<h2>Using templates with 11ty</h2>

Templates allow you stitch reusable components (navbars, footers, layouts, etc) onto content in order to create new content quickly without worrying about things like your navbar staying consistent between pages. I'll be outlining how to create a simple base template. The templating language I prefer is Nunjucks but using 11ty leaves you in no way [starved for choice](https://www.11ty.dev/docs/languages/). Create a folder named <span style="cursor: help; font-weight: bold;" title='This is just the default name, you can change it putting includes: "INCLUDES_FOLDER_NAME" inside dir in your .eleventy.js file.'>_includes</span> inside your previously created src folder and create a file named base.njk. Before editing this, if you're using VSCode I highly recommend downloading the [Nunjucks Template](https://marketplace.visualstudio.com/items?itemName=eseom.nunjucks-template) extension, it provides code snippets and syntax highlighting however it's completely optional. Nunjucks is basically HTML with some fancy things like variables, for loops and if statements that make it useful for our purposes as certain elements may need to be automatically changed based on the situation. I won't go over everything here so if you'd like to learn more I recommend giving the [Nunjucks Docs](https://mozilla.github.io/nunjucks/templating.html) a read. Now, open your base.njk.

When setting up a base template like this I generally set it up like one would a normal HTML page. For this guide this is my base.NJK template:

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
        <a href="/about">About</a>
    </nav>
        {{ content | safe }}
</body>
</html>
```

It looks much like a normal HTML page but with two key differences, <code>{{title or "My website"}}</code> and <code>{{ content | safe }}</code>.

{% endraw %}

In Nunjucks two curly brackets indicate a variable. The first part is trying to find a "title" variable and if it can't the title will fall back to "My website". It's doing this using the Nunjucks logical operator "or" which checks the left operand first and if it doesn't exist (returns false) it will use the right operand instead. The second part is looking for the page content and injecting it into the layout. In Nunjucks the pipe (|) denotes a filter. In this template we are using the safe filter. Without it, by default, instead of rendering your content properly 11ty it will escape the HTML and your content will display with their tags/attributes converted as seen below:

![safe vs no safe side-by-side](https://i.imgur.com/ktPftwv.png)

Now you can go to your index.md and add this directly at the top of your file:

```
---
title: home page
layout: base.njk
---
```

Ensure there isn't any space between it and the top of the file or it will break. This is how you define data in 11ty. You can [click here](https://www.11ty.dev/docs/data-configuration/) to view all 11ty default data keys and their functions. Title isn't a build in piece of data, we added it ourselves by setting the variable in our template and entering the data here while layout is built-in and automatically searches inside the _includes folder unless you changed the includes folder in your .eleventy.js.

<h2>Getting your site onto Nekoweb</h2>

Now that we've set up a basic 11ty site it's time to upload it onto Nekoweb. In your terminal run the command <code>npx @11ty/eleventy</code> to build your project to its output folder which is _site if you haven't changed anything in this tutorial. Go into your file explorer, go INSIDE the _site folder, select everything and zip it up. If done correctly the _site folder won't be inside the zipped folder, only its contents. Now go to your Nekoweb dashboard and make sure the path bar displays the site you're looking to change. Before I go on, doing this will override any of the contents of the folder being imported into that have the same name as the files being imported so if you have anything inside you'd like to keep make sure to back it up before continuing by pressing "Export ZIP". Next press "Import ZIP" and select the zip file you created earlier.

COMMAND CHEATSHEET