const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// Serve node_modules for client-side libraries
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Debug endpoint to check file structure
app.get('/api/debug', async (req, res) => {
  try {
    const rootFiles = await fs.readdir(__dirname);
    const postsDir = path.join(__dirname, 'posts');
    let postsFiles = [];
    try {
      postsFiles = await fs.readdir(postsDir);
    } catch (e) {
      postsFiles = [`Error accessing posts dir: ${e.message}`];
    }

    res.json({
      basePath: __dirname,
      rootFiles,
      postsDir,
      postsFiles,
      env: process.env
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to fetch markdown files
app.get('/api/post/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'posts', filename);
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    res.status(404).json({ error: 'Post not found' });
  }
});

// API endpoint to fetch posts metadata
app.get('/api/posts', async (req, res) => {
  try {
    const postsPath = path.join(__dirname, 'posts', 'posts.json');
    const content = await fs.readFile(postsPath, 'utf-8');
    res.json(JSON.parse(content));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Visit http://localhost:${PORT} to view your site`);
});
