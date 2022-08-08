import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




export const getAllUser  = async (req,res)=>{

    try{
        const users = await UserModel.find()
        const newUsers = users.map((user)=>{
            const {password,...rest} = user._doc;
            return rest

        })
        res.status(200).json(newUsers);
    }catch (e) {
        res.status(500).json(e);
    };
}

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
  const { _id} = req.body;

  if (id === _id) {
    try {
      // if (password) {
      //   const salt = await bcrypt.genSalt(10);
      //   req.body.password = await bcrypt.hash(password, salt);
      // }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        'MERN',
        { expiresIn: "1h" }
      );
      res.status(200).json({user, token});
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Доступ запрещен,вы можете обновлять только свой профиль!");
  }
};


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
  const { _id } = req.body;
  console.log(id, _id)
  if (_id === id) {
    res.status(403).json("Действие запрещено!");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("Пользователь отписался!");
      } else {
        res.status(403).json("Пользователь уже подписан!");
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
};


export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if(_id === id)
  {
    res.status(403).json("Действие запрещено!")
  }
  else{
    try {
      const unFollowUser = await UserModel.findById(id)
      const unFollowingUser = await UserModel.findById(_id)


      if (unFollowUser.followers.includes(_id))
      {
        await unFollowUser.updateOne({$pull : {followers: _id}})
        await unFollowingUser.updateOne({$pull : {following: id}})
        res.status(200).json("Пользователь отписался!")
      }
      else{
        res.status(403).json("Пользователь не подписан на вас!")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
};

