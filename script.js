function getArticleStore() {
  return window.ARTICLE_CONTENT || { tech: [], writings: [] };
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

function sortByDateDesc(items) {
  const monthMap = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };

  function parseArticleDate(value) {
    const text = String(value || "").trim();
    const custom = text.match(/^(\d{4})-([A-Za-z]{3})-(\d{1,2})$/);
    if (custom) {
      const year = Number(custom[1]);
      const month = monthMap[custom[2].toUpperCase()];
      const day = Number(custom[3]);
      if (Number.isInteger(month)) {
        return Date.UTC(year, month, day);
      }
    }

    const parsed = Date.parse(text);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return [...items].sort(function (a, b) {
    return parseArticleDate(b.date) - parseArticleDate(a.date);
  });
}

function buildArticleUrl(section, id) {
  const params = new URLSearchParams({ section: section, id: id });
  return `article.html?${params.toString()}`;
}

function renderArticleList(section, listId) {
  const list = document.getElementById(listId);
  if (!list) return;

  const store = getArticleStore();
  const items = sortByDateDesc(store[section] || []);
  list.innerHTML = "";

  if (!items.length) {
    const li = document.createElement("li");
    li.className = "list-item";
    li.textContent = "No articles yet.";
    list.appendChild(li);
    return;
  }

  items.forEach(function (item) {
    const li = document.createElement("li");
    li.className = "list-item";

    const date = document.createElement("span");
    date.className = "datetime";
    date.textContent = item.date;

    const link = document.createElement("a");
    link.href = buildArticleUrl(section, item.id);
    link.textContent = item.title;
    link.setAttribute("aria-label", item.title);

    li.appendChild(date);
    li.appendChild(link);
    list.appendChild(li);
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
  const section = params.get("section");
  const id = params.get("id");

  const store = getArticleStore();
  const sectionItems = store[section] || [];
  const article = sectionItems.find(function (item) {
    return item.id === id;
  });

  if (!article) {
    document.title = "Article not found";
    titleEl.textContent = "Article not found";
    metaEl.textContent = "The requested article does not exist.";
    summaryEl.textContent = "";
    contentEl.innerHTML =
      "<p>Check the URL or go back to the homepage sections.</p>";
    backLink.href = "index.html";
    return;
  }

  const sectionLabel = section === "tech" ? "tech" : "writings";
  document.title = `${article.title} | yuro`;
  titleEl.textContent = article.title;
  metaEl.textContent = `${sectionLabel} ・ ${article.date}`;
  summaryEl.textContent = article.summary || "";
  contentEl.innerHTML = markdownToHtml(article.content || "");
  backLink.href = `index.html#${section}`;
}

function bindBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  bindBackToTop();
  renderArticleList("tech", "tech-list");
  renderArticleList("writings", "writings-list");
  renderArticlePage();
});
