const mongoose = require('mongoose'); 
const multer=require('multer');
const path=require('path');

const upPath_single='/uploads/product/single'; 
const upPath_multi='/uploads/product/multi';

const schema = mongoose.Schema({
    sub_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sub_category',
        required: true
    },
    cat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    ex_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ex_category',
        required: true
    },
    type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'type',
        required: true
    },
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: String,
        required: true
    }, 
    image: {
        type: String,
        required: true
    },
    mul_image:{
        type:Array,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createAt: {
        type: String,
        required: true
    },
    updateAt: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    //new added
    size:{
        type:Array,
    },
    color:{
        type:Array
    }
})

let imgObj=multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file.fieldname=='image'){
            cb(null,path.join(__dirname,'..',upPath_single));
        }else{
            cb(null,path.join(__dirname,'..',upPath_multi));
        }
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Math.round(Math.random()*10000000));
    }
})

schema.statics.upImg=multer({storage:imgObj}).fields([{name:'image',maxCount:1},{name:'mul_image',maxCount:3}]);
schema.statics.upPath_single=upPath_single;
schema.statics.upPath_multi=upPath_multi;

const product = mongoose.model('product', schema)
module.exports = product;