import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'
import AuthRoute from "./routers/AuthRoute.js";
import UserRoute from "./routers/UserRoute.js";
import PostRoute from "./routers/PostRoute.js";
import UploadRoute from "./routers/UploadRoute.js";

const app = express();
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200
}));

app.use(express.static('public'));
app.use('/images', express.static('images'));


dotenv.config();

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => app.listen(process.env.PORT, () => console.log(`server started on PORT = ${process.env.PORT}`)))
    } catch (e) {
        console.log(e, 'not connected DB')
    }
}


start();


app.use('/auth',AuthRoute);
app.use('/user',UserRoute);
app.use('/post',PostRoute);
app.use('/upload',UploadRoute);