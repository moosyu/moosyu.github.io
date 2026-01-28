---
title: "Make everything but text hovered fade away in CSS"
pubDate: 2025-04-20
---

<style>
.fade-text {
    position: relative;
    z-index: 1;
    text-decoration: none;
    color: white;
}

.fade-text::before {
    content: "";
    position: fixed;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 1);
    opacity: 0;
    transition: opacity 1s ease-out;
    pointer-events: none;
}

.fade-text:hover::before {
    opacity: 1;
}
</style>

I had a little snippet of CSS that I struggled with lying around and picking up dust so I decided to post it here.

If you want to see how it looks in action, hover over <span class="fade-text">THIS</span>.

The HTML and CSS for this is:

```html
<style>
.fade-text {
    position: relative;
    z-index: 1;
    text-decoration: none;
    color: white;
}

.fade-text::before {
    content: "";
    position: fixed;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 1);
    opacity: 0;
    transition: opacity 1s ease-out;
    pointer-events: none;
}

.fade-text:hover::before {
    opacity: 1;
}
</style>

If you want to see how it looks in action, hover over <span class="fade-text">THIS</span>.
```

If you intend to use this for links I'd recommend against it as the transition doesn't persist between pages and looks real jank suddenly flashing from dark to everything being fully visible...