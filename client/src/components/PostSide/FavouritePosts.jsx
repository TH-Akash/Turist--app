import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTimelinePosts } from "../../actions/PostsAction";
import Posts from "../Posts/Posts";

const FavouritePosts = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  let { posts, loading } = useSelector((state) => state.postReducer);

  useEffect(() => {
    dispatch(getTimelinePosts(user._id));
  }, [user]);

  return (
    <div className="PostSide">
      <h3> Favourite Posts</h3>

      <Posts loading={loading} posts={posts} />
    </div>
  );
};

export default FavouritePosts;
