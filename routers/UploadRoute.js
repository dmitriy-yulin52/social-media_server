import express from "express";
import multer from 'multer'


const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
})

const upload = multer({storage});


router.post('/',upload.single('file',(req,res)=>{
    try{
        res.status(200).json({message:'File uploaded',file:req})
    }catch (e) {
        console.log(e,'post')
        res.status(500).json({message:'Не удалось загрузить фото!'})
    }
}))



export default router;

