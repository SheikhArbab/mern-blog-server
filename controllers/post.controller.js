import { imageUploading } from '../utils/utils.js';
import Post from '../models/post.model.js';

export const createPost = async (req, res, next) => {
    try {
        // Generate Slug
        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');

        // Check for Image
        if (req.body.image) {
            try {
                // Upload Image
                const fileName = await imageUploading({ image: req.body.image, folder: 'posts' });
                req.body.image = fileName;
            } catch (uploadError) {
                return res.json({ message: 'Error uploading image:', uploadError, success: false });
            }
        }

        // Create Post Object
        const newPost = new Post({
            ...req.body,
            slug,
            author: req.validUser._id
        });

        const savedPost = await newPost.save();

        // Return Success Response
        res.status(201).json({ savedPost, message: "Your post has been successfully published." });
    } catch (error) {
        // Handle Error
        next(error);
    }
};



export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find and delete the post
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found', success: false });
        }

        res.status(200).json({ deletedPost, message: 'Post deleted successfully', success: true });
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



export const getPostById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);

        if (!post) {
            // If post with the given ID is not found, return a 404 response
            return res.status(404).json({
                error: 'Post not found',
            });
        }

        // If the post is found, return a success response with the post data
        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        next(error);
    }
};

export const updatePost = async (req, res, next) => {
    const { id } = req.params;
    const { title, image, content, category } = req.body;
 

    try {
        // Find the post by ID
        const post = await Post.findById(id);

        if (!post) {
            // If post with the given ID is not found, return a 404 response
            return res.status(404).json({
                error: 'Post not found',
            });
        }

        // Update post fields
        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;

        // Check if a new image is provided
        if (image) {
            try {
                // Implement your image uploading logic here
                // For example, assuming you have an imageUploading function
                const fileName = await imageUploading({ image, folder: 'posts' });
                post.image = fileName;
            } catch (uploadError) {
                return res.status(500).json({ error: 'Error uploading image', uploadError });
            }
        }

        // Save the updated post
        await post.save();

        // Return a success response with the updated post data
        res.status(200).json({
            success: true,
            data: post,
            message: 'Post Updated successfully',
        });
    } catch (error) {
        // Handle any errors that occur during the database query or update
        next(error);
    }
};
