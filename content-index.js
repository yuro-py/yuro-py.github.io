// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Source markdown lives in content/<section-name>/.
window.CONTENT_INDEX = {
  "sections": [
    {
      "slug": "projects",
      "label": "projects",
      "entries": [
        {
          "id": "2026-feb-25-pytorch_basics",
          "date": "2026-FEB-25",
          "title": "pytorch basics",
          "summary": "Overview",
          "content": "## Overview\nMinimal PyTorch starter project for tensor ops, autograd, and small model training loops.\n\n## Links\n- Repo: [PyTorch Basics](https://github.com/yuro-py/pytorch-basics)"
        },
        {
          "id": "2026-jan-10-karpathy_series",
          "date": "2026-JAN-10",
          "title": "karpathy series",
          "summary": "Overview",
          "content": "## Overview\nCollection of implementations and notes inspired by Karpathy-style deep learning build-from-scratch sessions.\n\n## Links\n- Repo: [Karpathy Series](https://github.com/yuro-py/karpathy-series)"
        }
      ]
    },
    {
      "slug": "tech",
      "label": "tech",
      "entries": [
        {
          "id": "2026-feb-26-sample_tech_article_1",
          "date": "2026-FEB-26",
          "title": "sample tech article 1",
          "summary": "Why this note",
          "content": "## Why this note\nI wanted one page with the core attention intuition and a minimal implementation checklist.\n\n## Core formula\nAttention(Q, K, V) = softmax(QK^T / sqrt(d_k))V\n\n## Practical checks\n- Validate tensor shapes early.\n- Mask future tokens for causal models.\n- Watch softmax saturation when logits get too large.\n\n## Reference\nRead the original paper: [Attention Is All You Need](https://arxiv.org/abs/1706.03762)."
        }
      ]
    },
    {
      "slug": "writings",
      "label": "writings",
      "entries": [
        {
          "id": "2026-mar-25-sample_writing_1",
          "date": "2026-MAR-25",
          "title": "sample writing 1",
          "summary": "Intro",
          "content": "## Intro\nThis is a demo post that shows everything you can do in one article entry.\n\n![Minimal workflow diagram](assets/images/sample-writing-2-banner.svg)\n\n### Formatting examples\n- Use **bold** for emphasis.\n- Use *italics* for tone.\n- Use inline code like `window.CONTENT_INDEX`.\n\n### Ordered workflow\n1. Create or open any folder inside `content/`.\n2. Add file as `YYYY-MON-DD_name_here.md`.\n3. Commit; the generated index updates the site list.\n\n> A new folder becomes a new live section automatically.\n\n---\n\n## Links\n- External link: [OpenAI](https://openai.com/)\n- Internal link: [Jump to tech section](index.html#tech)\n- Article source file: [Sample resource file](assets/files/sample-writing-2-resource.txt)\n\n## Code block\n```js\nconst article = {\n  date: \"2026-MAR-25\",\n  file: \"2026-MAR-25_sample_writing_1.md\"\n};\n```\n\n## File attachment\nUse this local file link as a template for sharing notes/checklists:\n[Download checklist](assets/files/sample-writing-2-checklist.md)"
        },
        {
          "id": "2026-mar-07-sample_markdown_file",
          "date": "2026-MAR-07",
          "title": "sample markdown file",
          "summary": "The Hidden Depths of Markdown",
          "content": "# The Hidden Depths of Markdown  \n*A demonstration article showing the full expressive power of Markdown inside a portfolio website.*\n\n---\n\n## Table of Contents\n\n1. [Introduction](#introduction)\n2. [Text Formatting](#text-formatting)\n3. [Headings](#headings)\n4. [Lists](#lists)\n5. [Links](#links)\n6. [Images](#images)\n7. [Blockquotes](#blockquotes)\n8. [Code Blocks](#code-blocks)\n9. [Tables](#tables)\n10. [Task Lists](#task-lists)\n11. [Mathematics (LaTeX)](#mathematics-latex)\n12. [Footnotes](#footnotes)\n13. [Collapsible Sections](#collapsible-sections)\n14. [Horizontal Rules](#horizontal-rules)\n15. [HTML in Markdown](#html-in-markdown)\n16. [Diagrams (Mermaid)](#diagrams-mermaid)\n17. [Keyboard Keys](#keyboard-keys)\n18. [Highlighted Text](#highlighted-text)\n19. [Abbreviations](#abbreviations)\n20. [Conclusion](#conclusion)\n\n---\n\n# Introduction\n\nMarkdown is often mistaken for a **simple note-taking syntax**, but modern Markdown renderers support a large ecosystem of extensions.\n\nWhen used properly, Markdown can power:\n\n- technical documentation\n- blog posts\n- academic articles\n- developer portfolios\n- knowledge bases\n- project documentation\n\nThis file intentionally demonstrates **as many Markdown capabilities as possible** so the rendering on a portfolio site can be evaluated.\n\n---\n\n# Text Formatting\n\nMarkdown supports multiple inline formatting styles.\n\n**Bold text**\n\n*Italic text*\n\n***Bold + Italic***\n\n~~Strikethrough~~\n\n`inline code`\n\n<u>Underline using HTML</u>\n\nSmall text using HTML:\n\n<small>This is smaller text.</small>\n\nSuperscript: X<sup>2</sup>\n\nSubscript: H<sub>2</sub>O\n\n---\n\n# Headings\n\nMarkdown supports hierarchical document structures.\n\n# Heading Level 1\n## Heading Level 2\n### Heading Level 3\n#### Heading Level 4\n##### Heading Level 5\n###### Heading Level 6\n\nThese help search engines and readers navigate the document structure.\n\n---\n\n# Lists\n\n## Unordered Lists\n\n- Item one\n- Item two\n- Item three\n\nNested lists:\n\n- Programming\n  - Python\n  - C++\n  - Rust\n- Machine Learning\n  - Deep Learning\n  - Reinforcement Learning\n\n---\n\n## Ordered Lists\n\n1. First step\n2. Second step\n3. Third step\n\nNested ordered list:\n\n1. Preparation\n   1. Install tools\n   2. Configure environment\n2. Execution\n3. Deployment\n\n---\n\n# Links\n\nStandard hyperlink:\n\n[Visit GitHub](https://github.com)\n\nReference-style link:\n\n[OpenAI][openai]\n\n[openai]: https://openai.com\n\nAutolink:\n\nhttps://example.com\n\n---\n\n# Images\n\nMarkdown images:\n\n![Placeholder Image](https://picsum.photos/800/300)\n\nImage with caption using HTML:\n\n<figure>\n<img src=\"https://picsum.photos/700/250\">\n<figcaption>Example image rendered inside markdown</figcaption>\n</figure>\n\n---\n\n# Blockquotes\n\n> Markdown supports blockquotes.\n>\n> These are commonly used for:\n> - quotes\n> - notes\n> - documentation highlights\n\nNested quote:\n\n> Outer quote\n>> Inner quote\n\n---\n\n# Code Blocks\n\n## Inline Code\n\nExample: `pip install torch`\n\n---\n\n## Python Example\n\n```python\nimport torch\n\nclass TinyModel(torch.nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.linear = torch.nn.Linear(10, 1)\n\n    def forward(self, x):\n        return self.linear(x)\n\nmodel = TinyModel()\nprint(model)"
        }
      ]
    },
    {
      "slug": "extra",
      "label": "extra",
      "entries": []
    }
  ]
};
