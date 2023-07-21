const mongoose=require('mongoose');
const schema=mongoose.Schema({
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        required:true,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    quantity:{
        type:String,
        required:true,
    },
    size:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        require:true,
    },
    color:{
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

const cart=mongoose.model('cart',schema);
module.exports=cart;