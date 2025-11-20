// Blog functionality - Load and display blog posts

// Load blog posts on blog.html page
if (document.getElementById('blog-posts')) {
  loadBlogPosts();
}

async function loadBlogPosts() {
  const container = document.getElementById('blog-posts');

  try {
    // Check cache first
    const cachedPosts = sessionStorage.getItem('blog_posts');
    if (cachedPosts) {
      const posts = JSON.parse(cachedPosts);
      renderPosts(posts, container);
      // Optional: Re-fetch in background to update cache
      fetchPostsAndUpdateCache(container);
    } else {
      await fetchPostsAndUpdateCache(container);
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
    const errorMessage = error.message || 'Unknown error';
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: var(--space-2xl);">
        <p style="color: var(--color-error);">Failed to load blog posts. <br>Error: ${errorMessage}</p>
        <p style="font-size: 0.8em; margin-top: 10px;">Check console for details.</p>
      </div>
    `;
  }
}

async function fetchPostsAndUpdateCache(container) {
  const response = await fetch('/api/posts');
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const posts = await response.json();

  sessionStorage.setItem('blog_posts', JSON.stringify(posts));

  // Only render if container is empty (first load) or to update content
  if (!container.hasChildNodes() || container.querySelector('.loading-message')) {
    renderPosts(posts, container);
  }
}

function renderPosts(posts, container) {
  if (posts.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: var(--space-2xl);">
        <h3>No posts yet</h3>
        <p style="color: var(--color-text-secondary);">Check back soon for new content!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  posts.forEach(post => {
    const card = createBlogCard(post);
    container.appendChild(card);
  });
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
