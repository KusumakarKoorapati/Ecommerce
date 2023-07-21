const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const upPath='/uploads/brand';

const schema=mongoose.Schema({
    cat_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    }, 
    sub_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'sub_category',
        required:true
    },
    ex_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ex_category',
        required:true
    },
    brand:{
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
    image:{
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

const brand=mongoose.model('brand',schema)

module.exports=brand;