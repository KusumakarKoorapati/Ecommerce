const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const upPath='/uploads/admin'

const schema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    product_type:{
        type:String,
        required:true
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
    },
    role:{
        type:String,
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

schema.statics.upImg=multer({storage:imgObj}).single('image');
schema.statics.upPath=upPath;

const admin=mongoose.model('admin',schema);
module.exports=admin;