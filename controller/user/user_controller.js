const category = require('../../model/category_model');
const sub_cat = require('../../model/subCategory_model');
const ex_cat = require('../../model/extCategory_model');
const product = require('../../model/product_model');
const brand = require('../../model/brand_model');
const slider = require('../../model/slider_model');
const address = require('../../model/address_model');
const order = require('../../model/order_model');
const model = require('../../model/user_model');
const cart = require('../../model/cart_model');
const pay = require('../../model/payment_model');

const bcrypt = require('bcrypt');
var stripe = require('stripe')('sk_test_51NSCzhSD9ziaLFcdt3BSz9g2yMG2jhKvtEu4q7Co6i5HVWf4WIaTqmdHLTIPlhTEaHMQFGecT1vFwaHJLfs9OmUQ00wWh6mYsY');
const nodemailer = require('nodemailer');

//for updateAt & createdAt 
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});


module.exports.index = async (req, res) => {
    try {
        let cat_data = await category.find({ active: true });
        let sub_data = await sub_cat.find({ active: true });
        let ex_data = await ex_cat.find({ active: true });
        let brand_data = await brand.find({ active: true });
        let last = await product.find({ active: true }).sort({ _id: -1 }).limit(6);
        let slider_data = await slider.find({ active: true }).populate("product_id").exec();

        let search = '';

        if (req.query.search) {
            search = req.query.search;
        }

        var cart_count = 0;
        if (req.user) {
            cart_count = await cart.find({ user_id: req.user.id }).countDocuments();
        }
        return res.render('user/index', {
            category: cat_data,
            sub_cat: sub_data,
            ex_cat: ex_data,
            brand: brand_data,
            slider: slider_data,
            last,
            cart_count,
            search
        });
    } catch (err) {
        console.log('user index page err : ', err);
    }
}

