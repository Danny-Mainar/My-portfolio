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
  // Render Projects & Articles
  const projects = await fetchProjects();
  renderProjects(projects);

  const articles = await fetchArticles();
  renderArticles(articles);

  // Handle Contact Form Submission to Supabase
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      if (!supabase) {
        showStatus('Database connection not initialized. Please check configuration.', 'error');
        return;
      }

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const { error } = await supabase
          .from('messages')
          .insert([{ name, email, message }]);

        if (error) throw error;

        showStatus('Message sent successfully! Thank you for reaching out.', 'success');
        contactForm.reset();
      } catch (err) {
        console.error('Error sending message:', err);
        showStatus('Failed to send message. Please try emailing directly.', 'error');
      } finally {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }
    });
  }

  function showStatus(text, type) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.style.display = 'block';
    formStatus.style.color = type === 'success' ? '#00ffcc' : '#ff4d4d';
    
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 5000);
  }
});