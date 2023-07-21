const model = require('../../model/admin_model');
const order = require('../../model/order_model');
const user = require('../../model/user_model');
const product = require('../../model/product_model');
const pay = require('../../model/payment_model');
const cart =require('../../model/cart_model');

const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
// dashboard
module.exports.dashboard = async (req, res) => {
    try {
        let order_data = await order.find({}).countDocuments();
        let user_data = await user.find({}).countDocuments();
        let product_data = await product.find({}).countDocuments();
        let amount = await pay.find({});
        let sum = 0;
        amount.forEach(element => {
            sum += element.amount;
        });
        res.render('admin_panel/dashboard',
            {
                order_data,
                user_data,
                product_data,
                amount: sum
            });
    } catch (error) {
        console.log("dashboard err in admin : ", error);
    }
}

//login
module.exports.login_page = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash('success', `welcome back ! ${req.user.name}`)
        return res.redirect('/des');
    } else {
        return res.render('login')
    }
}

module.exports.login = async (req, res) => {
    return res.redirect('/des')
}

//forget

module.exports.email = async (req, res) => {
    try {
        return res.render('admin_panel/forget/email');
    } catch (err) {
        console.log('forget email err : ', err);
    }
}
//otp
module.exports.otp = async (req, res) => {
    try {
        let data = await model.findOne({ email: req.body.email });
        if (data) {
            res.cookie('email', data.email);
            let otp = Math.ceil(Math.random() * 99999);
            let b_otp = await bcrypt.hash(otp.toString(), 10);
            res.cookie('otp', b_otp);

            var transporter = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "00b6f5060a9f2e",
                    pass: "ad6c80fcd868dd"
                }
            });

            const info = await transporter.sendMail({
                from: 'raxitbambharoliya@gmail.com',
                to: `${data.email}`,
                subject: "Your Otp ",
                text: `${otp}`,
            });

            res.render('admin_panel/forget/otp');
        } else {
            req.query('err', 'Invalid Email Id ...');
            res.redirect('back');
        }
    } catch (err) {
        console.log('otp send err in admin', err);
    }
}
//change password
module.exports.change_pass = async (req, res) => {
    try {
        if (req.body.n_password == req.body.c_password) {
            let pass = await bcrypt.hash(req.body.n_password, 10);
            let data = await model.findOne({ email: req.cookies.email });
            if (data) {
                let update = await model.findByIdAndUpdate(data.id, ({ password: pass }));
                if (update) {
                    res.redirect('/');
                    req.flash('success', 'password reset successfully');
                }
            } else {
                req.flash('err', "Password Can't Match ");
                res.redirect('back');
            }
        }
    } catch (err) {
        console.log('change password in forget :', err);
    }
}
//check otp
module.exports.ch_otp = async (req, res) => {
    try {
        if (await bcrypt.compare(req.body.otp, req.cookies.otp)) {
            res.render('admin_panel/forget/ch_pass');
        } else {
            req.flash('err', 'Invalid Otp');
            res.redirect('back');
        }
    } catch (err) {
        console.log('check otp post err in admin : ', err);
    }
}
//for updateAt & createdAt 
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.add_page = (req, res) => {
    return res.render('admin_panel/admin/admin_add');
}

module.exports.add = async (req, res) => {
    try {
        let data = await model.findOne({ email: req.body.email });
        if (!data) {
            req.body.createAt = nDate;
            req.body.updateAt = nDate;
            req.body.active = true;
            req.body.password = await bcrypt.hash(req.body.password, 10);
            req.body.name = req.body.fname + " " + req.body.lname;
            let image = '';
            if (req.file) {
                image = model.upPath + '/' + req.file.filename;
            }
            req.body.image = image;

            let create = await model.create(req.body);
            if (create) {
                console.log('admin addede ');
                req.flash('success', "Admin Added Successfully");
                return res.redirect('back');
            } else {
                console.log('something rong ');
                req.flash('err', "Place Enter All Information");
            }
        } else {
            // console.log('Email already excited');
            req.flash('val_err', "Email already excited");
            res.redirect('back');
        }
    } catch (err) {
        req.flash('err', "Place Enter All Information");
        console.log('add admin err : ', err);
    }
}

