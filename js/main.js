/* ==========================================
   yuro Portfolio - Core JavaScript Application
   ========================================== */

// State Management
const state = {
  view: 'home',         // 'home', 'blog-list', 'blog-post'
  activeSection: null,  // 'tech' or 'writings'
  activePostId: null    // Current post ID
};

// Section Metadata
const SECTION_CONFIG = {
  tech: {
    title: 'Tech & Research',
    subtitle: 'Implementation notes, ML theory, and systems engineering'
  },
  writings: {
    title: 'Writings',
    subtitle: 'Essays on philosophy, computation, and learning'
  }
};

// Elements
let homeView, blogView, bgVideo;
let navProjects, navTech, navWritings, navSocials, socialsDropdown;
let projectsOverlay, projectsList, closeProjects;
let btnBackHome, btnBackList, blogListContainer, blogReadContainer;
let blogItems, blogPostContent, blogSectionTitle, blogSectionSubtitle;

// Initialize App
function init() {
  // Query elements inside init to guarantee DOM is ready
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

  // Verify elements exist to catch missing DOM node bugs
  const requiredElements = {
    homeView, blogView, navProjects, navTech, navWritings, navSocials, socialsDropdown,
    projectsOverlay, projectsList, closeProjects, btnBackHome, btnBackList, 
    blogListContainer, blogReadContainer, blogItems, blogPostContent, blogSectionTitle, blogSectionSubtitle
  };

  for (const [name, el] of Object.entries(requiredElements)) {
    if (!el) {
      console.error(`yuro Portfolio: DOM Element "${name}" was not found!`);
    }
  }

  setupEventListeners();
  
  // Autoplay video helper
  if (bgVideo) {
    bgVideo.play().catch(err => {
      console.log("Autoplay blocked. Retrying on user interaction.", err);
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Event Listeners Setup
function setupEventListeners() {
  // Navigation Links
  navProjects.addEventListener('click', openProjectsOverlay);
  navTech.addEventListener('click', () => navigateToSection('tech'));
  navWritings.addEventListener('click', () => navigateToSection('writings'));
  
  // Socials Dropdown Toggle
  navSocials.addEventListener('click', (e) => {
    e.stopPropagation();
    socialsDropdown.classList.toggle('show');
  });
  
  document.addEventListener('click', () => {
    socialsDropdown.classList.remove('show');
  });

  // Projects Overlay Controls
  closeProjects.addEventListener('click', closeProjectsOverlay);
  projectsOverlay.addEventListener('click', (e) => {
    if (e.target === projectsOverlay) closeProjectsOverlay();
  });
  
  // Global Esc Key for Modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectsOverlay();
      socialsDropdown.classList.remove('show');
    }
  });

  // Blog Section Controls
  btnBackHome.addEventListener('click', () => navigateToHome());
  btnBackList.addEventListener('click', () => navigateToSection(state.activeSection));
}

// --- Content Index Helpers ---
function getEntriesForSlug(slug) {
  const contentIndex = window.CONTENT_INDEX || { sections: [] };
  const section = contentIndex.sections.find(s => s.slug === slug);
  return section ? section.entries : [];
}

// --- View Router & Navigation ---
function navigateToHome() {
  state.view = 'home';
  state.activeSection = null;
  state.activePostId = null;

  blogView.classList.remove('active');
  homeView.classList.add('active');
  
  // Resume background video
  if (bgVideo) bgVideo.play().catch(() => {});
}

function navigateToSection(section) {
  state.view = 'blog-list';
  state.activeSection = section;
  state.activePostId = null;

  // Pause video to conserve CPU/GPU resources
  if (bgVideo) bgVideo.pause();

  homeView.classList.remove('active');
  blogView.classList.add('active');
  
  blogReadContainer.classList.add('hidden');
  blogListContainer.classList.remove('hidden');
  
  // Render section title and subtitle
  blogSectionTitle.textContent = SECTION_CONFIG[section].title;
  blogSectionSubtitle.textContent = SECTION_CONFIG[section].subtitle;
  
  // Render list of posts
  const items = getEntriesForSlug(section);
  renderBlogList(items, section);
}

function navigateToPost(section, postId) {
  state.view = 'blog-post';
  state.activeSection = section;
  state.activePostId = postId;
  
  blogListContainer.classList.add('hidden');
  blogReadContainer.classList.remove('hidden');
  
  renderBlogPost(section, postId);
}

// --- Projects Drawer Logic ---
function openProjectsOverlay() {
  projectsOverlay.classList.add('open');
  const projects = getEntriesForSlug('projects');
  renderProjectsList(projects);
}

function closeProjectsOverlay() {
  projectsOverlay.classList.remove('open');
}

function extractFirstLink(markdown) {
  if (!markdown) return '#';
  const match = /\[[^\]]+\]\((https?:\/\/[^)]+)\)/.exec(markdown);
  return match ? match[1] : '#';
}