module.exports.all_product = async (req, res) => {
    try {
        let cat_data = await category.find({ active: true });
        let sub_data = await sub_cat.find({ active: true });
        let ex_data = await ex_cat.find({ active: true });
        let brand_data = await brand.find({ active: true });
        var cart_count = 0;
        if (req.user) {
            cart_count = await cart.find({ user_id: req.user.id }).countDocuments();
        }

        let page = 1;
        let search = '';

        if (req.query.search) {
            search = req.query.search;
        }

        if (req.query.page) {
            page = req.query.page;
        }

        let product_data = await product.find({
            active: true,
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit(page * 3).exec();

        let t_product = await product.find({
            active: true,
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();
        let t_pro = Math.ceil(t_product / 3);

        //filter price
        let data_fil = await product.find({
            active: true,
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })

        //filter brand
        let pro_data = await product.find({})
            .distinct('brand_id')
            .populate('brand_id')
            .exec();

        let brand_filter_data = await brand.find({ '_id': pro_data });


        var max = 0, min = data_fil[0].price;
        data_fil.forEach(async element => {
            max = Math.max(max, element.price);
            min = Math.min(min, element.price);
        });
        return res.render('user/product_all', {
            category: cat_data,
            sub_cat: sub_data,
            ex_cat: ex_data,
            brand: brand_data,
            product_data: product_data,
            cart_count,
            page: parseInt(page),
            t_product: t_pro,
            search,
            min,
            max,
            brand: brand_filter_data
        });
    } catch (err) {
        console.log('product page load err in user : ', err);
    }
}

module.exports.product = async (req, res) => {
    try {
        let cat_data = await category.find({ active: true });
        let sub_data = await sub_cat.find({ active: true });
        let ex_data = await ex_cat.find({ active: true });
        var cart_count = 0;
        if (req.user) {
            cart_count = await cart.find({ user_id: req.user.id }).countDocuments();
        }

        let search = '';

        if (req.query.search) {
            search = req.query.search;
        }

        let product_data = await product.find({ sub_id: req.params.sub, cat_id: req.params.cat, ex_id: req.params.ex });

        return res.render('user/product', {
            category: cat_data,
            sub_cat: sub_data,
            ex_cat: ex_data,
            product_data: product_data,
            cart_count, search

        });
    } catch (err) {
        console.log('product page load err in user : ', err);
    }
}

module.exports.single_product = async (req, res) => {
    try {
        let cat_data = await category.find({ active: true });
        let sub_data = await sub_cat.find({ active: true });
        let ex_data = await ex_cat.find({ active: true });
        var cart_count = 0;
        if (req.user) {
            cart_count = await cart.find({ user_id: req.user.id }).countDocuments();
        }

        let search = '';

        if (req.query.search) {
            search = req.query.search;
        }

        let data = await product.findById(req.params.id);

        let sug = await product.find({ cat_id: data.cat_id, sub_id: data.sub_id, ex_id: data.ex_id });
        if (data) {
            return res.render('user/single_product', {
                data,
                category: cat_data,
                sub_cat: sub_data,
                ex_cat: ex_data,
                cart_count,
                sug,
                search
            })
        }
    } catch (err) {
        console.log('single product err in user ', err);
    }
}

module.exports.user_register = async (req, res) => {
    try {
        let data = await model.findOne({ email: req.body.email });
        if (!data) {
            req.body.name = req.body.fname + " " + req.body.lname;
            req.body.active = true;
            req.body.createAt = nDate;
            req.body.updateAt = nDate;

            if (req.body.password == req.body.c_password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }
            req.body.role = 'user';
            await model.create(req.body);
            return res.redirect('/');
        }

    } catch (err) {
        console.log('register err in user : ', err);
    }
}
module.exports.product_cat = async (req, res) => {
    try {
        let cat_data = await category.find({ active: true });
        let sub_data = await sub_cat.find({ active: true });
        let ex_data = await ex_cat.find({ active: true });
        var cart_count = 0;
        if (req.user) {
            cart_count = await cart.find({ user_id: req.user.id }).countDocuments();
        }
        let search = '';

        if (req.query.search) {
            search = req.query.search;
        }

        let product_data = await product.find({ active: true, cat_id: req.params.id });



        return res.render('user/product', {
            category: cat_data,
            sub_cat: sub_data,
            ex_cat: ex_data,
            product_data: product_data,
            cart_count,
            search

        });
    } catch (err) {
        console.log('product page load err in user : ', err);
    }
}

module.exports.login = async (req, res) => {
    try {
        return res.redirect('back');
    } catch (err) {
        console.log('login err  in controller in user : ', err);
    }
}

module.exports.cart_page = async (req, res) => {
    try {
        let cat_data = await category.find({ active: true });
        let sub_data = await sub_cat.find({ active: true });
        let ex_data = await ex_cat.find({ active: true });
        var cart_count = 0;
        let search = '';

        if (req.query.search) {
            search = req.query.search;
        }

        if (req.user) {
            cart_count = await cart.find({ user_id: req.user.id }).countDocuments();
        }

        let cart_data = await cart.find({ user_id: req.user.id }).populate('product_id').exec();

        return res.render('user/cart', {
            category: cat_data,
            sub_cat: sub_data,
            ex_cat: ex_data,
            cart_count,
            cart: cart_data,
            search
        });
    } catch (err) {
        console.log('add to cart page err in user : ', err);
    }
}

module.exports.add_cart = async (req, res) => {
    try {
        let check = await cart.find({ product_id: req.body.product_id, user_id: req.user.id });
        if (check.length < 1) {
            req.body.user_id = req.user.id;
            req.body.active = true;
            req.body.createAt = nDate;
            req.body.updateAt = nDate;
            req.body.status = "pending";
            let data = await cart.create(req.body);
            if (data) {
                res.redirect('back');
            }
        } else {
            req.flash('err', 'this product is ready added in cart !');
            res.redirect('back');
        }
    } catch (err) {
        console.log('add to cart err in user : ', err);
    }
}

module.exports.change_quantity = async (req, res) => {
    try {
        let update = await cart.findByIdAndUpdate(req.body.id, { quantity: req.body.quantity });
        if (update) {
            return res.json({ status: 200, msg: "quantity is changed " });
        }
    } catch (err) {
        console.log('add quantity err in cart : ', err);
    }
}
module.exports.delete = async (req, res) => {
    try {
        let data = await cart.findByIdAndDelete(req.params.id);
        if (data) {
            res.redirect('back');
        }
    } catch (err) {
        console.log('cart product delete err : ', err);
    }
}

module.exports.check_out_page = async (req, res) => {
    try {
        let cat_data = await category.find({ active: true });
        let sub_data = await sub_cat.find({ active: true });
        let ex_data = await ex_cat.find({ active: true });
        let cart_data = await cart.find({ user_id: req.user.id }).populate('product_id').exec();
        let address_data = await address.find().populate("user_id");
        let search = '';

        if (req.query.search) {
            search = req.query.search;
        }

        var cart_count = 0;
        if (req.user) {
            cart_count = await cart.find({ user_id: req.user.id }).countDocuments();
        }
        return res.render('user/check_out', {
            category: cat_data,
            sub_cat: sub_data,
            ex_cat: ex_data,
            address: address_data,
            cart_count,
            cart_data,
            search

        });
    } catch (err) {
        console.log('check out page err : ', err);
    }
}


module.exports.payment = async (req, res) => {
    req.body.active = true;
    req.body.createAt = nDate;
    req.body.updateAt = nDate;
    req.body.user_id = req.user.id;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(req.body.amount),
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
    });
    if (paymentIntent) {
        let card_num = req.body.card_num.replaceAll(" ", "");
        req.body.card_num = parseInt(card_num);
        req.body.amount = parseInt(req.body.amount) - 100;
        req.body.ex_date = req.body.mon + "/" + req.body.year;
        let payment = await pay.create(req.body);
        if (payment) {
            req.body.pay_id = payment.id;
            let pro_id = req.body.product_id.split(",");
            pro_id.forEach(async element => {
                let qun = await cart.findOne({ product_id: element });
                let update = await cart.findByIdAndUpdate(qun.id, { status: "conform" });
                if (update) {
                    req.body.cart_id = qun.id;
                    req.body.product_id = element;
                    let order_data = await order.create(req.body);
                    if (order_data) {
                        var transporter = nodemailer.createTransport({
                            host: "sandbox.smtp.mailtrap.io",
                            port: 2525,
                            auth: {
                                user: "00b6f5060a9f2e",
                                pass: "ad6c80fcd868dd"
                            }
                        });

                        const info = await transporter.sendMail({
                            from: 'raxitbambharoliya@gmail.com', // sender address
                            to: req.user.email, // list of receivers
                            subject: "Your Order success fully ", // Subject line
                            text: `
                                card detail: ${req.body.card_num}`, // plain text body
                            html: "order received successfully ", // html body
                        });

                    }
                }
            });
        }
    }
    res.redirect('/order_page');


}

module.exports.add_address = async (req, res) => {
    try {
        req.body.active = true;
        req.body.createAt = nDate;
        req.body.updateAt = nDate;
        req.body.user_id = req.user.id;
        let data = await address.create(req.body);
        if (data) {
            res.redirect('back')
        }

    } catch (err) {
        console.log('add address err in user : ', err);
    }
}


module.exports.order_page = async (req, res) => {
    try {
        let cat_data = await category.find({ active: true });
        let sub_data = await sub_cat.find({ active: true });
        let ex_data = await ex_cat.find({ active: true });
        var cart_count = 0;
        let search = '';

        if (req.query.search) {
            search = req.query.search;
        }

        if (req.user) {
            cart_count = await cart.find({ user_id: req.user.id }).countDocuments();
        }


        let data = await order.find({ user_id: req.user.id }).populate("address_id").populate("product_id").populate('cart_id').populate('pay_id').exec();

        return res.render('user/order', {
            category: cat_data,
            sub_cat: sub_data,
            ex_cat: ex_data,
            cart_count,
            data,
            search
        });
    } catch (err) {
        console.log('add to cart page err in user : ', err);
    }
}

module.exports.cancel_ord = async (req, res) => {
    try {
        let or_data = await order.findById(req.params.id).populate('product_id').populate('pay_id').populate('cart_id');
        // console.log(or_data);
        let cart_sta = await cart.findByIdAndUpdate(or_data.cart_id.id, { status: 'pending' });
        let pr_price = or_data.product_id.price * or_data.cart_id.quantity;
        let amount_mi = await pay.findById(or_data.pay_id.id);
        let n_amount = amount_mi.amount - pr_price;
        if (n_amount <= 0) {
            await pay.findByIdAndDelete(or_data.pay_id.id);
        } else {
            let update_amount = await pay.findByIdAndUpdate(or_data.pay_id.id, { amount: n_amount });
        }

        let delate = await order.findByIdAndDelete(req.params.id);

        if (delate) {
            res.redirect('/order_page');
        }
    } catch (err) {
        console.log('order cancel err in user: ', err);
    }
}

module.exports.filter = async (req, res) => {
    try {
        let min = parseInt(req.body.min);
        let max = parseInt(req.body.max) + 100;
        console.log(req.body.brand);
        console.log(min);
        let product_data;

        console.log(min);

        if (req.body.brand && min) {
            // console.log('brand & price');
            product_data = await product.find({ price: { $gte: min, $lte: max }, brand_id: req.body.brand });
        } else if (req.body.brand && !min ) {
            product_data = await product.find({ brand_id: req.body.brand });
            // console.log("brnd");
        }
        else {
            // console.log("price");
            product_data = await product.find({ price: { $gte: min, $lte: max } });
        }
        // console.log(product_data);
        return res.render('user/product_filter', { product_data });

    } catch (err) {
        console.log('filter data err in user : ', err);
    }
}

module.exports.filter_all = async (req, res) => {
    try {
        let data = await product.find();
        return res.render('user/product_filter', { product_data: data });
    } catch (err) {
        console.log('filter all data err in user : ', err);
    }
}