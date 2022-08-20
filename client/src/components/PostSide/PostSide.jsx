import axios from "axios";
import React, { useEffect, useState } from "react";

import Posts from "../Posts/Posts";
import PostShare from "../PostShare/PostShare";
import "./PostSide.css";

const PostSide = () => {
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setLoading(true);

    axios.get("http://localhost:5000/posts").then((data) => {
      setPosts(data?.data);

      setLoading(false);
    });
  }, []);
  return (
    <div className="PostSide">
      <PostShare />

      {posts && <Posts loading={loading} posts={posts} />}
    </div>
  );
};

export default PostSide;
