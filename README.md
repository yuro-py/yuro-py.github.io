# Portfolio

Edit the `CATALOG` array in `index.html` to change the work list.

## Add a link or repository

Add an entry with a title, date, short description, and URL:

```js
{
  title: 'Project name',
  date: '30-10-2026',
  desc: 'Short summary',
  link: 'https://github.com/your-name/project'
}
```

## Add an in-app blog

1. Create a `.md` file in `blogs/` with `title`, `date`, and `description` frontmatter.
2. Add a catalog entry with `file`, `title`, `date`, and `desc`.
3. To show the post when `index.html` is opened directly as `file://`, add its Markdown body as the entry's `body` string and keep it in sync with the `.md` file. Otherwise, run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`.

## Remove content

Delete the matching entry from `CATALOG`. For an in-app blog, also delete its `.md` file from `blogs/` if it is no longer needed. For a link or repository, remove its catalog entry.
