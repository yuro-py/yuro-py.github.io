// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Source markdown lives in content/projects, content/tech, content/writings.
window.CONTENT_INDEX = {
  "projects": [
    {
      "id": "2026-feb-25-pytorch_basics",
      "date": "2026-FEB-25",
      "title": "pytorch basics",
      "summary": "Overview",
      "content": "## Overview\nMinimal PyTorch starter project for tensor ops, autograd, and small model training loops.\n\n## Links\n- Repo: [PyTorch Basics](https://github.com/yuro-py/pytorch-basics)",
      "sourceFile": "content/projects/2026-FEB-25_pytorch_basics.md"
    },
    {
      "id": "2026-jan-10-karpathy_series",
      "date": "2026-JAN-10",
      "title": "karpathy series",
      "summary": "Overview",
      "content": "## Overview\nCollection of implementations and notes inspired by Karpathy-style deep learning build-from-scratch sessions.\n\n## Links\n- Repo: [Karpathy Series](https://github.com/yuro-py/karpathy-series)",
      "sourceFile": "content/projects/2026-JAN-10_karpathy_series.md"
    }
  ],
  "tech": [
    {
      "id": "2026-feb-27-sample_tech_article_2",
      "date": "2026-FEB-27",
      "title": "sample tech article 2",
      "summary": "Heading",
      "content": "## Heading\nI am bored.",
      "sourceFile": "content/tech/2026-FEB-27_sample_tech_article_2.md"
    },
    {
      "id": "2026-feb-26-sample_tech_article_1",
      "date": "2026-FEB-26",
      "title": "sample tech article 1",
      "summary": "Why this note",
      "content": "## Why this note\nI wanted one page with the core attention intuition and a minimal implementation checklist.\n\n## Core formula\nAttention(Q, K, V) = softmax(QK^T / sqrt(d_k))V\n\n## Practical checks\n- Validate tensor shapes early.\n- Mask future tokens for causal models.\n- Watch softmax saturation when logits get too large.\n\n## Reference\nRead the original paper: [Attention Is All You Need](https://arxiv.org/abs/1706.03762).",
      "sourceFile": "content/tech/2026-FEB-26_sample_tech_article_1.md"
    }
  ],
  "writings": [
    {
      "id": "2026-mar-26-sample_writing_2",
      "date": "2026-MAR-26",
      "title": "sample writing 2",
      "summary": "Intro",
      "content": "## Intro\nI split work into focused blocks and avoid context switching during each block.\n\n## Default routine\n- Two 90-minute deep-work blocks.\n- One block for paper reading.\n- One block for implementation.\n- A short daily review with next-day planning.\n\n## Principle\nConsistency compounds faster than intense but irregular effort.\n\nUseful read: [Deep Work by Cal Newport](https://www.calnewport.com/books/deep-work/).",
      "sourceFile": "content/writings/2026-MAR-26_sample_writing_2.md"
    },
    {
      "id": "2026-mar-25-sample_writing_1",
      "date": "2026-MAR-25",
      "title": "sample writing 1",
      "summary": "Intro",
      "content": "## Intro\nThis is a demo post that shows everything you can do in one article entry.\n\n![Minimal workflow diagram](assets/images/sample-writing-2-banner.svg)\n\n### Formatting examples\n- Use **bold** for emphasis.\n- Use *italics* for tone.\n- Use inline code like `window.CONTENT_INDEX`.\n\n### Ordered workflow\n1. Open desired section folder.\n2. Add file as `YYYY-MON-DD_name_here.md`.\n3. Commit; the generated index updates the site list.\n\n> You only edit markdown files to publish now.\n\n---\n\n## Links\n- External link: [OpenAI](https://openai.com/)\n- Internal link: [Jump to tech section](index.html#tech)\n- Article source file: [Sample resource file](assets/files/sample-writing-2-resource.txt)\n\n## Code block\n```js\nconst article = {\n  date: \"2026-MAR-25\",\n  file: \"2026-MAR-25_sample_writing_1.md\"\n};\n```\n\n## File attachment\nUse this local file link as a template for sharing notes/checklists:\n[Download checklist](assets/files/sample-writing-2-checklist.md)",
      "sourceFile": "content/writings/2026-MAR-25_sample_writing_1.md"
    }
  ]
};
