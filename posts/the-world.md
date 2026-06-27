# the-world

`the-world` is a civic software idea: public problems should be fileable, discussable, and inspectable like repository issues.

## System Shape

1. Problem reports are structured as records.
2. Comments and votes establish priority.
3. Maintainers or community reviewers label state.
4. Static hosting keeps cost low and auditability high.

| Layer | Tooling |
| --- | --- |
| Frontend | GitHub Pages |
| Automation | GitHub Actions |
| Edge | Cloudflare |
| Persistence | Repository history |

```yaml
issue:
  location: "public"
  category: "infrastructure"
  priority: "community-voted"
  state: "open"
```

::github https://github.com/yuro-py
