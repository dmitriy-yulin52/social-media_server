import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();
const secret = 'MERN';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        if (token) {
            const decoded = jwt.verify(token, secret);
            console.log(token);
            req.body._id = decoded?.id;
        }
        next();
    } catch (e) {
        console.log(e)
    }
}


export default authMiddleware;