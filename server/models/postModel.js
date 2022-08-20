import mongoose from "mongoose";


const reviewSchema = mongoose.Schema(
  {

    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users" },
    desc: { type: String, required: true },
    title: {

      type: String,
      required: true,
    },
    district: {

      type: String,
      required: true,
    },
    likes: [],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: new Date(),
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

var PostModel = mongoose.model("Posts", postSchema);

export default PostModel;
