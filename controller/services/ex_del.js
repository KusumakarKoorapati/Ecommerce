const type = require('../../model/type_model');
const brand = require('../../model/brand_model');
const product = require('../../model/product_model');
const cart =require('../../model/cart_model');

const path = require('path');
const fs = require('fs');

async function del(model, id) {
    try {
        await model.findByIdAndDelete(id);

    } catch (err) {
        if (err) {
            console.log("delete err ", err)
        }
    }
}


exports.type_data = async (id) => {
    try {
        let data = await type.find({ ex_id: id });
        data.forEach(element => {
            del(type, element.id);
        });
        return true;
    } catch (err) {
        if (err) {
            console.log("type delete err in services", err)
        }
    }
}

exports.brand_data = async (id) => {
    try {
        let data = await brand.find({ ex_id: id });
        data.forEach(async element => {
            let data = await brand.findById(element.id);
            if (data) {
                fs.unlinkSync(path.join(__dirname, '../..', data.image));
                 await brand.findByIdAndDelete(element.id);
            }
        });
        return data;
    } catch (err) {
        if (err) {
            console.log("brand delete err in services", err)
        }
    }

}

exports.product_data = async (id) => {
    try {
        let data = await product.find({ ex_id: id });

        data.forEach(async element => {

            let cart_data=await cart.find({product_id:element.id});
            if(cart_data){
                cart_data.forEach( element => {
                    del(cart,element.id);
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