const serverless = require('serverless-http');
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();

const router = express.Router();

// Get the base path - in Netlify, this will be the project root
const basePath = process.cwd();

// Debug endpoint to check file structure
router.get('/debug', async (req, res) => {
    try {
        const rootFiles = await fs.readdir(basePath);
        const postsDir = path.join(basePath, 'posts');
        let postsFiles = [];
        try {
            postsFiles = await fs.readdir(postsDir);
        } catch (e) {
            postsFiles = [`Error accessing posts dir: ${e.message}`];
        }

        res.json({
            basePath,
            dirname: __dirname,
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
router.get('/post/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(basePath, 'posts', filename);
        console.log(`Attempting to read file: ${filePath}`);
        const content = await fs.readFile(filePath, 'utf-8');
        res.json({ content });
    } catch (error) {
        console.error('Error reading post file:', error);
        res.status(404).json({
            error: 'Post not found',
            details: error.message,
            path: path.join(basePath, 'posts', req.params.filename)
        });
    }
});

// API endpoint to fetch posts metadata
router.get('/posts', async (req, res) => {
    try {
        const postsPath = path.join(basePath, 'posts', 'posts.json');
        console.log(`Attempting to read posts metadata: ${postsPath}`);
        const content = await fs.readFile(postsPath, 'utf-8');
        res.json(JSON.parse(content));
    } catch (error) {
        console.error('Error reading posts.json:', error);
        res.status(500).json({
            error: 'Failed to load posts',
            details: error.message,
            path: path.join(basePath, 'posts', 'posts.json')
        });
    }
});

// Mount the router
app.use('/.netlify/functions/api', router);  // For Netlify
app.use('/api', router);                     // For local development

// Export the serverless function
module.exports.handler = serverless(app);
