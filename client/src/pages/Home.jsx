import React from "react";
import FavouritePosts from "../components/PostSide/FavouritePosts";
import PostSide from "../components/PostSide/PostSide";
import ProfileSide from "../components/profileSide/ProfileSide";
import RightSide from "../components/RightSide/RightSide";
import "./Home.css";
const Home = () => {
  return (
    <div className="Home">
      <ProfileSide />
      <PostSide />
      <FavouritePosts />
    </div>
  );
};

export default Home;
