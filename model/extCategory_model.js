const mongoose = require('mongoose');
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
    extra_category: {
        type: String,
        required: true
    },
    size: {
        type: Array,
        required: false
    }, 
    color: {
        type: Array,
        required: false
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

const ex_category = mongoose.model('ex_category', schema)

module.exports = ex_category;