import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Container from "react-bootstrap/Container";

function BlogList() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const res = await axios.get('http://localhost:5030/api/blogs');
            setBlogs(res.data);
        };
        fetchBlogs();
    }, []);

    return (
        <Container className="blog-container">
            <h1 className="blogs-title">Blog List</h1>
            {blogs.map(blog => (
                <div
                    key={blog._id}
                    className="blog-item"
                    style={{ backgroundImage: `url(${blog.image})` }} // Set background image here
                >
                    <div className="blog-content">
                        <h2 className="blog-title">{blog.title}</h2>
                        <p className="blog-description">{blog.shortDescription}</p>
                        <Link to={`/blogs/${blog._id}`} className="blog-link ">
                            Read More
                        </Link>
                    </div>
                </div>
            ))}
        </Container>
    );
}

export default BlogList;
