import express from 'express';
import Blog from '../models/blogModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';


const blogRouter = express.Router();

// Get all blogs
blogRouter.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single blog by ID
blogRouter.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

blogRouter.get('/slug/:slug', async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (blog) {
        res.send(blog);
    } else {
        res.status(404).send({ message: 'Blog Not Found' });
    }
});

blogRouter.post('/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const newBlog = new Blog({
            title: 'sample title ' + Date.now(),
            slug: 'sample-slug-' + Date.now(),
            content: 'sample content',
            shortDescription: 'sample description',
            image: '/images/p1.jpg',
        });
        const blog = await newBlog.save();
        res.send({ message: 'Blog Created', blog });
    })
);
blogRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if (blog) {
            blog.title = req.body.title;
            blog.slug = req.body.slug;
            blog.content = req.body.content;
            blog.shortDescription = req.body.shortDescription;
            blog.image = req.body.image;
            await blog.save();
            res.send({ message: 'Blog Updated' });
        } else {
            res.status(404).send({ message: 'Blog Not Found' });
        }
    })
);

blogRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            await blog.deleteOne();
            res.send({ message: ' Blog Deleted' });
        } else {
            res.status(404).send({ message: ' Blog Not Found' });
        }
    })
);
export default blogRouter;
