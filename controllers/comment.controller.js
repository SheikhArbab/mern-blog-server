
import { errorHandler } from './../middlewares/errorHandler.js';
import Comment from '../models/comment.model.js'


export const newComment = async (req, res, next) => {

    const { content, postId, userId } = req.body

    try {

        if (userId !== req.validUser._id) {
            return next(errorHandler(403, 'You are not allowed to create this comment'))
        }

        const newComment = new Comment({
            content,
            userId,
            postId
        })
        await newComment.save()

        res.status(200).json({ ...newComment._doc, message: 'your comment is submitted' })

    } catch (error) {
        next(error)
    }

}
export const getComment = async (req, res, next) => {

    try {

        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 })
        res.json(comments)
    } catch (error) {
        next(error)
    }

}