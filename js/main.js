/* ==========================================
   yuro Portfolio - Core JavaScript Application
   ========================================== */

// Simple in-memory state variables
let currentSection = null; // 'projects', 'technicals', 'writeups'
let currentPostId = null;  // Active blog post ID

// Theme Configuration
const THEMES = ['sunset', 'midnight'];
let currentTheme = localStorage.getItem('blog-theme') || 'sunset';
if (!THEMES.includes(currentTheme)) {
  currentTheme = 'sunset';
}

// Section Subtitles
const SUBTITLES = {
  'technicals': 'My experiments, implementations and observations',
  'writeups': 'Scratchpad for other stuff'
};

// DOM Element References
let homeView, blogView, bgVideo;
let navProjects, navTechnicals, navWriteups, navSocials, socialsDropdown;
let sectionOverlay, overlayTitle, overlayList, closeOverlay;
let btnBackHome, btnBackList, blogReadContainer;
let blogPostContent;
let btnThemeToggle;

// Initialize Application
function init() {
  if (window.location.protocol === 'file:') {
    window.location.replace('http://localhost:8000');
    return;
  }

  // Register Service Worker for PWA support
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('[Service Worker] Registered successfully with scope:', reg.scope))
        .catch((err) => console.error('[Service Worker] Registration failed:', err));
    });
  }

  // Query references dynamically to guarantee DOM is fully parsed
  homeView = document.getElementById('home-view');
  blogView = document.getElementById('blog-view');
  bgVideo = document.getElementById('bg-video');

  navProjects = document.getElementById('nav-projects');
  navTechnicals = document.getElementById('nav-technicals');
  navWriteups = document.getElementById('nav-writeups');
  navSocials = document.getElementById('nav-socials');
  socialsDropdown = document.getElementById('socials-dropdown');

  sectionOverlay = document.getElementById('section-overlay');
  overlayTitle = document.getElementById('section-overlay-title');
  overlayList = document.getElementById('overlay-list');
  closeOverlay = document.getElementById('close-overlay');

  btnBackHome = document.getElementById('btn-back-home');
  btnBackList = document.getElementById('btn-back-list');
  btnThemeToggle = document.getElementById('btn-theme-toggle');
  blogReadContainer = document.getElementById('blog-read-container');
  blogPostContent = document.getElementById('blog-post-content');

  // Dynamic Background System: randomly select one of the WebM files shifted to the backgrounds/ folder
  if (bgVideo) {
    const backgrounds = [
      'backgrounds/anime_boy_bed_rest_phone.webm',
      'backgrounds/batman_test.webm',
      'backgrounds/pinterest_gif_1782647478.webm',
      'backgrounds/cyberpunk_wire_trains.webm'
    ];
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const sourceEl = bgVideo.querySelector('source');
    if (sourceEl) {
      sourceEl.src = randomBg;
    } else {
      bgVideo.src = randomBg;
    }
    bgVideo.load();
  }

  // Apply saved theme
  applyTheme();

  // Bind all event listeners
  setupEventListeners();

  // Try to play background video on start
  if (bgVideo) {
    bgVideo.play().catch(() => {
      // Fallback autoplay handler
      const playOnInteract = () => {
        bgVideo.play().catch(() => {});
        document.removeEventListener('click', playOnInteract);
        document.removeEventListener('keydown', playOnInteract);
      };
      document.addEventListener('click', playOnInteract);
      document.addEventListener('keydown', playOnInteract);
    });
  }
}

// Apply Selected CSS Theme to Blog View
function applyTheme() {
  if (!blogView) return;
  
  // Clean all custom theme classes
  blogView.classList.remove('blog-theme-sunset', 'blog-theme-midnight');
  
  // Apply specific classes (sunset is now the default theme)
  if (currentTheme === 'sunset') {
    blogView.classList.add('blog-theme-sunset');
  } else if (currentTheme === 'midnight') {
    blogView.classList.add('blog-theme-midnight');
  }

  // Update theme button label and icon if available
  if (btnThemeToggle) {
    const labelSpan = btnThemeToggle.querySelector('span');
    if (labelSpan) {
      labelSpan.textContent = `Theme: ${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`;
    }
    
    // Update theme icon (sunset shows sun, midnight shows moon)
    const existingSvg = btnThemeToggle.querySelector('svg');
    if (existingSvg) {
      if (currentTheme === 'sunset') {
        existingSvg.innerHTML = `<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>`;
      } else {
        existingSvg.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
      }
    }
  }
}

// Cycle to next theme
function toggleTheme() {
  const currentIdx = THEMES.indexOf(currentTheme);
  currentTheme = THEMES[(currentIdx + 1) % THEMES.length];
  localStorage.setItem('blog-theme', currentTheme);
  applyTheme();
}

