// blog-server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Post Schema
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  date: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

// Comment Schema
const CommentSchema = new mongoose.Schema({
  postId: mongoose.Schema.Types.ObjectId,
  content: String,
  author: String,
  date: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', CommentSchema);

// Routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Error creating post' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Blog server running on port ${PORT}`));
