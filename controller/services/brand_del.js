const product = require('../../model/product_model');
const cart =require('../../model/cart_model');

const path = require('path');
const fs = require('fs');

exports.product_data = async (id) => {
    try {
        let data = await product.find({ brand_id: id });

        data.forEach(async element => {

            let cart_data=await cart.find({product_id:element.id});
            if(cart_data){
                cart_data.forEach(async element => {
                    await model.findByIdAndDelete(element.id);
                });
            }

            let data = await product.findById(element.id);
            if (data) {
                fs.unlinkSync(path.join(__dirname, '../..', data.image))
                for (var i = 0; i < data.mul_image.length; i++) {
                    fs.unlinkSync(path.join(__dirname, '../..', data.mul_image[i]))
                }
            }
            await product.findByIdAndDelete(element.id);
        });
        return true;
    } catch (err) {
        if (err) {
            console.log("product delete err in services", err)
        }
    }
}