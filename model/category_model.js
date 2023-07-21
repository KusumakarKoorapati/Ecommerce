const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const upPath='/uploads/category'

const schema=mongoose.Schema({
    category:{
        type:String,
        required:true,
    },
    category_image:{
        type:String,
        required:true,
    },
    createAt:{
        type:String,
        required:true
    },
    updateAt:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        required:true
    }
})

const imgObj=multer.diskStorage({
    destination:(rqe,file,cb)=>{
        cb(null,path.join(__dirname,'..',upPath));
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now());
    }
})

schema.statics.upImg=multer({storage:imgObj}).single('category_image');
schema.statics.upPath=upPath;

const category=mongoose.model('category',schema);
module.exports=category;