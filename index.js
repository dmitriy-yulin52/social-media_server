import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AuthRoute from "./routers/AuthRoute.js";
import UserRoute from "./routers/UserRoute.js";
import PostRoute from "./routers/PostRoute.js";

const app = express();
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

app.use('/auth',AuthRoute);
app.use('/user',UserRoute);
app.use('/post',PostRoute);

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