module.exports.view = async (req, res) => {
    try {
        let search = '';
        let page = 1;
        let par_page = 3;

        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }

        if (req.query.status == 'Active') {
            await model.findByIdAndUpdate(req.query.id, { active: false });
        }
        if (req.query.status == 'deActive') {
            await model.findByIdAndUpdate(req.query.id, { active: true });
        }
        let count = await model.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();

        let t_page = Math.ceil(count / par_page);

        let data = await model.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit(par_page * 1)
            .skip((page - 1) * par_page)
            .exec();
        return res.render('admin_panel/admin/admin_view', ({ data, search, count: t_page, page }));
    } catch (err) {
        console.log('admin view err ', err);
    }
}

module.exports.edit_page = async (req, res) => {
    try {
        let data = await model.findById(req.params.id);

        return res.render('admin_panel/admin/admin_edit', ({ data: data }));
    } catch (err) {
        console.log('admin edit page err : ', err);
    }
}

module.exports.edit = async (req, res) => {
    try {
        let id = req.body.eid;
        let data = await model.findById(id);
        if (data) {
            if (req.file) {
                let di = path.join(__dirname, '..', data.image);
                fs.unlinkSync(di);

                req.body.image = model.upPath + '/' + req.file.filename;
                req.body.name = req.body.fname + " " + req.body.lname;
                req.body.updateAt = nDate;

                let update = await model.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash('success', 'Admin Updated');
                    return res.redirect('/admin/view');
                }
            } else {
                req.body.image = data.image;
                req.body.name = req.body.fname + " " + req.body.lname;
                req.body.updateAt = nDate;

                let update = await model.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash('success', 'Admin Updated');
                    return res.redirect('/admin/view');
                }
            }
        } else {
            req.flash('err', 'something was wrong');
        }
    } catch (err) {
        console.log('edit post err in admin: ', err);
    }
}

module.exports.delete = async (req, res) => {
    try {
        let data = await model.findById(req.params.id);
        if (data) {
            let di = path.join(__dirname, '..', data.image);
            fs.unlinkSync(di);

            let delate = await model.findByIdAndDelete(req.params.id);
            if (delate) {
                req.flash('success', 'admin deleted successfully');
                res.redirect('back');
            }
        }
    } catch (err) {
        console.log('admin delete err : ', err);
    }
}

module.exports.mul_del = async (req, res) => {
    try {
        let ids = req.body.mulDel;
        ids.shift();
        ids.forEach(async element => {
            let data = await model.findById(element);
            fs.unlinkSync(path.join(__dirname, '..', data.image));
            await model.findByIdAndDelete(element);
        });
        req.flash('success', 'All Admin Deleted Successfully');
        return res.redirect('back');
    } catch (err) {
        console.log('multi delete err in admin: ', err);
    }
}

module.exports.profile = async (req, res) => {
    return res.render('admin_panel/admin/admin_profile');
}

module.exports.edit_profile_page = async (req, res) => {
    try {
        let data = await model.findById(req.params.id);
        if (data) {
            res.render('admin_panel/admin/edit_profile', { data })
        }
    } catch (err) {
        console.log('edit profile page err in admin : ', err);
    }
}

module.exports.edit_profile = async (req, res) => {
    try {
        let id = req.body.eid;
        let data = await model.findById(id);
        if (data) {
            if (req.file) {
                let di = path.join(__dirname, '..', data.image);
                fs.unlinkSync(di);

                req.body.image = model.upPath + '/' + req.file.filename;
                req.body.name = req.body.fname + " " + req.body.lname;
                req.body.updateAt = nDate;

                let update = await model.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash('success', 'Profile  Updated');
                    return res.redirect('/admin/profile');
                }
            } else {
                req.body.image = data.image;
                req.body.name = req.body.fname + " " + req.body.lname;
                req.body.updateAt = nDate;

                let update = await model.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash('success', 'Profile  Updated');
                    return res.redirect('/admin/profile');
                }
            }
        } else {
            req.flash('err', 'something was wrong');
        }
    } catch (err) {
        console.log('edit post err in admin: ', err);
    }
}
//change password in profile
module.exports.change_password = async (req, res) => {
    try {
        let data = await model.findById(req.params.id);
        if (data) {
            res.render('admin_panel/admin/ch_password')
        }

    } catch (err) {
        console.log('change password  page err in admin : ', err);
    }
}

