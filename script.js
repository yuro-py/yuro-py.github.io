function getContentIndex() {
  return window.CONTENT_INDEX || { sections: [] };
}

function getSections() {
  return getContentIndex().sections || [];
}

function findSectionBySlug(slug) {
  return getSections().find(function (section) {
    return section.slug === slug;
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatEmphasis(escapedText) {
  return escapedText
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderInlineMarkdown(text) {
  const source = String(text || "");
  const tokenRegex =
    /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;
  let output = "";
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(source)) !== null) {
    output += formatEmphasis(escapeHtml(source.slice(lastIndex, match.index)));

    if (match[1] !== undefined && match[2] !== undefined) {
      const alt = escapeHtml(match[1] || "");
      const imageUrl = escapeHtml(match[2]);
      output += `<img src="${imageUrl}" alt="${alt}" loading="lazy" />`;
    } else if (match[3] !== undefined && match[4] !== undefined) {
      const label = escapeHtml(match[3]);
      const url = escapeHtml(match[4]);
      const external = /^https?:\/\//i.test(match[4]);
      const localFile =
        !external && /\.(txt|md|pdf|zip|csv|json)$/i.test(match[4]);
      const extraAttrs = external
        ? ' target="_blank" rel="noopener noreferrer"'
        : localFile
          ? " download"
          : "";
      output += `<a href="${url}"${extraAttrs}>${label}</a>`;
    } else if (match[5] !== undefined) {
      output += `<code>${escapeHtml(match[5])}</code>`;
    }

    lastIndex = match.index + match[0].length;
  }

  output += formatEmphasis(escapeHtml(source.slice(lastIndex)));
  return output;
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "")
    .replace(/\r\n/g, "\n")
    .split("\n");
  const html = [];
  let listType = "";
  let inCode = false;
  let codeLang = "";
  let codeLines = [];
  let paragraph = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    html.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function openList(type) {
    if (listType === type) return;
    if (listType) {
      html.push(`</${listType}>`);
    }
    html.push(`<${type}>`);
    listType = type;
  }

  function closeList() {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = "";
  }

  function closeCode() {
    if (!inCode) return;
    const className = codeLang
      ? ` class="language-${escapeHtml(codeLang)}"`
      : "";
    html.push(
      `<pre><code${className}>${escapeHtml(codeLines.join("\n"))}</code></pre>`,
    );
    inCode = false;
    codeLang = "";
    codeLines = [];
  }

  lines.forEach(function (line) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushParagraph();
      closeList();
      if (inCode) {
        closeCode();
      } else {
        inCode = true;
        codeLang = trimmed.replace("```", "").trim();
      }
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    if (!trimmed) {
      flushParagraph();
      closeList();
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      closeList();
      html.push(`<h2>${renderInlineMarkdown(trimmed.slice(3))}</h2>`);
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      closeList();
      html.push(`<h3>${renderInlineMarkdown(trimmed.slice(4))}</h3>`);
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph();
      closeList();
      html.push(`<h1>${renderInlineMarkdown(trimmed.slice(2))}</h1>`);
      return;
    }

    if (trimmed === "---") {
      flushParagraph();
      closeList();
      html.push("<hr />");
      return;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      closeList();
      html.push(
        `<blockquote>${renderInlineMarkdown(trimmed.slice(2))}</blockquote>`,
      );
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      openList("ul");
      html.push(`<li>${renderInlineMarkdown(trimmed.slice(2))}</li>`);
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      openList("ol");
      html.push(
        `<li>${renderInlineMarkdown(trimmed.replace(/^\d+\.\s+/, ""))}</li>`,
      );
      return;
    }

    paragraph.push(trimmed);
  });

  flushParagraph();
  closeList();
  closeCode();

  return html.join("\n");
}

function buildArticleUrl(sectionSlug, articleId) {
  const params = new URLSearchParams({ section: sectionSlug, id: articleId });
  return `article.html?${params.toString()}`;
}

function buildSectionElement(section) {
  const sectionEl = document.createElement("section");
  sectionEl.id = section.slug;

  const heading = document.createElement("h2");
  heading.className = "section-title";
  heading.textContent = section.label;
  sectionEl.appendChild(heading);

  const list = document.createElement("ul");
  list.className = "list";

  if (!section.entries.length) {
    const li = document.createElement("li");
    li.className = "list-item";
    li.textContent = "No articles yet.";
    list.appendChild(li);
  } else {
    section.entries.forEach(function (entry) {
      const li = document.createElement("li");
      li.className = "list-item";

      const date = document.createElement("span");
      date.className = "datetime";
      date.textContent = entry.date;

      const link = document.createElement("a");
      link.href = buildArticleUrl(section.slug, entry.id);
      link.textContent = entry.title;
      link.setAttribute("aria-label", entry.title);

      li.appendChild(date);
      li.appendChild(link);
      list.appendChild(li);
    });
  }

  sectionEl.appendChild(list);
  return sectionEl;
}

function renderHomepageSections() {
  const container = document.getElementById("content-sections");
  if (!container) return;

  const sections = getSections();
  container.innerHTML = "";

  sections.forEach(function (section) {
    container.appendChild(buildSectionElement(section));
  });
}

function renderArticlePage() {
  const page = document.getElementById("article-page");
  if (!page) return;

  const titleEl = document.getElementById("article-title");
  const metaEl = document.getElementById("article-meta");
  const summaryEl = document.getElementById("article-summary");
  const contentEl = document.getElementById("article-content");
  const backLink = document.getElementById("article-back-link");

  const params = new URLSearchParams(window.location.search);
  const sectionSlug = params.get("section");
  const articleId = params.get("id");
  const section = findSectionBySlug(sectionSlug);
  const article = section
    ? section.entries.find(function (entry) {
        return entry.id === articleId;
      })
    : null;

  if (!section || !article) {
    document.title = "Article not found";
    titleEl.textContent = "Article not found";
    metaEl.textContent = "The requested article does not exist.";
    summaryEl.textContent = "";
    contentEl.innerHTML =
      "<p>Check the URL or go back to the homepage sections.</p>";
    backLink.href = "index.html";
    return;
  }

  document.title = `${article.title} | yuro`;
  titleEl.textContent = article.title;
  metaEl.textContent = `${section.label} ・ ${article.date}`;
  summaryEl.textContent = article.summary || "";
  contentEl.innerHTML = markdownToHtml(article.content || "");
  backLink.href = `index.html#${section.slug}`;
}

function bindBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener("click", function (event) {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  bindBackToTop();
  renderHomepageSections();
  renderArticlePage();
});
