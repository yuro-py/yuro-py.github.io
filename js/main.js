/* ==========================================
   yuro Portfolio - Core JavaScript Application
   ========================================== */

// Simple in-memory state variables
let currentSection = null; // 'projects', 'tech', 'writings'
let currentPostId = null;  // Active blog post ID

// Section Subtitles
const SUBTITLES = {
  tech: 'Implementation notes, ML theory, and systems engineering',
  writings: 'Thoughts on computation, math, and learning'
};

// DOM Element References
let homeView, blogView, bgVideo;
let navProjects, navTech, navWritings, navSocials, socialsDropdown;
let projectsOverlay, projectsList, closeProjects;
let btnBackHome, btnBackList, blogListContainer, blogReadContainer;
let blogItems, blogPostContent, blogSectionTitle, blogSectionSubtitle;

// Initialize Application
function init() {
  // Query references dynamically to guarantee DOM is fully parsed
  homeView = document.getElementById('home-view');
  blogView = document.getElementById('blog-view');
  bgVideo = document.getElementById('bg-video');

  navProjects = document.getElementById('nav-projects');
  navTech = document.getElementById('nav-tech');
  navWritings = document.getElementById('nav-writings');
  navSocials = document.getElementById('nav-socials');
  socialsDropdown = document.getElementById('socials-dropdown');

  projectsOverlay = document.getElementById('projects-overlay');
  projectsList = document.getElementById('projects-list');
  closeProjects = document.getElementById('close-projects');

  btnBackHome = document.getElementById('btn-back-home');
  btnBackList = document.getElementById('btn-back-list');
  blogListContainer = document.getElementById('blog-list-container');
  blogReadContainer = document.getElementById('blog-read-container');
  blogItems = document.getElementById('blog-items');
  blogPostContent = document.getElementById('blog-post-content');
  blogSectionTitle = document.getElementById('blog-section-title');
  blogSectionSubtitle = document.getElementById('blog-section-subtitle');

  // Verify elements exist to help debugging
  const elements = {
    homeView, blogView, navProjects, navTech, navWritings, navSocials, socialsDropdown,
    projectsOverlay, projectsList, closeProjects, btnBackHome, btnBackList,
    blogListContainer, blogReadContainer, blogItems, blogPostContent, blogSectionTitle, blogSectionSubtitle
  };
  
  for (const [name, el] of Object.entries(elements)) {
    if (!el && name !== 'bgVideo') {
      console.warn(`yuro Portfolio: Required element "${name}" was not found in the DOM.`);
    }
  }

  // Pre-inject the ← Back button inside projects header
  injectProjectsBackButton();

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

// Attach event listeners safely checking for element existence
function setupEventListeners() {
  if (navProjects) {
    navProjects.addEventListener('click', () => {
      currentSection = 'projects';
      openProjectsOverlay();
    });
  }

  if (navTech) {
    navTech.addEventListener('click', () => {
      currentSection = 'tech';
      navigateToSection('tech');
    });
  }

  if (navWritings) {
    navWritings.addEventListener('click', () => {
      currentSection = 'writings';
      navigateToSection('writings');
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

  if (closeProjects) {
    closeProjects.addEventListener('click', closeProjectsOverlay);
  }

  if (projectsOverlay) {
    projectsOverlay.addEventListener('click', (e) => {
      if (e.target === projectsOverlay) {
        closeProjectsOverlay();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectsOverlay();
      if (socialsDropdown) socialsDropdown.classList.remove('show');
    }
  });

  if (btnBackHome) {
    btnBackHome.addEventListener('click', () => {
      navigateToHome();
    });
  }

  if (btnBackList) {
    btnBackList.addEventListener('click', () => {
      if (currentSection) {
        navigateToSection(currentSection);
      } else {
        navigateToHome();
      }
    });
  }
}

// --- Content Index Helper ---
function getEntriesForSlug(slug) {
  const contentIndex = window.CONTENT_INDEX || { sections: [] };
  const section = contentIndex.sections.find(s => s.slug === slug);
  return section ? section.entries || [] : [];
}

// --- Projects Navigation & Rendering ---
function openProjectsOverlay() {
  if (projectsOverlay) {
    projectsOverlay.classList.add('open');
    
    // Resume background video if playing
    if (bgVideo) bgVideo.play().catch(() => {});

    // Populate projects list
    const projects = getEntriesForSlug('projects');
    renderProjectsList(projects);
  }
}

function closeProjectsOverlay() {
  if (projectsOverlay) {
    projectsOverlay.classList.remove('open');
    currentSection = null;
  }
}

function injectProjectsBackButton() {
  if (!projectsOverlay) return;
  const header = projectsOverlay.querySelector('.projects-header');
  if (header && !header.querySelector('.btn-back-projects')) {
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-control btn-back-projects';
    backBtn.type = 'button';
    backBtn.style.marginRight = '16px';
    backBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      Back
    `;
    backBtn.addEventListener('click', closeProjectsOverlay);
    header.insertBefore(backBtn, header.firstChild);
  }
}

function extractFirstLink(markdown) {
  if (!markdown) return '#';
  const match = /\[[^\]]+\]\((https?:\/\/[^)]+)\)/.exec(markdown);
  return match ? match[1] : '#';
}

function renderProjectsList(projects) {
  if (!projectsList) return;

  if (projects.length === 0) {
    projectsList.innerHTML = '<div class="blog-status">Nothing here yet — check back soon.</div>';
    return;
  }

  projectsList.innerHTML = '';
  projects.forEach(project => {
    const url = project.url || extractFirstLink(project.content);

    const card = document.createElement('div');
    card.className = 'project-card-item';
    card.style.cursor = 'pointer';
    
    // Clicking the card opens the URL in a new tab
    card.addEventListener('click', () => {
      window.open(url, '_blank');
    });

    card.innerHTML = `
      <div class="project-link-header">
        <span class="project-title-link">
          ${project.title}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </span>
        <span class="project-meta-label">${project.date || 'Project'}</span>
      </div>
      <p class="project-desc">${project.summary || ''}</p>
      <div class="project-external-url" style="margin-top: 10px; font-family: var(--font-mono); font-size: 11px; color: var(--home-accent); opacity: 0.85; word-break: break-all;">
        <a href="${url}" target="_blank" rel="noopener noreferrer" style="border-bottom: 1px solid rgba(109, 168, 216, 0.3); padding-bottom: 2px;">${url}</a>
      </div>
    `;

    // Prevent propagation when clicking the external URL link explicitly
    const linkNode = card.querySelector('.project-external-url a');
    if (linkNode) {
      linkNode.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    projectsList.appendChild(card);
  });
}

// --- Blog Navigation & Rendering ---
function navigateToHome() {
  currentSection = null;
  currentPostId = null;

  if (blogView) blogView.classList.remove('active');
  if (homeView) homeView.classList.add('active');

  // Resume background video if homescreen is active
  if (bgVideo) bgVideo.play().catch(() => {});
}

function navigateToSection(section) {
  currentSection = section;
  currentPostId = null;

  // Pause video to conserve CPU/GPU
  if (bgVideo) bgVideo.pause();

  if (homeView) homeView.classList.remove('active');
  if (blogView) blogView.classList.add('active');

  if (blogReadContainer) blogReadContainer.classList.add('hidden');
  if (blogListContainer) blogListContainer.classList.remove('hidden');

  // Render titles and subtitles
  if (blogSectionTitle) {
    blogSectionTitle.textContent = section === 'tech' ? 'Tech' : 'Writings';
  }
  if (blogSectionSubtitle) {
    blogSectionSubtitle.textContent = SUBTITLES[section] || '';
  }

  // Load and render posts list
  const posts = getEntriesForSlug(section);
  renderBlogList(posts, section);
}

function navigateToPost(section, postId) {
  currentSection = section;
  currentPostId = postId;

  if (blogListContainer) blogListContainer.classList.add('hidden');
  if (blogReadContainer) blogReadContainer.classList.remove('hidden');

  if (blogPostContent) {
    blogPostContent.innerHTML = '<div class="blog-status">Fetching record contents...</div>';
  }

  renderBlogPost(section, postId);
}

function renderBlogList(posts, section) {
  if (!blogItems) return;

  if (posts.length === 0) {
    blogItems.innerHTML = '<div class="blog-status">Nothing here yet — check back soon.</div>';
    return;
  }

  blogItems.innerHTML = '';
  posts.forEach(post => {
    const card = document.createElement('button');
    card.className = 'blog-card';
    card.type = 'button';
    card.style.width = '100%';
    card.style.textAlign = 'left';

    const tagLabel = section === 'tech' ? 'Technical Note' : 'Essay';

    card.innerHTML = `
      <div class="blog-card-meta">
        <span class="blog-card-label">${tagLabel}</span>
        <span class="blog-card-date">${post.date || ''}</span>
      </div>
      <h3 class="blog-card-title">${post.title}</h3>
      <p class="blog-card-summary">${post.summary || ''}</p>
    `;

    card.addEventListener('click', () => {
      navigateToPost(section, post.id);
    });

    blogItems.appendChild(card);
  });
}

// --- Fetch and Render Markdown Post ---
async function renderBlogPost(section, postId) {
  if (!blogPostContent) return;

  const posts = getEntriesForSlug(section);
  const item = posts.find(p => p.id === postId);

  if (!item) {
    blogPostContent.innerHTML = '<div class="blog-status">Error: Document metadata not found.</div>';
    return;
  }

  try {
    let markdown = '';
    // Fetch path: Construct from item.post or fallback to posts/[id].md
    const postUrl = item.post || `posts/${item.id}.md`;

    try {
      const res = await fetch(postUrl, { cache: 'no-cache' });
      if (res.ok) {
        markdown = await res.text();
      } else {
        // Fall back to inline content if fetch fails (e.g. file is missing locally)
        markdown = item.content || 'No content provided.';
      }
    } catch (e) {
      markdown = item.content || 'No content provided.';
    }

    // Render markdown content
    const processedHtml = parseMarkdown(markdown, item.assetBase);
    blogPostContent.innerHTML = processedHtml;

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

  // Parse custom workstation github link embeds (e.g., `::github https://github.com/...`)
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
