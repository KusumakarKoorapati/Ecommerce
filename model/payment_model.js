const mongoose=require('mongoose');
const schema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    card_num:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true,
    },
    ex_date:{
        type:String,
        required:true
    },
    cvv:{
        type:Number,
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

const pay=mongoose.model('pay',schema);
module.exports=pay;