// Attach event listeners safely checking for element existence
function setupEventListeners() {
  if (navProjects) {
    navProjects.addEventListener('click', () => {
      openSectionOverlay('projects');
    });
  }

  if (navTechnicals) {
    navTechnicals.addEventListener('click', () => {
      openSectionOverlay('technicals');
    });
  }

  if (navWriteups) {
    navWriteups.addEventListener('click', () => {
      openSectionOverlay('writeups');
    });
  }

  if (navSocials && socialsDropdown) {
    navSocials.addEventListener('click', (e) => {
      e.stopPropagation();
      socialsDropdown.classList.toggle('show');
    });
  }

  document.addEventListener('click', () => {
    if (socialsDropdown) socialsDropdown.classList.remove('show');
  });

  if (closeOverlay) {
    closeOverlay.addEventListener('click', closeSectionOverlay);
  }

  if (sectionOverlay) {
    sectionOverlay.addEventListener('click', (e) => {
      if (e.target === sectionOverlay) {
        closeSectionOverlay();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSectionOverlay();
      if (socialsDropdown) socialsDropdown.classList.remove('show');
    }
  });

  if (btnBackHome) {
    btnBackHome.addEventListener('click', () => {
      closeSectionOverlay();
      navigateToHome();
    });
  }

  if (btnBackList) {
    btnBackList.addEventListener('click', () => {
      navigateToHome();
      if (currentSection) {
        openSectionOverlay(currentSection);
      }
    });
  }

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', toggleTheme);
  }
}

// --- Blog Navigation & Rendering ---
function navigateToHome() {
  currentPostId = null;

  if (blogView) blogView.classList.remove('active');
  if (homeView) homeView.classList.add('active');

  // Resume background video if homescreen is active
  if (bgVideo) bgVideo.play().catch(() => {});
}

function navigateToPost(section, postId) {
  currentSection = section;
  currentPostId = postId;

  // Pause video to conserve CPU/GPU
  if (bgVideo) bgVideo.pause();

  if (homeView) homeView.classList.remove('active');
  if (blogView) blogView.classList.add('active');

  if (blogPostContent) {
    blogPostContent.innerHTML = '<div class="blog-status">Fetching record contents...</div>';
  }

  renderBlogPost(section, postId);
}