function renderProjectsList(projects) {
  if (projects.length === 0) {
    projectsList.innerHTML = '<div class="blog-status">No projects found.</div>';
    return;
  }

  projectsList.innerHTML = '';
  projects.forEach(project => {
    // Redirection Link: Find the first markdown link URL inside content
    const primaryUrl = extractFirstLink(project.content);

    const card = document.createElement('div');
    card.className = 'project-card-item';
    
    // Use date/status as a tag metadata since content-index entries don't have tags array
    const dateTag = project.date || 'Project';

    card.innerHTML = `
      <div class="project-link-header">
        <a href="${primaryUrl}" target="_blank" rel="noreferrer" class="project-title-link">
          ${project.title}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
        <span class="project-meta-label">${project.date || 'Project'}</span>
      </div>
      <p class="project-desc">${project.summary || 'Click to view resource'}</p>
      <div class="project-tags">
        <span class="project-tag">${dateTag}</span>
      </div>
    `;
    
    projectsList.appendChild(card);
  });
}

// --- Blog List Rendering ---
function renderBlogList(items, section) {
  if (items.length === 0) {
    blogItems.innerHTML = `<div class="blog-status">No records found in ${section}.</div>`;
    return;
  }

  blogItems.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('button');
    card.className = 'blog-card';
    card.type = 'button';
    
    const tagLabel = section === 'tech' ? 'Technical Note' : 'Essay';
    
    card.innerHTML = `
      <div class="blog-card-meta">
        <span class="blog-card-label">${tagLabel}</span>
        <span class="blog-card-date">${item.date || ''}</span>
      </div>
      <h3 class="blog-card-title">${item.title}</h3>
      <p class="blog-card-summary">${item.summary || ''}</p>
    `;
    
    card.addEventListener('click', () => navigateToPost(section, item.id));
    blogItems.appendChild(card);
  });
}

// --- Blog Post Rendering ---
function renderBlogPost(section, postId) {
  const items = getEntriesForSlug(section);
  const item = items.find(i => i.id === postId);
  
  if (!item) {
    blogPostContent.innerHTML = '<div class="blog-status">Error: Document metadata not found.</div>';
    return;
  }
  
  try {
    const markdown = item.content || 'No content provided.';
    
    // Parse Markdown & KaTeX, specifying assetBase for relative images
    const processedHtml = parseMarkdown(markdown, item.assetBase);
    blogPostContent.innerHTML = processedHtml;
    
    // Apply Code Highlighting & KaTeX Equations
    decorateLinks(blogPostContent);
    highlightCode(blogPostContent);
    renderEquations(blogPostContent);
    
    // Scroll to top of reading area
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error(error);
    blogPostContent.innerHTML = `<div class="blog-status">Error parsing document: ${error.message}</div>`;
  }
}

// --- Markdown & Embed Utilities ---
function resolveAssetUrls(markdown, assetBase) {
  if (!assetBase) return markdown;
  
  // Replace links/images like `![neural_network1.jpg](files/neural_network1.jpg)` 
  // into `![neural_network1.jpg](content/2Tech/files/neural_network1.jpg)`
  return markdown.replace(/(!\[[^\]]*\]\()([^)]+)(\))/g, (match, prefix, url, suffix) => {
    const trimmed = url.trim();
    if (/^(?:[a-z]+:|\/|#)/i.test(trimmed)) return match;
    if (/^(?:assets\/|content\/)/i.test(trimmed)) return match;
    return `${prefix}${assetBase}/${trimmed}${suffix}`;
  });
}

function parseMarkdown(markdown, assetBase) {
  // Preprocess relative image paths
  let processedMarkdown = resolveAssetUrls(markdown, assetBase);

  // Expand custom ::github embed macro from old workstation
  let expanded = processedMarkdown.replace(/^::github\s+(https:\/\/github\.com\/[^\s]+)\s*$/gm, (_, url) => {
    const label = url.replace('https://github.com/', '');
    return `<a class="github-embed" href="${url}" target="_blank" rel="noreferrer"><strong>${label}</strong><span>GitHub repository / profile reference</span></a>`;
  });
  
  // Render Markdown to HTML using marked.js
  if (!window.marked) {
    return `<div class="blog-status">Error: Marked library not loaded.</div>`;
  }
  
  const rawHtml = window.marked.parse(expanded, { gfm: true, breaks: false });
  
  // Clean HTML using DOMPurify
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
