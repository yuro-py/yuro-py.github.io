// Single-source article editor.
// Add or edit articles only in this file.
// Keep IDs unique per section and dates in YYYY-MMM-DD format (example: 2026-MAR-25).
window.ARTICLE_CONTENT = {
  tech: [
    {
      id: "sample-tech-one",
      date: "2026-FEB-26",
      title: "Sample tech article 1",
      summary:
        "A compact explanation of scaled dot-product attention and stability tips for implementation.",
      content: `## Why this note
I wanted one page with the core attention intuition and a minimal implementation checklist.

## Core formula
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V

## Practical checks
- Validate tensor shapes early.
- Mask future tokens for causal models.
- Watch softmax saturation when logits get too large.

## Reference
Read the original paper: [Attention Is All You Need](https://arxiv.org/abs/1706.03762).`,
    },
  ],
  writings: [
    {
      id: "sample-writing-one",
      date: "2026-MAR-25",
      title: "Sample writing 1",
      summary:
        "Feature showcase article: image, links, file download, code block, quote, lists, and formatting.",
      content: `## Intro
This is a demo post that shows everything you can do in one article entry.

![Minimal workflow diagram](assets/images/sample-writing-2-banner.svg)

### Formatting examples
- Use **bold** for emphasis.
- Use *italics* for tone.
- Use inline code like \`window.ARTICLE_CONTENT\`.

### Ordered workflow
1. Add a new object inside \`writings\` in \`articles-content.js\`.
2. Fill in \`id\`, \`date\`, \`title\`, \`summary\`, and \`content\`.
3. Refresh the page and your article appears automatically.

> You only edit one file to publish now.

---

## Links
- External link: [OpenAI](https://openai.com/)
- Internal link: [Jump to tech section](index.html#tech)
- Article source file: [Sample resource file](assets/files/sample-writing-2-resource.txt)

## Code block
\`\`\`js
const article = {
  id: "sample-writing-one",
  date: "2026-MAR-25",
  title: "Sample writing 1"
};
\`\`\`

## File attachment
Use this local file link as a template for sharing notes/checklists:
[Download checklist](assets/files/sample-writing-2-checklist.md)`,
    },
    {
      id: "sample-writing-two2",
      date: "2026-MAR-25",
      title: "Sample writing 2",
      summary:
        "A repeatable weekly rhythm for study, implementation, and reflection without burnout.",
      content: `## Intro
      I split work into focused blocks and avoid context switching during each block.

      ## Default routine
      - Two 90-minute deep-work blocks.
      - One block for paper reading.
      - One block for implementation.
      - A short daily review with next-day planning.

      ## Principle
      Consistency compounds faster than intense but irregular effort.

      Useful read: [Deep Work by Cal Newport](https://www.calnewport.com/books/deep-work/).`,
    },
  ],
};
