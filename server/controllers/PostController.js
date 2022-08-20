import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";
import { createError } from "../middleware/error.js";

// creating a post

export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id).populate([
      {
        path: "reviews.user",
        select: "firstname lastname  username profilePicture",
      },
      { path: "userId", select: "profilePicture firstname lastname  username " },
    ]);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getPosts = async (req, res) => {


  try {
    const post = await PostModel.find({}).populate([
      {
        path: "reviews.user",
        select: "firstname lastname  username profilePicture ",
      },
      { path: "userId", select: "firstname lastname  username profilePicture" },
    ]).sort({ _id: -1 })
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};
// export const getPostById = async (req, res) => {
//   const id = req.params.id;

//   try {
//     const post = await PostModel.findById(id);
//     res.status(200).json(post);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// update post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated!");
    } else {
      res.status(403).json("Authentication failed");
    }
  } catch (error) { }
};

// delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted.");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post disliked");
    } else {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline posts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });

    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};


export const createReview = async (req, res, next) => {
  const { rating, comment } = req.body;



  try {
    const touristPlace = await PostModel.findById({ _id: req.params.id });

    if (touristPlace) {

      console.log(req.body._id, "req.body._id")
      const alreadyReviewed = touristPlace.reviews.find(
        (r) => r.user.toString() === req.body._id.toString()
      );

      if (alreadyReviewed) {
        return next(createError(409, " already reviewed"));
      }

      try {
        const review = {
          rating: Number(rating),
          comment,
          user: req.body._id,
        };

        touristPlace.reviews.push(review);

        touristPlace.numReviews = touristPlace.reviews.length;

        touristPlace.rating =
          touristPlace.reviews.reduce((acc, item) => item.rating + acc, 0) /
          touristPlace.reviews.length;

        await touristPlace.save();
        res.status(201).json({ message: "Review added", success: true });
      } catch (error) {
        return next(error);
      }
    } else {
      return next(createError(404, "product not found"));
    }
  } catch (error) {
    next(error);
  }
};