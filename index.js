import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';


const app = express();
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));


const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/SocialMedia', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => app.listen(5555, () => console.log(`server started on PORT = ${5555}`)))


    } catch (e) {
        console.log(e, 'not connected DB')
    }
}

start()