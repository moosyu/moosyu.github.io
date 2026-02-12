---
title: "Displaying the latest Github commit with JS"
pubDate: 2024-10-28
---

This is how you get one of these:

![](https://I.imgur.com/c1kAf6b.png)

If you just need the code, here it is:

```html
<script>
  fetch('https://api.github.com/repos/YOURGITHUBNAME/YOURGITHUBREPO/commits?per_page=1')
      .then(res => res.json())
      .then(res => {
          let sha = res[0].sha;
          let authorDate = new Date(res[0].commit.author.date);
          document.getElementById('commitLatest').innerText = res[0].commit.message;
          document.getElementById('shortHash').innerText = "latest commit:" + sha.substring(0, 7) + " on " + authorDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
          document.getElementById('commitLink').href = "https://github.com/YOURGITHUBNAME/YOURGITHUBREPO/commit/" + sha
      });
</script>
```

This code makes the assumption that you have some html elements with the ids "commitLink" (meant to be an ```<a>``` tag), "shortHash" and "commitLatest".

For example mine looks like this:

```html
<a id="commitLink" href="#" target="_blank" style="text-decoration: none;">
    <div style="display: flex; text-align: center; align-items: center; justify-content: center; padding: 20px 0 20px 0;">
        <div style="color: #fc2b50; background-color: #150320; padding: .5rem; width: 100%; box-sizing: border-box; border: 6px double #fc2b50;">
            <p id="shortHash" style="color: #150320; background-color: #fc2b50; font-size: calc(1.3vw + 1.3vh); font-weight: bold">
            </p>
            <p id="commitLatest">
                <br>
                fetching!! (or its broken idk)
            </p>
        </div>
    </div>
</a>
```

(Btw my site is up on [Github](https://github.com/Moosyu/moosyu.github.io/)).

Now here's a line by line explanation (I'm illiterate so this might not make sense sorry).

`fetch('https://api.github.com/repos/YOURGITHUBNAME/YOURGITHUBREPO/commits?per_page=1')` grabs your latest commit from Github, without the ?per_page=1 it grabs your entire history which is unnecessary for showing just one commit.

`.then(res => res.json())` processes the response its grabbing from the Github api into usable json.

```js
.then(res => {
    let sha = res[0].sha;
    let authorDate = new Date(res[0].commit.author.date);
    document.getElementById('commitLatest').innerText = res[0].commit.message;
    document.getElementById('shortHash').innerText = "latest commit:" + sha.substring(0, 7) + " on " + authorDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    document.getElementById('commitLink').href = "https://github.com/YOURGITHUBNAME/YOURGITHUBREPO/commit/" + sha
});
```

This chunk makes more sense if you search https://api.github.com/repos/YOURGITHUBNAME/YOURGITHUBREPO/commits?per_page=1 in your browser (with the name changed ofc).

This is what mine looks like:

```json
[
  {
    "sha": "01aaa69399d41490072227965bb45f6669c593d1",
    "node_id": "C_kwDOIiVf8NoAKDAxYWFhNjkzOTlkNDE0OTAwNzIyMjc5NjViYjQ1ZjY2NjljNTkzZDE",
    "commit": {
      "author": {
        "name": "Moosy",
        "email": "70246651+Moosyu@users.noreply.github.com",
        "date": "2024-10-26T10:16:49Z"
      },
      "committer": {
        "name": "Moosy",
        "email": "70246651+Moosyu@users.noreply.github.com",
        "date": "2024-10-26T10:16:49Z"
      },
      "message": "just added some images I forgot to",
      "tree": {
        "sha": "8ad2cfff3c35ca5a9f77977dc21e3b1effb0e147",
        "url": "https://api.github.com/repos/Moosyu/moosyu.github.io/git/trees/8ad2cfff3c35ca5a9f77977dc21e3b1effb0e147"
      },
      "url": "https://api.github.com/repos/Moosyu/moosyu.github.io/git/commits/01aaa69399d41490072227965bb45f6669c593d1",
      "comment_count": 0,
      "verification": {
        "verified": false,
        "reason": "unsigned",
        "signature": null,
        "payload": null
      }
    },
    "url": "https://api.github.com/repos/Moosyu/moosyu.github.io/commits/01aaa69399d41490072227965bb45f6669c593d1",
    "html_url": "https://github.com/Moosyu/moosyu.github.io/commit/01aaa69399d41490072227965bb45f6669c593d1",
    "comments_url": "https://api.github.com/repos/Moosyu/moosyu.github.io/commits/01aaa69399d41490072227965bb45f6669c593d1/comments",
    "author": {
      "login": "Moosyu",
      "id": 70246651,
      "node_id": "MDQ6VXNlcjcwMjQ2NjUx",
      "avatar_url": "https://avatars.githubusercontent.com/u/70246651?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/Moosyu",
      "html_url": "https://github.com/Moosyu",
      "followers_url": "https://api.github.com/users/Moosyu/followers",
      "following_url": "https://api.github.com/users/Moosyu/following{/other_user}",
      "gists_url": "https://api.github.com/users/Moosyu/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/Moosyu/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/Moosyu/subscriptions",
      "organizations_url": "https://api.github.com/users/Moosyu/orgs",
      "repos_url": "https://api.github.com/users/Moosyu/repos",
      "events_url": "https://api.github.com/users/Moosyu/events{/privacy}",
      "received_events_url": "https://api.github.com/users/Moosyu/received_events",
      "type": "User",
      "user_view_type": "public",
      "site_admin": false
    },
    "committer": {
      "login": "Moosyu",
      "id": 70246651,
      "node_id": "MDQ6VXNlcjcwMjQ2NjUx",
      "avatar_url": "https://avatars.githubusercontent.com/u/70246651?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/Moosyu",
      "html_url": "https://github.com/Moosyu",
      "followers_url": "https://api.github.com/users/Moosyu/followers",
      "following_url": "https://api.github.com/users/Moosyu/following{/other_user}",
      "gists_url": "https://api.github.com/users/Moosyu/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/Moosyu/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/Moosyu/subscriptions",
      "organizations_url": "https://api.github.com/users/Moosyu/orgs",
      "repos_url": "https://api.github.com/users/Moosyu/repos",
      "events_url": "https://api.github.com/users/Moosyu/events{/privacy}",
      "received_events_url": "https://api.github.com/users/Moosyu/received_events",
      "type": "User",
      "user_view_type": "public",
      "site_admin": false
    },
    "parents": [
      {
        "sha": "b4014636ec4bc839bb1febe3d6851a1baf6bbe43",
        "url": "https://api.github.com/repos/Moosyu/moosyu.github.io/commits/b4014636ec4bc839bb1febe3d6851a1baf6bbe43",
        "html_url": "https://github.com/Moosyu/moosyu.github.io/commit/b4014636ec4bc839bb1febe3d6851a1baf6bbe43"
      }
    ]
  }
]
```

We then do this: `let sha = res[0].sha;`.

The response is an array, the array we have only has an index of 0, putting in something like 1 would throw an error, but if you were to have fetched ?per_page=2 instead of ?per_page=1 you would be able to use an index of 1 as your array would now have two objects and it would give you the data from two commits back (as opposed to your latest commit). the .sha is just grabbing whatever is inside the property "sha".

`let authorDate = new Date(res[0].commit.author.date);` does the same thing as the last one except that the date is nested in commit, and then in author like so:

```json
"commit": {
    "author": {
      "name": "Moosy",
      "email": "70246651+Moosyu@users.noreply.github.com",
      "date": "2024-10-26T10:16:49Z"
    }
},
```

The next line is basically the same and the line after is converting the date into a format I like and adding it to a shortened sha: `document.getElementById('shortHash').innerText = "latest commit:" + sha.substring(0, 7) + " on " + authorDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });`

The sha.substring is extracting the first 7 characters of sha and toLocaleDateString is formatting the date in the en-gb locale (day/month/year). [Heres a comprehensive list of locales so you can find the one you want](https://gist.github.com/mlconnor/1887156). Then its using the options of 2-digits for everything so the output looks like 04/02/24 (for the 4th of february 2024).

`document.getElementById('commitLink').href = "https://github.com/YOURGITHUBNAME/YOURGITHUBREPO/commit/" + sha` just links to the commit, the format for commit urls is https://github.com/YOURGITHUBNAME/YOURGITHUBREPO/commit/ with the sha on the end which you already have.

Thanks for coming to my ted talk.