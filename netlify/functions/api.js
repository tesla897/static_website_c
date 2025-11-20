const serverless = require('serverless-http');
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();

const router = express.Router();

// Get the base path - in Netlify, this will be the project root
const basePath = process.cwd();

// API endpoint to fetch markdown files
router.get('/post/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(basePath, 'posts', filename);
        const content = await fs.readFile(filePath, 'utf-8');
        res.json({ content });
    } catch (error) {
        console.error('Error reading post file:', error);
        res.status(404).json({ error: 'Post not found' });
    }
});

// API endpoint to fetch posts metadata
router.get('/posts', async (req, res) => {
    try {
        const postsPath = path.join(basePath, 'posts', 'posts.json');
        const content = await fs.readFile(postsPath, 'utf-8');
        res.json(JSON.parse(content));
    } catch (error) {
        console.error('Error reading posts.json:', error);
        res.status(500).json({ error: 'Failed to load posts', details: error.message });
    }
});

// Mount the router
app.use('/.netlify/functions/api', router);  // For Netlify
app.use('/api', router);                     // For local development

// Export the serverless function
module.exports.handler = serverless(app);
