import express from 'express'
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost,getPosts, createReview } from '../controllers/PostController.js'
import authMiddleWare from '../middleware/AuthMiddleware.js'
const router = express.Router()

router.post('/',createPost)
router.get('/:id', getPost)
router.get('/', getPosts)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.put('/:id/like', likePost)
router.get('/:id/timeline', getTimelinePosts)
router.put("/review/:id",  authMiddleWare, createReview);

export default router