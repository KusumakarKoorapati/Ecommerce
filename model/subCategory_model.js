const mongoose=require('mongoose');
const schema=mongoose.Schema({
    sub_category:{ 
        type:String,
        required:true
    },
    cat_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
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

const sub_category=mongoose.model('sub_category',schema)

module.exports=sub_category;