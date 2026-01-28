---
title: "Lexiqqq + 11ty github workflow"
pubDate: 2024-10-03
---

### Note: this still works but I don't use lexiqqq anymore so I won't be able to troubleshoot for you, sorry.

We asked a security guy and he said this script is "alright", using sftp would be better but I go for 50% on every test so its fine for me.

# 1. Folder setup:

Make a folder in the root of your project called .github, then make another folder inside .github called workflows, inside workflows make a yml file, I call mine build.yml.

```
project root/
└── .github/
    └── workflows/
        └── build.yml
```

(Project root is the folder that _site, node_modules, package.json etc are in.)

# 2. defining the workflow:

Inside the build.yml file copy and paste this:

{% raw %}
```yml
name: Deploy to Lexiqqq

on:
  push:
    branches: ["main"]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Use Node.js >= 14.x
        uses: actions/setup-node@v3
        with:
          node-version: 20.x

      - name: Install dependencies
        run: npm install

      - name: Build the site
        run: npx @11ty/eleventy

      - name: Setup SSH key
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.LEXIQQQ_PRIVATE_KEY }}" > ~/.ssh/private.key
          chmod 600 ~/.ssh/private.key
          ssh-keyscan lexiqqq.com >> ~/.ssh/known_hosts

      - name: Copy _site to Lexiqqq with SCP
        run: |
          scp -i ~/.ssh/private.key -o UserKnownHostsFile=~/.ssh/known_hosts -o StrictHostKeyChecking=no -r _site/* YOURLEXIQQQUSERNAME@lexiqqq.com:/home/YOURLEXIQQQUSERNAME/public_html/
```
{% endraw %}

Notes:

If your output directory is something other than the default _site, then edit the "_site/*" section on the last line to your output directory's name.

If the branch you want to push to is not called the default "main", eg its master make sure to edit line 5.

# 3. Configuring the workflow

Inside that document replace "YOURLEXIQQQUSERNAME" with your lexiqqq username on the last line (your username is the name before .lexiqqq.com on your url).

# 4. Setup up github repo secrets

Now here it gets a little complicated, go into your github repo, go to settings, click the secrets and variables dropdown on the right and click actions. in the actions page you're going to want to click "New repository secret".

![](https://I.imgur.com/3JxV4Eq.png)

# 5. Generating your SSH key

In the new repository secret menu for for the name write LEXIQQQ_PRIVATE_KEY. For the secret you're going to want to open a terminal window, run this command (but replace your_email@example.com with your actual email, the email bit is a comment that is associating the key with your email so you can identify it):

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

(Keep the quotations in your command, also the email doesn't need to be your lexiqqq email just use your actual one.)

Press enter when you are prompted with the file name and a passphrase leaving them blank. You can still follow this tutorial (probably I haven't tested it) if you add a passphrase but it might get more complicated and you'll probably have to modify the workflow, same with a file name. 


# 6. Copying your public key to lexiqqq (open the dropdown depending on your OS)

<details>
<summary><p style="display: inline;">linux</p></summary>

Run this command that copies your public key (specified with the .pub) to your lexiqqq server, make sure to add your lexiqqq username instead of just leaving it as "YOURLEXIQQQUSERNAME" before running this command!

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub YOURLEXIQQQUSERNAME@lexiqqq.com
```

</details>

<details>
<summary><p style="display: inline;">Mac</p></summary>

If you're on mac you may need to run this first:

```bash
brew install ssh-copy-id
```

Then run this command which copies your public key (specified with the .pub) to your lexiqqq server, make sure to add your lexiqqq username instead of just leaving it as "YOURLEXIQQQUSERNAME" before running this command!

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub YOURLEXIQQQUSERNAME@lexiqqq.com
```

(This is untested, if youre on Mac and this works please tell me!! If this doesn't work just use the windows option it should work universally).

</details>

<details>
<summary><p style="display: inline;">Windows</p></summary>

Run this in a terminal and copy its output:

```bash
cat ~/.ssh/id_ed25519.pub
```

What you copied should look something like this:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDbKm9EjflQkNtlb7vTud7XmMfObOlTFOupKtFHzrjJk your_email@example.com
```

Next ssh into lexiqqq in a terminal with this command:

```bash
ssh YOUR_USERNAME@lexiqqq.com
```

This should prompt you to enter your lexiqqq password, do it.

Once you've logged run this:

```bash
mkdir -p ~/.ssh
```

Then run:

```bash
echo "YOUR_SSH_KEY" > ~/.ssh/authorized_keys
```

(Paste the ssh key that you just copied to your clipboard into the YOUR_SSH_KEY spot.)

Then run:

```bash
chmod 600 ~/.ssh/authorized_keys
```

and:

```bash
chmod 700 ~/.ssh
```

This is giving authorized_keys read and write permissions and giving the ssh directory read, write and execute permissions.
</details>

# 7. (Optional) verifying your ssh access

Exit out of the ssh and run:

```bash
ssh -i ~/.ssh/id_ed25519 YOUR_LEXIQQQ_USERNAME@lexiqqq.com
```

It should ssh you into your lexiqqq account without a password prompt appearing.

# 8. Adding your private key to github secrets

This is the last step !! Run this command (if you get the no such file or dictionary that's because you are still in the ssh, exit ssh first):

```bash
cat ~/.ssh/id_ed25519
```

The output should look something like:

```
-----BEGIN OPENSSH PRIVATE KEY-----
.....................................
.....................................
.....................................
.....................................
...................................==
-----END OPENSSH PRIVATE KEY-----
```

(But instead of dots a random scramble of characters), copy that INCLUDING the -----BEGIN OPENSSH PRIVATE KEY----- and -----END OPENSSH PRIVATE KEY----- into the "Secret *" of your LEXIQQQ_PRIVATE_KEY secret you started making in step 5. It should now look like this without the massive red square:

![](https://I.imgur.com/tpaisrn.png)

Then just press add secret.

# 9. Profit!!

Any changes you make to your github repo will be built and the contents of the build uploaded to your lexiqqq site !!