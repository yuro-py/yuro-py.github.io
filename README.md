# folio

One file. No build step, no Jekyll, no gems. Open `index.html` in a
browser (double-click works fine) or push it straight to GitHub
Pages — either way looks identical.

## Structure

```
index.html            ← everything: layout, styling, interaction,
                         and your data, all in one file
assets/images/          ← drop your wallpaper.jpg here
README.md
```

## Adding a project

Open `index.html`, find the `PROJECTS` array near the top of the
`<script>` tag, add a line:
```js
{ title: "Project Name", link: "https://github.com/yuro-py/project", date: "21-7-2026" },
```
Leave the array empty (as shipped) and the Projects panel shows
nothing.

## Adding a writing

Same idea, in the `WRITINGS` array right below it:
```js
{ title: "Why Reasoning Models Plateau", link: "https://your-blog.com/post", date: "21-7-2026" },
```
`link` can point anywhere — Substack, Medium, a PDF, another repo's
README, whatever you're actually writing on. This site never hosts
the writing itself, just the redirect card (title + date + link),
same as Projects.

## Editing socials

The `SOCIALS` object, just below `WRITINGS`. Blank out a value and
that icon disappears from the panel. `email` auto-generates a
`mailto:` link.

## Changing the wallpaper

Drop any image into `assets/images/` named `wallpaper.jpg`. To use
a different filename or format, change the one line under
`.wallpaper{ background-image: ... }` near the top of the
`<style>` block.

## Changing colors / fonts

The `:root{ ... }` block at the very top of `<style>` — every color
and font in the whole page is a variable there.

## Deploying

Push this folder to a GitHub repo, then Settings → Pages → deploy
from the `main` branch, root folder. No build step runs — GitHub
just serves `index.html` as-is.
.
# yuro-py.github.io
