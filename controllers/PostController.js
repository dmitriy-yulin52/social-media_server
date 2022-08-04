import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);
    try {
        await newPost.save()
        res.status(200).json({message: 'Пост создан'});
    } catch (e) {
        res.status(500).json(e)
    }

}


export const getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await PostModel.findById(id);
        res.status(200).json(post);

    } catch (e) {
        res.status(500).json(e)
    }
}


export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const {userId} = req.body;

    try {
        const post = await PostModel.findById(postId);

        if (userId === post.userId) {
            await post.updateOne({$set: req.body})
            res.status(200).json({message: 'Пост обновлен!'})
        } else {
            res.status(403).json({message: 'Действие запрещено'})
        }

    } catch (e) {
        res.status(500).json(e)
    }
}


export const deletePost = async (req, res) => {
    const postId = req.params.id;
    const {userId} = req.body;

    try {
        const post = await PostModel.findById(postId);
        if (userId === post.userId) {
            await post.deleteOne();
            res.status(200).json({message: 'Пост успешно удален!'})
        } else {
            res.status(403).json({message: 'Действие запрещено'})
        }
    } catch (e) {
        res.status(500).json(e)
    }
}


export const likePost = async (req, res) => {
    const id = req.params.id;
    const {userId} = req.body;

    try {
        const post = await PostModel.findById(id);
        if (!post.likes.includes(userId)) {
            await post.updateOne({$push: {likes: userId}});
            res.status(200).json({message: 'Cообщение понравилось'})
        } else {
            await post.updateOne({$pull: {likes: userId}});
            res.status(200).json({message: 'Cообщение не понравилось'})
        }

    } catch (e) {
        res.status(500).json(e)
    }
}


export const getTimeLinePosts = async (req, res) => {
    const userId = req.params.id;

    try {
        const currentUserPosts = await PostModel.find({userId: userId});
        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'following',
                    foreignField: 'userId',
                    as: 'followingPosts'
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ]);


        const result = [...followingPosts[0].followingPosts.sort((a, b) => b.createdAt + a.updatedAt)]

        res.status(200).json(result)

    } catch (e) {
        res.status(500).json(e)
    }

}
