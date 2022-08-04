import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";


export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);
        if (user) {
            const {password, ...rest} = user._doc;
            res.status(200).json(rest);
        } else {
            res.status(404).json({message: 'Такого пользователя не существует'});
        }
    } catch (e) {
        res.status(500).json(e);
    }
}


export const updateUser = async (req, res) => {
    const id = req.params.id;
    const {currentUserId, currentUserAdminStatus, password} = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }

            const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true});
            res.status(200).json(user);
        } catch (e) {
            res.status(500).json(e)
        }
    } else {
        res.status(403).json({message: 'Доступ запрещен,вы можете обновлять только свой профиль'});
    }
}


export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const {currentUserId, currentUserAdminStatus} = req.body;

    if (currentUserId === id || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json({message: 'Пользователь успешно удалён!'})
        } catch (e) {
            res.status(500).json(e);
        }
    } else {
        res.status(403).json({message: 'Доступ запрещен,вы можете удалять только свой профиль'});
    }
}


export const followUser = async (req, res) => {
    const id = req.params.id;

    const {currentUserId} = req.body;

    if (currentUserId === id) {
        res.status(403).json({message: 'Действие запрещено!'})
    } else {
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if (!followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({$push: {followers: currentUserId}});
                await followingUser.updateOne({$push: {following: id}});
                res.status(200).json({message:'Пользователь подписан'})
            }else{
                res.status(403).json({message:'Пользователь уже подписан!'})
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

export const unFollowUser = async (req, res) => {
    const id = req.params.id;

    const {currentUserId} = req.body;

    if (currentUserId === id) {
        res.status(403).json({message: 'Действие запрещено!'})
    } else {
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if (followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({$pull: {followers: currentUserId}});
                await followingUser.updateOne({$pull: {following: id}});
                res.status(200).json({message:'Пользователь отписался'})
            }else{
                res.status(403).json({message:'Пользователь не подписан на вас!'})
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }
}