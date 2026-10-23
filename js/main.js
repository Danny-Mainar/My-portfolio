// js/main.js - Hybrid Engine with Supabase & Local Fallback
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Your Supabase Project URL
const SUPABASE_URL = 'https://hkktcmuskgmknkrcqhhd.supabase.co';

// Paste your full publishable key from your Supabase dashboard (starts with sb_publishable_)
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_PJoDFJ_Zq0DyXree70HSMw_MmgMyENM';

let supabase = null;
if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY && SUPABASE_PUBLISHABLE_KEY !== 'YOUR_FULL_SB_PUBLISHABLE_KEY_HERE') {
  supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}

// 1. Hybrid Fetch for Projects
async function fetchProjects() {
  if (!supabase) return window.LOCAL_DATA.projects;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase projects fetch failed or empty. Falling back to local data.');
      return window.LOCAL_DATA.projects;
    }
    return data;
  } catch (err) {
    console.warn('Network unreachable for Supabase projects. Falling back to local data:', err);
    return window.LOCAL_DATA.projects;
  }
}

// 2. Hybrid Fetch for Articles
async function fetchArticles() {
  if (!supabase) return window.LOCAL_DATA.articles;
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase articles fetch failed or empty. Falling back to local data.');
      return window.LOCAL_DATA.articles;
    }
    return data;
  } catch (err) {
    console.warn('Network unreachable for Supabase articles. Falling back to local data:', err);
    return window.LOCAL_DATA.articles;
  }
}

// 3. Render functions targeting only the repeating grids (#projects-grid & #articles-grid)
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return; // Guard clause protects your static sections

  grid.innerHTML = projects.map(p => `
    <div class="project-card">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="project-tags">
        ${Array.isArray(p.tags) ? p.tags.map(t => `<span>${t}</span>`).join('') : ''}
      </div>
      <div class="project-links">
        ${p.github_url ? `<a href="${p.github_url}" target="_blank" rel="noopener">GitHub</a>` : ''}
        ${p.live_url && p.live_url !== '#' ? `<a href="${p.live_url}" target="_blank" rel="noopener">Live Demo</a>` : ''}
      </div>
    </div>
  `).join('');
}

function renderArticles(articles) {
  const grid = document.getElementById('articles-grid');
  if (!grid) return;

  grid.innerHTML = articles.map(a => `
    <article class="article-card">
      <h3><a href="${a.url}" target="_blank" rel="noopener">${a.title}</a></h3>
      <p>${a.snippet}</p>
      <span class="article-date">${a.date || ''}</span>
    </article>
  `).join('');
}

// Execute on DOM load
document.addEventListener('DOMContentLoaded', async () => {
  const projects = await fetchProjects();
  renderProjects(projects);

  const articles = await fetchArticles();
  renderArticles(articles);
});