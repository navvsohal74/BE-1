const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes

// GET /posts : Display all blog posts
app.get('/posts', (req, res) => {
    const posts = JSON.parse(fs.readFileSync('posts.json', 'utf-8'));
    res.render('home', { posts });
});

// GET /post?id=1 : Display a single post based on query parameter
app.get('/post', (req, res) => {
    const postId = req.query.id;
    const posts = JSON.parse(fs.readFileSync('posts.json', 'utf-8'));
    const post = posts.find(p => p.id === parseInt(postId));

    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('post', { post });
});

// POST /posts → Add a new post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }

    const posts = JSON.parse(fs.readFileSync('posts.json', 'utf-8'));

    const newPost = {
        id: posts.length + 1,
        title,
        content,
        createdAt: new Date().toISOString()
    };

    posts.push(newPost);
    fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));

    res.redirect('/posts');
});

// Render Add Post Form
app.get('/add-post', (req, res) => {
    res.render('addPost');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});