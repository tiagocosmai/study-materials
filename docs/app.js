(function () {
  const RAW_BASE = 'https://raw.githubusercontent.com';
  let config = null;
  let currentPath = '';

  const $ = (id) => document.getElementById(id);
  const nav = $('nav');
  const navLoading = $('nav-loading');
  const content = $('content');
  const placeholder = $('content-placeholder');
  const markdownBody = $('markdown-body');
  const contentError = $('content-error');
  const contentLoading = $('content-loading');
  const sidebar = $('sidebar');
  const menuBtn = $('menu-btn');
  const sidebarOverlay = $('sidebar-overlay');
  const themeToggle = $('theme-toggle');
  const navFilterWrap = $('nav-filter-wrap');
  const navFilter = $('nav-filter');
  const footerRepoLink = $('footer-repo-link');
  const footerLicenseLink = $('footer-license-link');

  function getBaseDir(path) {
    const parts = path.split('/');
    parts.pop();
    return parts.join('/') || '';
  }

  function rawUrl(path) {
    if (!config) return '';
    return `${RAW_BASE}/${config.repo}/${config.branch}/${path}`;
  }

  function resolvePath(baseDir, href) {
    if (href.startsWith('http') || href.startsWith('#')) return href;
    const base = baseDir ? baseDir + '/' : '';
    const segments = (base + href).split('/').filter(Boolean);
    const resolved = [];
    for (const s of segments) {
      if (s === '..') resolved.pop();
      else if (s !== '.') resolved.push(s);
    }
    return resolved.join('/');
  }

  function buildNav() {
    if (!config || !config.studies) return;
    navLoading.hidden = true;
    if (navFilterWrap) navFilterWrap.hidden = false;
    let html = '';
    config.studies.forEach((study) => {
      const readmePath = study.readme;
      const subjectTitle = escapeHtml(study.title);
      html += `<div class="nav-study-group" data-study-id="${escapeAttr(study.id)}">`;
      html += `<div class="nav-study-row" role="button" tabindex="0" aria-expanded="true" aria-label="${escapeAttr(study.title)}">`;
      html += `<span class="nav-study-toggle" aria-hidden="true">▼</span>`;
      html += `<a class="nav-link-subject" href="#${encodeHash(readmePath)}" data-path="${escapeAttr(readmePath)}">${subjectTitle}</a>`;
      html += `</div><ul class="nav-list">`;
      (study.chapters || []).forEach((ch) => {
        html += `<li class="nav-item" data-chapter-title="${escapeAttr(ch.title.toLowerCase())}" data-study-title="${escapeAttr(study.title.toLowerCase())}">`;
        html += `<a class="nav-link" href="#${encodeHash(ch.path)}" data-path="${escapeAttr(ch.path)}">${escapeHtml(ch.title)}</a></li>`;
      });
      html += '</ul></div>';
    });
    nav.innerHTML = html;

    nav.querySelectorAll('.nav-link, .nav-link-subject').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const path = a.getAttribute('data-path');
        if (path) {
          loadPage(path);
          setActiveLink(path);
          closeSidebarMobile();
        }
      });
    });

    nav.querySelectorAll('.nav-study-row').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const group = row.closest('.nav-study-group');
        if (group) {
          const expanded = group.getAttribute('aria-expanded') !== 'true';
          group.classList.toggle('is-collapsed', !expanded);
          row.setAttribute('aria-expanded', expanded);
        }
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          row.click();
        }
      });
    });

    if (navFilter) {
      navFilter.value = '';
      navFilter.addEventListener('input', applyNavFilter);
    }
  }

  function applyNavFilter() {
    const q = (navFilter.value || '').trim().toLowerCase();
    nav.querySelectorAll('.nav-study-group').forEach((group) => {
      const row = group.querySelector('.nav-study-row');
      const studyTitle = (config.studies.find((s) => s.id === group.dataset.studyId) || {}).title || '';
      const items = group.querySelectorAll('.nav-item');
      let anyVisible = false;
      items.forEach((li) => {
        const match = !q || li.dataset.chapterTitle.includes(q) || li.dataset.studyTitle.includes(q) || studyTitle.toLowerCase().includes(q);
        li.classList.toggle('is-hidden', !match);
        if (match) anyVisible = true;
      });
      const readmeMatches = !q || studyTitle.toLowerCase().includes(q);
      group.classList.toggle('is-hidden', !readmeMatches && !anyVisible);
      if (row) {
        group.classList.remove('is-collapsed');
        row.setAttribute('aria-expanded', 'true');
      }
    });
  }

  function encodeHash(path) {
    return encodeURIComponent(path).replace(/%2F/g, '/');
  }

  function setActiveLink(path) {
    nav.querySelectorAll('.nav-link, .nav-link-subject').forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('data-path') === path);
    });
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }
  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function showContent(showPlaceholder, showBody, showError, showLoading) {
    placeholder.hidden = !showPlaceholder;
    markdownBody.hidden = !showBody;
    contentError.hidden = !showError;
    contentLoading.hidden = !showLoading;
    if (showError) contentError.textContent = '';
  }

  function loadPage(path) {
    currentPath = path;
    if (window.location.hash !== '#' + encodeHash(path)) {
      window.location.hash = encodeHash(path);
    }
    showContent(false, false, false, true);
    const url = rawUrl(path);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? 'Página não encontrada.' : `Erro ${r.status}`);
        return r.text();
      })
      .then((md) => {
        renderMarkdown(md, path);
        showContent(false, true, false, false);
      })
      .catch((err) => {
        contentError.textContent = err.message || 'Falha ao carregar o conteúdo.';
        showContent(false, false, true, false);
      });
  }

  function renderMarkdown(md, path) {
    const baseDir = getBaseDir(path);
    marked.setOptions({
      gfm: true,
      breaks: true,
      langPrefix: 'language-',
    });
    const renderer = new marked.Renderer();
    const origCode = renderer.code.bind(renderer);
    renderer.code = function (code, lang, escaped) {
      if (lang === 'mermaid') {
        return `<div class="mermaid">${code}</div>`;
      }
      return origCode(code, lang, escaped);
    };
    let html = marked.parse(md, { renderer });

    html = resolveHtmlUrls(html, baseDir);
    markdownBody.innerHTML = html;

    markdownBody.querySelectorAll('pre code').forEach((el) => {
      hljs.highlightElement(el);
    });

    markdownBody.querySelectorAll('.mermaid').forEach((el) => {
      const content = el.textContent;
      try {
        mermaid.run({ nodes: [el], suppressErrors: true });
      } catch (e) {
        el.textContent = content;
        el.classList.add('mermaid-error');
      }
    });

    const theme = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    markdownBody.querySelectorAll('.mermaid svg').forEach((svg) => {
      svg.style.maxWidth = '100%';
      if (theme === 'dark') {
        svg.querySelectorAll('[stroke="#333"], [fill="#333"]').forEach((n) => {
          n.setAttribute('stroke', '#f5f5f7');
          n.setAttribute('fill', '#f5f5f7');
        });
      }
    });
  }

  function resolveHtmlUrls(html, baseDir) {
    const baseUrl = rawUrl(baseDir ? baseDir + '/' : '');
    const baseUrlNoTrailing = rawUrl(baseDir);
    return html
      .replace(/<img([^>]+)src="([^"]+)"/gi, (_, attrs, src) => {
        if (src.startsWith('http')) return `<img${attrs}src="${src}"`;
        const resolved = resolvePath(baseDir, src);
        return `<img${attrs}src="${rawUrl(resolved)}"`;
      })
      .replace(/<a([^>]+)href="([^"]+)"/gi, (_, attrs, href) => {
        const trimmed = href.trim();
        if (trimmed.startsWith('http') || trimmed.startsWith('#') || trimmed.startsWith('mailto:')) return `<a${attrs}href="${href}"`;
        if (trimmed.endsWith('.md') || trimmed.endsWith('.md#') || /\.md#/.test(trimmed)) {
          const pathPart = trimmed.split('#')[0];
          const resolved = resolvePath(baseDir, pathPart);
          const hash = trimmed.includes('#') ? trimmed.split('#').slice(1).join('#') : '';
          const newHash = '#' + encodeHash(resolved) + (hash ? '#' + hash : '');
          return `<a${attrs}href="${newHash}" data-internal="1"`;
        }
        return `<a${attrs}href="${href}"`;
      });
  }

  function initInternalLinks() {
    markdownBody.querySelectorAll('a[data-internal="1"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const path = decodeURIComponent(a.getAttribute('href').slice(1).split('#')[0]);
        loadPage(path);
        setActiveLink(path);
      });
    });
  }

  document.body.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"][data-internal="1"]');
    if (a) {
      e.preventDefault();
      const path = decodeURIComponent(a.getAttribute('href').slice(1).split('#')[0]);
      loadPage(path);
      setActiveLink(path);
      closeSidebarMobile();
    }
  });

  function parseHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const path = decodeURIComponent(hash.split('#')[0]);
    if (path && config && config.studies.some((s) => s.readme === path || (s.chapters || []).some((c) => c.path === path))) {
      loadPage(path);
      setActiveLink(path);
    } else if (path && path === 'README.md') {
      loadPage(path);
      setActiveLink(path);
    }
  }

  window.addEventListener('hashchange', parseHash);

  function openSidebarMobile() {
    sidebar.classList.add('is-open');
    sidebar.classList.remove('is-closed');
    if (sidebarOverlay) {
      sidebarOverlay.classList.add('is-visible');
      sidebarOverlay.setAttribute('aria-hidden', 'false');
    }
  }
  function closeSidebarMobile() {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('is-open');
      sidebar.classList.add('is-closed');
      if (sidebarOverlay) {
        sidebarOverlay.classList.remove('is-visible');
        sidebarOverlay.setAttribute('aria-hidden', 'true');
      }
    }
  }
  function toggleSidebarMobile() {
    if (sidebar.classList.contains('is-open')) closeSidebarMobile();
    else openSidebarMobile();
  }

  menuBtn.addEventListener('click', toggleSidebarMobile);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebarMobile);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('is-open', 'is-closed');
      if (sidebarOverlay) sidebarOverlay.classList.remove('is-visible');
    } else if (!sidebar.classList.contains('is-open')) {
      sidebar.classList.add('is-closed');
    }
  });

  function initTheme() {
    const stored = localStorage.getItem('docs-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored);
    } else {
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    swapHighlightTheme();
  }
  function swapHighlightTheme() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const light = document.getElementById('highlight-theme-light');
    const dark = document.getElementById('highlight-theme-dark');
    if (light && dark) {
      light.media = theme === 'dark' ? 'not all' : 'all';
      dark.media = theme === 'dark' ? 'all' : 'not all';
    }
  }
  themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('docs-theme', next);
    swapHighlightTheme();
  });

  mermaid.initialize({
    startOnLoad: false,
    theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
    securityLevel: 'loose',
  });

  function initFooter() {
    if (!config || !config.repo) return;
    const base = `https://github.com/${config.repo}`;
    if (footerRepoLink) {
      footerRepoLink.href = base;
      footerRepoLink.textContent = config.repo;
    }
    if (footerLicenseLink) {
      footerLicenseLink.href = `${base}/blob/${config.branch || 'main'}/LICENSE-docs`;
      footerLicenseLink.textContent = 'License';
    }
  }

  fetch('config.json?v=' + (window.__CONFIG_VERSION || 2))
    .then((r) => r.json())
    .then((c) => {
      config = c;
      buildNav();
      initFooter();
      parseHash();
      if (!window.location.hash) showContent(true, false, false, false);
    })
    .catch(() => {
      navLoading.textContent = 'Erro ao carregar o índice.';
    });

  initTheme();
})();
