import React, { useState } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useSelector } from "react-redux";
import { Rate, Tag } from "antd";
import { useNavigate } from "react-router-dom";

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);
  const navigate = useNavigate();

  const handelDetails = (id) => {
    navigate(`/postDetails/${id}`);
  };
  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };
  return (
    <div className="Post">
      <Tag
        icon={
          <img
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
            src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""}
            alt=""
          />
        }
        color="blue"
      >
        <strong style={{ marginLeft: "10px" }}> {data?.userId?.username}</strong>
      </Tag>
      <img src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""} alt="" />

      <div className="postReact">
        <img src={liked ? Heart : NotLike} alt="" style={{ cursor: "pointer" }} onClick={handleLike} />
        <img onClick={() => handelDetails(data?._id)} style={{ cursor: "pointer" }} src={Comment} alt="" />
        <Tag className="text-capitalize" color="cyan">
          {" "}
          {data.district && data.district}{" "}
        </Tag>

        <Rate allowHalf disabled defaultValue={data?.rating} />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>{likes} likes</span>

      <span>
        <b style={{ fontSize: "17px" }}>{data.title && data.title} </b>
      </span>
      <div className="detail">
        <span>{data.desc}</span>
      </div>
    </div>
  );
};

export default Post;
