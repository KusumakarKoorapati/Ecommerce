const model = require('../../model/category_model');

const sub_cat = require('../../model/subCategory_model');
const ex_cat = require('../../model/extCategory_model');
const product = require('../../model/product_model');
const type = require('../../model/type_model')
const brand = require('../../model/brand_model')

const cat_del = require('../services/deletion_services');

const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');


//for updateAt & createdAt 
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.add_page = (req, res) => {
    return res.render('admin_panel/category/category_add');
}

module.exports.add = async (req, res) => {
    try {
        let data = await model.findOne({ category: req.body.category });
        if (!data) {
            req.body.createAt = nDate;
            req.body.updateAt = nDate;
            req.body.active = true;
            let image = '';
            if (req.file) {
                image = model.upPath + '/' + req.file.filename;
            }
            req.body.category_image = image;

            let create = await model.create(req.body);
            if (create) {
                req.flash('success', "Category Added Successfully");
                return res.redirect('back');
            } else {
                req.flash('err', "Place Enter All Information");
                return res.redirect('back');
            }
        } else {
            // console.log('Email already excited');
            req.flash('val_err', "category already excited");
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
        let par_page = 5;

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
                { category: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();

        let t_page = Math.ceil(count / par_page);

        let data = await model.find({
            $or: [
                { category: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit(par_page * 1)
            .skip((page - 1) * par_page)
            .exec();
        return res.render('admin_panel/category/category_view', ({ data, search, count: t_page, page }));
    } catch (err) {
        console.log('admin view err ', err);
    }
}

module.exports.edit_page = async (req, res) => {
    try {
        let data = await model.findById(req.params.id);

        return res.render('admin_panel/category/category_edit', ({ data: data }));
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
                let di = path.join(__dirname, '../..', data.category_image);
                fs.unlinkSync(di);

                req.body.category_image = model.upPath + '/' + req.file.filename;
                req.body.updateAt = nDate;

                let update = await model.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash('success', 'Category Updated');
                    return res.redirect('/admin/category/view');
                }
            } else {
                req.body.image = data.category_image;
                req.body.updateAt = nDate;

                let update = await model.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash('success', 'Category Updated');
                    return res.redirect('/admin/category/view');
                }
            }
        } else {
            req.flash('err', 'something was wrong');
            return res.redirect('back');
        }
    } catch (err) {
        console.log('edit post err in admin: ', err);
        return res.redirect('back');
    }
}

module.exports.delete = async (req, res) => {
    try {
        let data = await model.findById(req.params.id);
        if (data) {

            //sub cat
            cat_del.sub_cat_data(data.id);
            //ex cat 
            cat_del.ex_cat_data(data.id);
            //brand
            cat_del.brand_data(data.id);
            //type
            cat_del.type_data(data.id);
            //product
            let pro = cat_del.product_data(data.id);

            if (pro) {
                let di = path.join(__dirname, '../..', data.category_image);
                fs.unlinkSync(di);

                let delate = await model.findByIdAndDelete(req.params.id);
                if (delate) {
                    req.flash('success', 'Category deleted successfully');
                    res.redirect('back');
                }
            }

        }
    } catch (err) {
        console.log('category delete err : ', err);
    }
}

module.exports.mul_del = async (req, res) => {
    try {
        let ids = req.body.mulDel;
        ids.shift();
        ids.forEach(async element => {
            
            //sub cat
            cat_del.sub_cat_data(element);
            //ex cat 
            cat_del.ex_cat_data(element);
            //brand
            cat_del.brand_data(element);
            //type
            cat_del.type_data(element);
            //product
            let pro = cat_del.product_data(data.id);

            let data = await model.findById(element);
            fs.unlinkSync(path.join(__dirname, '../..', data.category_image));
            await model.findByIdAndDelete(element);
        });
        req.flash('success', 'All Category Deleted Successfully');
        return res.redirect('back');
    } catch (err) {
        console.log('multi delete err in admin: ', err);
    }
}

module.exports.profile = async (req, res) => {
    return res.render('admin_panel/admin_profile');
}
