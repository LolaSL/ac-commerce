import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await axios.get(`http://localhost:5030/api/blogs/${id}`);
      setBlog(res.data);
    };
    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1 className="mt-4 mb-4">{blog.title}</h1>
      <div>
        <Image
          className="responsive"
          src={blog.image}
          alt={`Blog Image `}
        />
      </div>

      <div dangerouslySetInnerHTML={{ __html: blog.content }} className="mt-4 mb-4"/>
      <div>
        <Link to='/blogs'className="link-blogs">Back to Blogs</Link>
   </div>
    </Container>
  );
}

export default BlogDetails;
