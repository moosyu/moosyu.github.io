---
title: Discord webhook contact form + hiding your webhook token
date: 2025-11-22
---

Rice of the hit website rice.place had followed [this tutorial](https://dev.to/mistval/discord-webhook-powered-contact-form-3lk6) on creating a webhook contact form but this tutorial while simple also has you expose your webhook which allows people to send whatever heinous things they want to which is what happened to rice:

![](https://i.imgur.com/ZGV3RzZ.png)

Fortunately for her and anyone reading there is a (reasonably) easy and simple and free fix for this, Cloudflare Workers. Disclaimer before the guide starts, this is my first time doing something with Cloudflare workers so there's a non-zero chance my code breaks but as of right now it seems to be working fine so idk. On top of this I'd recommend at least a decent understanding of JS before reading this however it for sure can be completely without any knowledge of JS and I've tried to write in such a way that it makes sense to anyone.

## Setup

Firstly go into your Discord server, go to integrations, then to webhooks and create a new webhook and press "Copy Webhook URL". We'll need this for later so put it in a notepad or something.

Then go to your Cloudflare Dashboard, if you're using Brave like me you may have to switch browsers as somehow Cloudflare is yet to figure out how to make a working website but once you've made it press the + Add button in the top bar and then press "Workers":

![](https://i.imgur.com/XD35PhU.png)

It should take you to a page where you can press something along the lines of "Start with Hello World!":

![](https://i.imgur.com/81dgRxr.png)

Now go into your new worker, press settings up the top, go to "Variables and Secrets" and then add a new variable. This part is important, variable's type should be secret its name should be DISCORD_WEBHOOK_URL and its value should be the webhook url that you copied earlier. Your settings page should look something along the lines of:

![](https://i.imgur.com/E0j2XoM.png)

Now in your worker click the "Edit code" button you can delete the code already in worker.js and add this:

```js
export default {
  async fetch(request, env) {
    const webhook = env.DISCORD_WEBHOOK_URL;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "YOUR WEBSITE URL",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        // no content
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method !== "POST") {
      return new Response("only post requests are allowed!! (what are you up to??)", {
        // wrong method
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const data = await request.json();

      const email = data.email || "no email...";
      const message = data.message || "no message...";

      const webhookBody = {
        embeds: [{
          title: 'i got your message gang',
          fields: [
            { name: 'email', value: email },
            { name: 'message', value: message }
          ]
        }]
      };

      const discordRes = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookBody)
      });

      if (!discordRes.ok) {
        return new Response(JSON.stringify({ error: "somethings wrong with discord" }), {
          // server error
          status: 500,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: corsHeaders
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: "somethings wrong with you pal" }), {
        // client error
        status: 400,
        headers: corsHeaders
      });
    }
  }
};
```

The only thing you need to edit here is adding your website's URL in this section:

```js
const corsHeaders = {
    "Access-Control-Allow-Origin": "YOUR WEBSITE URL",
    ...
};
```

And that's about it for the worker side of it! Just press deploy on that worker and we can switch back to normal clientside JS business however keep the tab with your worker open, we'll need it for later.

Next go to your contact form HTML page and put in HTML somewhat resembling this:

```html
    <form id="contactForm">
        <label>your email here:</label>
        <input type="email" name="email" required>
        <br>
        <label>what is up?</label>
        <textarea name="message" required></textarea>
        <button type="submit">Send</button>
    </form>
```

The important parts is the id being contactForm and the names being email and message. Next add this JS to the contact page (if you don't know here read [this Mozilla page](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/Add_JavaScript_to_your_web_page)):

```js
document.getElementById("contactForm").onsubmit = async (e) => {
    // if you delete the page reloads!! (so dont)
    e.preventDefault();

    const form = e.target;

    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const response = await fetch("YOUR WORKER URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message })
    });

    const data = await response.json();

    if (!response.ok) {
        alert("i didnt get it or something is wrong... email me if this happens more then the usual! " + (data.error || "missing error!?"));
        return;
    } else {
        alert("thanks for submitting a question or whatever! this will be answered via discord!");
    }
    form.reset();
};
```

The only thing you need to change here is adding your worker URL to:

```js
const response = await fetch("YOUR WORKER URL", {
...
});
```

Getting your worker url is very simple, go back to your worker's page, click the visit button and copy the url of the site you are sent to (the URL also just shows up loads on the worker's page):

![](https://i.imgur.com/3Cw9dx4.png)

I also imagine you'd want to change the alert text but it's not required. That's it! As always, if you do end up adding this somewhere on your site pretty please add my button or something 🥺. Feel free to message me on Discord or email me if you know me and are having problems.