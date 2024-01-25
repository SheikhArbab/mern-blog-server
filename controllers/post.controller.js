import { imageUploading } from '../utils/utils.js';
import Post from '../models/post.model.js';

export const createPost = async (req, res, next) => {

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');


    if (req.body.image) {
        try {
            const fileName = await imageUploading({ image: req.body.image, folder: 'posts' });

            req.body.image = fileName;

        } catch (uploadError) {
            res.json({ message: 'Error uploading image:', uploadError, success: false });
        }
    }




    const newPost = new Post({
        ...req.body,
        slug,
        author: req.validUser._id
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

export const getPosts = async (req, res, next) => {

    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 8;
        const sortDirection = req.query.order === 'asc' ? 1 : -1
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ]
            }),
        }).sort({ updateAt: sortDirection }).skip(startIndex).limit(limit)


        const totalPosts = await Post.countDocuments()

        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        })


        res.status(200).json({
            posts, 
            totalPosts,
            lastMonthPosts
        })

    } catch (error) {
        next(error)
    }

};