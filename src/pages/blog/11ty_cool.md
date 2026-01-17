---
title: "11ty is really cool and I want to talk about it"
date: 2024-09-22
tags:
    - web
---

I was gonna try to not make this too dev bloggy because every blog seems to be a dev blog already, but I just really wanted to talk about my one true love, 11ty.

Disclaimer: I've only used HTML and now 11ty so for all I know react, next, astro, hugo etc might just be better than 11ty in every way but I'm just gonna talk about 11ty like its the best because its definitely better than plain HTML.

You know how when you make an html page and you have to write one of these out for the 600th time (though with vscode you just got to write an !):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

</body>
</html>
```

Imagine if you didn't have to do that, imagine if all you have to do was type this:

```njk
---
title: "really cool page"
layout: "layout.njk"
---
```

and that's all you need to have a blank page like this, ready to put content on (I mean you're just gonna get a blank page but you can stylise the template obv):

![screenshot of base without content](https://I.imgur.com/BkJyLQY.png)

It might sound silly to be raving this much about something that boils down to saving one ctrl c ctrl v but we're just getting started. Now lets say I want to edit my navbar, instead of needing to go through every page and change it, you can just edit the template and your change will reflect on every page using that template. I know you can do this on normal html with jquery or iframes but I hate both methods and if I can avoid putting jquery in my site I'm going to take it. That's how you're currently on a javascriptless page right now.

11ty also has this really cool thing called [collections](https://www.11ty.dev/docs/collections/). Collections, as the name suggests are groups of pages and you can run through these groups in a loop to build things like lists of every blog post. Pages can also be a part of multiple collections, allowing this page you're on right now to be in the "blog" collection which is being looped through on the blog home page to show every post as well as being in the "web" collection.

11ty also has [pagination](https://www.11ty.dev/docs/pagination/) which is how I build my review pages, it iterates over my json (though I think it could also use javascript files) to create a table, then creates new pages once it has gone through 50 elements. It's very cool and it's kind of crazy that you can pull something like that off so easily in 11ty, like straight up this is all the code it took to get a basic pagination working.

```html
---
pagination:
    data: comics
    size: 100
    alias: items
    addAllPagesToCollections: true
---
{% raw %}
<tbody>
    {% for item in items %}
    <tr>
        <td>
            [{{ item.type }}]
            <br>
            ({{ item.name }})
            <br>
            {{ item.score }}/10
            <br>
            <td>{{ item.description }}</td>
            <td>
                {% if item.image %}
                <img src="{{ item.image }}" alt="{{ item.name }}">
                {% else %}
                no image
                {% endif %}
            </td>
    </tr>
    {% endfor %}
</tbody>
{% endraw %}
```

This is the something that when I was using html completely had me stumped and just the making of the table generator took hours (though it probably shouldn't have), but 11ty let me do it in minutes.

11ty also has a bunch of really cool plugins to speed up your operations. The ones I'm using right now are [RSS](https://www.11ty.dev/docs/plugins/rss/) which automatically generates my RSS feed and [11ty syntax highlighting](https://www.11ty.dev/docs/plugins/syntaxhighlight/). You could probably guess what that one does. I'm also using the NPM packages [clean-css](https://www.npmjs.com/package/clean-css) and [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser). At some point I want to figure out [11ty image](https://www.11ty.dev/docs/plugins/image/) which generates many images of various sizes to speed up page loads which will do a lot more for my loading speeds than saving 20kb with my minifiers. It also caches so I wont end up with 6 hour long build times. [fetch](https://www.11ty.dev/docs/plugins/fetch/) also looks pretty cool but I don't really have a use for it right now as status.cafe doesn't seem to be rate limiting my constant reloads just yet.

The last thing I want to say before I end this suck off is that 11ty has really nice [markdown support](https://www.11ty.dev/docs/languages/markdown/), I write every blog post, guide and rambling in markdown, its a massive time saver and works perfectly. Aside from markdown it seems to have [support for everything](https://www.11ty.dev/docs/languages/) on earth and if it doesn't have what you want you can make a custom templating language. its insane. if you have any interest in website building I reckon you should at least give 11ty a shot, its really cool and pretty easy to get the hang of with the help of its [great docs](https://www.11ty.dev/docs/).

<p style="text-align:center;">(( ( update 23/09/24 ) ))</p>

Uhh a day after writing this ive decided to add [@vscode/markdown-it-katex](https://www.npmjs.com/package/@vscode/markdown-it-katex) so I can write cool maths equations like this (without any client side js):

$\mathrm{e} = \sum_{n=0}^{\infty} \dfrac{1}{n!}$

It's faster than mathjax (apparently, the jsperf link they gave to show that is dead) so I'll just take their word for it, I'm using the vscode fork because it seems to be the only one getting updated and the original has a security vulnerability.

[I wrote a tutorial](/pages/guides/) on how to add it in my guides page. I'm also considering markdown-it-anchor, markdown-it-footnote and markdown-it-emoji so I'll just end up with a fully kitted out 11ty markdown setup.