//user
module.exports.user_view = async (req, res) => {
    try {
        let search = '';
        let page = 1;
        let par_page = 3;

        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }

        if (req.query.status == 'Active') {
            await user.findByIdAndUpdate(req.query.id, { active: false });
        }
        if (req.query.status == 'deActive') {
            await user.findByIdAndUpdate(req.query.id, { active: true });
        }
        let count = await user.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();

        let t_page = Math.ceil(count / par_page);

        let data = await user.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit(par_page * 1)
            .skip((page - 1) * par_page)
            .exec();
        return res.render('admin_panel/user_view', ({ data, search, count: t_page, page }));
    } catch (err) {
        console.log('user view err in admin ', err);
    }
}
module.exports.delete_user = async (req, res) => {
    try {
        let delate = await user.findByIdAndDelete(req.params.id);
        if (delate) {
                req.flash('success', 'admin deleted successfully');
                res.redirect('back');
        }
    } catch (err) {
        console.log('delete user in admin : ', err);
    }
}
module.exports.mul_del_user=async (req,res)=>{
 try{
    let ids = req.body.mulDel;
    ids.shift();
    ids.forEach(async element => {
         await user.findByIdAndDelete(req.params.id);
    });
    req.flash('success', 'All Admin Deleted Successfully');
    return res.redirect('back');
}catch(err){
console.log('',err);
}
}

//order
module.exports.order_view = async (req, res) => {
    try {
        let search = '';
        let page = 1;
        let par_page = 3;

        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }

        if (req.query.status == 'Active') {
            await order.findByIdAndUpdate(req.query.id, { active: false });
        }
        if (req.query.status == 'deActive') {
            await order.findByIdAndUpdate(req.query.id, { active: true });
        }
        let count = await order.find({
            
        }).countDocuments();

        let t_page = Math.ceil(count / par_page);

        let data = await order.find({
            
        }).limit(par_page * 1)
        .populate('product_id')
        .populate('cart_id')
            .skip((page - 1) * par_page)
            .exec();
        return res.render('admin_panel/order_view', ({ data, search, count: t_page, page }));
    } catch (err) {
        console.log('order view err in admin ', err);
    }
}
module.exports.delete_order = async (req, res) => {
    try {
        let or_data=await order.findById(req.params.id).populate('product_id').populate('pay_id').populate('cart_id');
        let cart_sta=await cart.findByIdAndUpdate(or_data.cart_id.id,{status:'pending'});
        let pr_price=or_data.product_id.price*or_data.cart_id.quantity;
        let amount_mi=await pay.findById(or_data.pay_id.id);
        let n_amount=amount_mi.amount-pr_price;
        if(n_amount<0){
            await pay.findByIdAndDelete(or_data.pay_id.id);
        }else{
            let update_amount = await pay.findByIdAndUpdate(or_data.pay_id.id,{amount:n_amount});
        }
        let delate=await order.findByIdAndDelete(req.params.id);
        if(delate){
             req.flash('success', 'admin deleted successfully');
             res.redirect('back');
        }
    } catch (err) {
        console.log('delete order in admin : ', err);
    }
}
module.exports.mul_del_order=async (req,res)=>{
 try{
    let ids = req.body.mulDel;
    ids.shift();
    ids.forEach(async element => {
        let or_data=await order.findById(element).populate('product_id').populate('pay_id').populate('cart_id');
        let cart_sta=await cart.findByIdAndUpdate(or_data.cart_id.id,{status:'pending'});
        let pr_price=or_data.product_id.price*or_data.cart_id.quantity;
        let amount_mi=await pay.findById(or_data.pay_id.id);
        let n_amount=amount_mi.amount-pr_price;

        if(n_amount<0){
            await pay.findByIdAndDelete(or_data.pay_id.id);
        }else{
            let update_amount = await pay.findByIdAndUpdate(or_data.pay_id.id,{amount:n_amount});
        }

        await order.findByIdAndDelete(element);
    });
    req.flash('success', 'All Admin Deleted Successfully');
    res.redirect('/admin/order_view');
}catch(err){
console.log('',err);
}
}