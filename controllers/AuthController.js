import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    const {username, password, firstname, lastname} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt)
    const newUser = new UserModel({lastname, password: hashedPass, firstname, username});

    try {
        const oldUser = await UserModel.findOne({username});
        if (oldUser) {
            res.status(400).json({message: `Пользователь с почтовым адресом ${username} уже существует`})
        }
        const userBD = await newUser.save()

        const {password,...user} = userBD._doc

        const token = jwt.sign({
            username: user.username, id: user._id
        }, process.env.JWT_KEY, {expiresIn: '1h'})
        res.status(200).json({user, token})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

export const loginUser = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await UserModel.findOne({username});


        if (user) {
            const validity = await bcrypt.compare(password, user.password);

            if (!validity) {
                res.status(400).json({message: 'Неверный пароль'})
            } else {
                const token = jwt.sign({
                    username: user.username, id: user._id
                }, process.env.JWT_KEY, {expiresIn: '1h'})
                res.status(200).json({user, token})
            }
        } else {
            res.status(404).json({message: 'Пользователь отсутствует'})
        }
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}