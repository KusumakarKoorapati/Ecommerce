const mongoose=require('mongoose');
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
    type:{
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

const type=mongoose.model('type',schema)

module.exports=type;