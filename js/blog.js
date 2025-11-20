// Blog functionality - Load and display blog posts

import { marked } from '/node_modules/marked/lib/marked.esm.js';

// Load blog posts on blog.html page
if (document.getElementById('blog-posts')) {
  loadBlogPosts();
}

async function loadBlogPosts() {
  const container = document.getElementById('blog-posts');

  try {
    const response = await fetch('/api/posts');
    const posts = await response.json();

    if (posts.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: var(--space-2xl);">
          <h3>No posts yet</h3>
          <p style="color: var(--color-text-secondary);">Check back soon for new content!</p>
        </div>
      `;
      return;
    }

    // Clear loading message
    container.innerHTML = '';

    // Create blog cards
    posts.forEach(post => {
      const card = createBlogCard(post);
      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading blog posts:', error);
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: var(--space-2xl);">
        <p style="color: var(--color-error);">Failed to load blog posts. Please try again later.</p>
      </div>
    `;
  }
}

function createBlogCard(post) {
  const card = document.createElement('div');
  card.className = 'blog-card';
  card.onclick = () => {
    window.location.href = `post.html?post=${post.slug}`;
  };

  card.innerHTML = `
    <div class="blog-card-image">
      ${post.emoji || '📝'}
    </div>
    <div class="blog-card-content">
      <div class="blog-card-meta">
        <span>${post.date}</span>
        <span>•</span>
        <span>${post.author}</span>
      </div>
      <h3 class="blog-card-title">${post.title}</h3>
      <p class="blog-card-excerpt">${post.description}</p>
      <a href="post.html?post=${post.slug}" class="blog-card-link">
        Read more →
      </a>
    </div>
  `;

  return card;
}
