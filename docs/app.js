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
    let html = '';
    config.studies.forEach((study) => {
      const readmePath = study.readme;
      html += `<p class="nav-study">${escapeHtml(study.title)}</p><ul class="nav-list">`;
      html += `<li class="nav-item"><a class="nav-link nav-link-readme" href="#${encodeHash(readmePath)}" data-path="${escapeAttr(readmePath)}">README</a></li>`;
      (study.chapters || []).forEach((ch) => {
        html += `<li class="nav-item"><a class="nav-link" href="#${encodeHash(ch.path)}" data-path="${escapeAttr(ch.path)}">${escapeHtml(ch.title)}</a></li>`;
      });
      html += '</ul>';
    });
    nav.innerHTML = html;

    nav.querySelectorAll('.nav-link').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const path = a.getAttribute('data-path');
        loadPage(path);
        setActiveLink(path);
        closeSidebarMobile();
      });
    });
  }

  function encodeHash(path) {
    return encodeURIComponent(path).replace(/%2F/g, '/');
  }

  function setActiveLink(path) {
    nav.querySelectorAll('.nav-link').forEach((a) => {
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

  fetch('config.json?v=' + (window.__CONFIG_VERSION || 2))
    .then((r) => r.json())
    .then((c) => {
      config = c;
      buildNav();
      parseHash();
      if (!window.location.hash) showContent(true, false, false, false);
    })
    .catch(() => {
      navLoading.textContent = 'Erro ao carregar o índice.';
    });

  initTheme();
})();
