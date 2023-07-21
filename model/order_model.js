const mongoose = require('mongoose');
const schema = mongoose.Schema({
    address_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
        required: true
    },
    product_id:{
        type:String,
        ref:'product',
        required:true,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    cart_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'cart',
        required:true
    },
    pay_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'pay',
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
    }
})

const order = mongoose.model('order', schema)

module.exports = order;