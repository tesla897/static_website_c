const serverless = require('serverless-http');
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();

// API endpoint to fetch markdown files
app.get('/api/post/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../../posts', filename);
        const content = await fs.readFile(filePath, 'utf-8');
        res.json({ content });
    } catch (error) {
        res.status(404).json({ error: 'Post not found' });
    }
});

// API endpoint to fetch posts metadata
app.get('/api/posts', async (req, res) => {
    try {
        const postsPath = path.join(__dirname, '../../posts', 'posts.json');
        const content = await fs.readFile(postsPath, 'utf-8');
        res.json(JSON.parse(content));
    } catch (error) {
        res.status(500).json({ error: 'Failed to load posts' });
    }
});

// Export the serverless function
module.exports.handler = serverless(app);
