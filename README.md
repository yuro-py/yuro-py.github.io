# Portfolio

The work list lives in the `CATALOG` array near the top of the script in `index.html`. Add either a bare URL string or a Markdown filename string:

```js
'https://example.com/project',
'my-new-post.md'
```

Put blog files in `blogs/`. The page reads each blog's `title`, `date`, and `description` from its frontmatter and renders the body as GitHub-flavored Markdown. A bare external URL gets its title from the last part of the URL. Use an object with `title`, `date`, `desc`, and `link` when you want a custom label and summary; the existing entries use that format.

When opening `index.html` directly as `file://`, the work list appears immediately. `hello-world.md` and `serving-agentic-workload-on-rtx-5090-with-qwen3-8-27B.md` have inline preview fallbacks in the catalog. For other blogs, open the portfolio through a local web server so the browser can load Markdown files: run `python3 -m http.server 8000` from this folder and visit `http://localhost:8000`. Browsers do not let a local page silently read neighboring Markdown files.
