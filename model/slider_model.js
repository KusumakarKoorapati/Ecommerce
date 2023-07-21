const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const upPath='/uploads/slider';

const schema=mongoose.Schema({
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        required:true
    },
    slider_image:{
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

schema.statics.upImg=multer({storage:imgObj}).single('slider_image');
schema.statics.upPath=upPath;


const slider=mongoose.model('slider',schema);
module.exports=slider;