// Helper function to safely decode base64 to UTF-8 string
// --- Content Index Helper & Parser ---
// Helper function to capitalize/format title from filename
function formatTitleFromFilename(filename) {
  let base = filename.replace(/\.md$/, '');
  let words = base.replace(/[_-]/g, ' ').split(' ');
  return words.map(word => {
    if (/[a-z]/.test(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  }).join(' ');
}

// Helper to parse date and content from article text
function parseArticleFile(text, filename) {
  const lines = text.split('\n');
  let date = '';
  let contentStartIndex = 0;
  
  if (lines.length > 0 && lines[0].startsWith('Date:')) {
    date = lines[0].replace(/^Date:\s*/i, '').trim();
    contentStartIndex = 1;
    while (contentStartIndex < lines.length && lines[contentStartIndex].trim() === '') {
      contentStartIndex++;
    }
  }
  
  const content = lines.slice(contentStartIndex).join('\n');
  const title = formatTitleFromFilename(filename);
  
  return {
    title,
    date,
    content
  };
}

// Date parsing for sorting
const MONTHS = {
  'JAN': 0, 'FEB': 1, 'MAR': 2, 'MARCH': 2, 'APR': 3, 'APRIL': 3,
  'MAY': 4, 'JUN': 5, 'JUNE': 5, 'JUL': 6, 'JULY': 6, 'AUG': 7, 'AUGUST': 7,
  'SEP': 8, 'SEPTEMBER': 8, 'OCT': 9, 'OCTOBER': 9, 'NOV': 10, 'NOVEMBER': 10, 'DEC': 11, 'DECEMBER': 11
};

function parseDateString(dateStr) {
  if (!dateStr) return new Date(0);
  const parts = dateStr.toUpperCase().split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = MONTHS[parts[1]] !== undefined ? MONTHS[parts[1]] : 0;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

// Global cache for loaded entries to avoid redundant fetches
const ENTRIES_CACHE = {};

async function getEntriesForSlug(slug) {
  const contentIndex = window.CONTENT_INDEX || { sections: [] };
  const section = contentIndex.sections.find(s => s.slug === slug);
  if (!section) return [];

  if (slug === 'projects') {
    return section.entries || [];
  }

  if (ENTRIES_CACHE[slug]) {
    return ENTRIES_CACHE[slug];
  }

  const files = section.files || [];
  const folder = slug === 'technicals' ? 'Technicals' : 'Writeups';

  const entries = await Promise.all(files.map(async (filename) => {
    const fileUrl = `content/${folder}/${filename}`;
    const id = filename.replace(/\.md$/, '').toLowerCase().replace(/[_-]/g, '-');
    try {
      const res = await fetch(fileUrl, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const text = await res.text();
      const parsed = parseArticleFile(text, filename);
      return {
        id,
        title: parsed.title,
        date: parsed.date,
        content: parsed.content,
        file: fileUrl
      };
    } catch (err) {
      console.error(`Error loading ${fileUrl}:`, err);
      return {
        id,
        title: formatTitleFromFilename(filename),
        date: '',
        content: `### Failed to load content\n\nCould not fetch file at \`${fileUrl}\`. Ensure the local HTTP server is running.`,
        file: fileUrl
      };
    }
  }));

  // Sort entries by date (newest on top)
  entries.sort((a, b) => parseDateString(b.date) - parseDateString(a.date));

  ENTRIES_CACHE[slug] = entries;
  return entries;
}

// --- Section Navigation & Rendering (Overlay) ---
async function openSectionOverlay(section) {
  if (sectionOverlay) {
    currentSection = section;
    
    // Set title
    const contentIndex = window.CONTENT_INDEX || { sections: [] };
    const secObj = contentIndex.sections.find(s => s.slug === section);
    if (overlayTitle) {
      overlayTitle.textContent = secObj ? secObj.label : (section === 'technicals' ? 'Technicals' : (section === 'writeups' ? 'Writeups' : 'Projects'));
    }

    sectionOverlay.classList.add('open');

    // Resume background video if playing
    if (bgVideo) bgVideo.play().catch(() => {});

    // Populate list with a loader
    if (overlayList) {
      overlayList.innerHTML = '<div class="blog-status">Loading logs & modules...</div>';
    }

    try {
      const entries = await getEntriesForSlug(section);
      renderOverlayList(entries, section);
    } catch (err) {
      if (overlayList) {
        overlayList.innerHTML = `<div class="blog-status" style="color:var(--blog-txt-muted);">Failed to load section: ${err.message}</div>`;
      }
    }
  }
}

// Close section modal overlay
function closeSectionOverlay() {
  if (sectionOverlay) {
    sectionOverlay.classList.remove('open');
  }
}



function extractFirstLink(markdown) {
  if (!markdown) return '#';
  const match = /\[[^\]]+\]\((https?:\/\/[^)]+)\)/.exec(markdown);
  return match ? match[1] : '#';
}

function renderOverlayList(entries, section) {
  if (!overlayList) return;

  if (entries.length === 0) {
    overlayList.innerHTML = '<div class="blog-status">Nothing here yet — check back soon.</div>';
    return;
  }

  overlayList.innerHTML = '';
  entries.forEach(entry => {
    if (section === 'projects') {
      const url = entry.url || extractFirstLink(entry.content);

      const card = document.createElement('div');
      card.className = 'project-card-item';
      card.style.cursor = 'pointer';
      
      card.addEventListener('click', () => {
        window.open(url, '_blank');
      });

      card.innerHTML = `
        <div class="project-link-header">
          <span class="project-title-link">
            ${entry.title}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </span>
          <span class="project-meta-label">${entry.date || 'Project'}</span>
        </div>
        <p class="project-desc">${entry.summary || ''}</p>
        <div class="project-external-url" style="margin-top: 10px; font-family: var(--font-mono); font-size: 11px; color: var(--home-accent); opacity: 0.85; word-break: break-all;">
          <a href="${url}" target="_blank" rel="noopener noreferrer" style="border-bottom: 1px solid rgba(109, 168, 216, 0.3); padding-bottom: 2px;">${url}</a>
        </div>
      `;

      const linkNode = card.querySelector('.project-external-url a');
      if (linkNode) {
        linkNode.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      overlayList.appendChild(card);
    } else {
      const card = document.createElement('div');
      card.className = 'project-card-item';
      card.style.cursor = 'pointer';
      
      card.addEventListener('click', () => {
        closeSectionOverlay();
        navigateToPost(section, entry.id);
      });

      card.innerHTML = `
        <div class="project-link-header">
          <span class="project-title-link">
            ${entry.title}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
          <span class="project-meta-label">${entry.date || ''}</span>
        </div>
      `;

      overlayList.appendChild(card);
    }
  });
}

// --- Blog Navigation & Rendering ---
function navigateToHome() {
  currentPostId = null;

  if (blogView) blogView.classList.remove('active');
  if (homeView) homeView.classList.add('active');

  // Resume background video if homescreen is active
  if (bgVideo) bgVideo.play().catch(() => {});
}

function navigateToPost(section, postId) {
  currentSection = section;
  currentPostId = postId;

  // Pause video to conserve CPU/GPU
  if (bgVideo) bgVideo.pause();

  if (homeView) homeView.classList.remove('active');
  if (blogView) blogView.classList.add('active');

  if (blogPostContent) {
    blogPostContent.innerHTML = '<div class="blog-status">Fetching record contents...</div>';
  }

  renderBlogPost(section, postId);
}

// --- Fetch and Render Markdown Post ---
async function renderBlogPost(section, postId) {
  if (!blogPostContent) return;

  try {
    const posts = await getEntriesForSlug(section);
    const item = posts.find(p => p.id === postId);

    if (!item) {
      blogPostContent.innerHTML = '<div class="blog-status">Error: Document metadata not found.</div>';
      return;
    }

    const markdown = item.content || '';
    const postUrl = item.file;

    // Set assetBase to the folder of the file (e.g. content/Tech) if not defined
    const assetBase = postUrl.substring(0, postUrl.lastIndexOf('/'));
    
    // Always prepend the article title on top and strip any duplicate H1 inside content
    let cleanMarkdown = markdown;
    if (markdown.trim().startsWith('# ')) {
      // Remove the first H1 line
      cleanMarkdown = markdown.replace(/^\s*#\s+.*$/m, '');
    }
    
    // Render markdown content
    let processedHtml = parseMarkdown(cleanMarkdown, assetBase);
    processedHtml = `<h1 class="blog-post-title" style="margin-top: 0; font-size: 32px; border-bottom: 1px solid var(--blog-border); padding-bottom: 8px; font-weight: 700; color: var(--blog-heading);">${item.title}</h1>${processedHtml}`;
    
    blogPostContent.innerHTML = processedHtml;

    // Inject date into the reader header (opposite the "Back to List" button)
    const blogReadDate = document.getElementById('blog-read-date');
    if (blogReadDate) {
      blogReadDate.textContent = item.date || '';
    }

    // Run highlight.js & KaTeX rendering pipeline
    decorateLinks(blogPostContent);
    highlightCode(blogPostContent);
    renderEquations(blogPostContent);

    // Scroll to the top of the reading panel smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Error rendering blog post:', error);
    blogPostContent.innerHTML = `<div class="blog-status">Error parsing document: ${error.message}</div>`;
  }
}

// --- Markdown Parsers & Formatting ---
function resolveAssetUrls(markdown, assetBase) {
  if (!assetBase) return markdown;

  // Resolves relative image markdown syntax (e.g., `![alt](files/pic.jpg)` -> `![alt](content/Tech/files/pic.jpg)`)
  return markdown.replace(/(!\[[^\]]*\]\()([^)]+)(\))/g, (match, prefix, url, suffix) => {
    const trimmed = url.trim();
    if (/^(?:[a-z]+:|\/|#)/i.test(trimmed)) return match;
    if (/^(?:assets\/|content\/)/i.test(trimmed)) return match;
    return `${prefix}${assetBase}/${trimmed}${suffix}`;
  });
}

function parseMarkdown(markdown, assetBase) {
  // Preprocess relative image files
  let processedMarkdown = resolveAssetUrls(markdown, assetBase);

  // Parse custom github link embeds (e.g., `::github https://github.com/...`)
  let expanded = processedMarkdown.replace(/^::github\s+(https:\/\/github\.com\/[^\s]+)\s*$/gm, (_, url) => {
    const label = url.replace('https://github.com/', '');
    return `<a class="github-embed" href="${url}" target="_blank" rel="noreferrer"><strong>${label}</strong><span>GitHub repository / profile reference</span></a>`;
  });

  if (!window.marked) {
    return `<div class="blog-status">Error: Marked library not loaded.</div>`;
  }

  // Parse markdown text using marked.js
  const rawHtml = window.marked.parse(expanded, { gfm: true, breaks: false });

  // Sanitize using DOMPurify
  if (window.DOMPurify) {
    return window.DOMPurify.sanitize(rawHtml, {
      ADD_ATTR: ['target', 'rel', 'class'],
      ADD_TAGS: ['iframe']
    });
  }

  return rawHtml;
}

function decorateLinks(root) {
  root.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (/^https?:\/\//.test(href)) {
      link.target = '_blank';
      link.rel = 'noreferrer';
    }
  });
}

function highlightCode(root) {
  if (!window.hljs) return;
  root.querySelectorAll('pre code').forEach(block => {
    window.hljs.highlightElement(block);
  });
}

// Render math equations via KaTeX
function renderEquations(root) {
  if (!window.renderMathInElement) return;
  window.renderMathInElement(root, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true }
    ],
    throwOnError: false
  });
}

// Listen for document load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
