import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
    const {username, password, firstname, lastname} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt)

    const newUser = new UserModel({username, password: hashedPass, firstname, lastname});

    try {
        await newUser.save()
        res.status(200).json(newUser)
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
            validity ? res.status(200).json(user) : res.status(400).json({message:'Неправильный пароль или логин'})

        } else {
            res.status(404).json({message:'Пользователь отсутствует'})
        }
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}