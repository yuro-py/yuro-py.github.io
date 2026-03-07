# The Hidden Depths of Markdown  
*A demonstration article showing the full expressive power of Markdown inside a portfolio website.*

---

## Table of Contents

1. [Introduction](#introduction)
2. [Text Formatting](#text-formatting)
3. [Headings](#headings)
4. [Lists](#lists)
5. [Links](#links)
6. [Images](#images)
7. [Blockquotes](#blockquotes)
8. [Code Blocks](#code-blocks)
9. [Tables](#tables)
10. [Task Lists](#task-lists)
11. [Mathematics (LaTeX)](#mathematics-latex)
12. [Footnotes](#footnotes)
13. [Collapsible Sections](#collapsible-sections)
14. [Horizontal Rules](#horizontal-rules)
15. [HTML in Markdown](#html-in-markdown)
16. [Diagrams (Mermaid)](#diagrams-mermaid)
17. [Keyboard Keys](#keyboard-keys)
18. [Highlighted Text](#highlighted-text)
19. [Abbreviations](#abbreviations)
20. [Conclusion](#conclusion)

---

# Introduction

Markdown is often mistaken for a **simple note-taking syntax**, but modern Markdown renderers support a large ecosystem of extensions.

When used properly, Markdown can power:

- technical documentation
- blog posts
- academic articles
- developer portfolios
- knowledge bases
- project documentation

This file intentionally demonstrates **as many Markdown capabilities as possible** so the rendering on a portfolio site can be evaluated.

---

# Text Formatting

Markdown supports multiple inline formatting styles.

**Bold text**

*Italic text*

***Bold + Italic***

~~Strikethrough~~

`inline code`

<u>Underline using HTML</u>

Small text using HTML:

<small>This is smaller text.</small>

Superscript: X<sup>2</sup>

Subscript: H<sub>2</sub>O

---

# Headings

Markdown supports hierarchical document structures.

# Heading Level 1
## Heading Level 2
### Heading Level 3
#### Heading Level 4
##### Heading Level 5
###### Heading Level 6

These help search engines and readers navigate the document structure.

---

# Lists

## Unordered Lists

- Item one
- Item two
- Item three

Nested lists:

- Programming
  - Python
  - C++
  - Rust
- Machine Learning
  - Deep Learning
  - Reinforcement Learning

---

## Ordered Lists

1. First step
2. Second step
3. Third step

Nested ordered list:

1. Preparation
   1. Install tools
   2. Configure environment
2. Execution
3. Deployment

---

# Links

Standard hyperlink:

[Visit GitHub](https://github.com)

Reference-style link:

[OpenAI][openai]

[openai]: https://openai.com

Autolink:

https://example.com

---

# Images

Markdown images:

![Placeholder Image](https://picsum.photos/800/300)

Image with caption using HTML:

<figure>
<img src="https://picsum.photos/700/250">
<figcaption>Example image rendered inside markdown</figcaption>
</figure>

---

# Blockquotes

> Markdown supports blockquotes.
>
> These are commonly used for:
> - quotes
> - notes
> - documentation highlights

Nested quote:

> Outer quote
>> Inner quote

---

# Code Blocks

## Inline Code

Example: `pip install torch`

---

## Python Example

```python
import torch

class TinyModel(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.linear = torch.nn.Linear(10, 1)

    def forward(self, x):
        return self.linear(x)

model = TinyModel()
print(model)
