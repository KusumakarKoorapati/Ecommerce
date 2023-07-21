const category = require('../../model/category_model');
const sub_cat = require('../../model/subCategory_model');
const ex_cat = require('../../model/extCategory_model');
const model = require('../../model/brand_model');

const brand_del = require('../services/brand_del');

const path = require('path');
const fs = require('fs');

//for updateAt & createdAt 
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.add_page = async (req, res) => {
    try {
        let category_data = await category.find({ active: true });

        return res.render('admin_panel/brand/add_brand', { category: category_data });
    } catch (err) {
        console.log('add page err in brand ', err);
    }
}

module.exports.ajax_exCategory = async (req, res) => {
    try {
        let ex_data = await ex_cat.find({ active: true, sub_id: req.body.sub_id });
        if (ex_data) {
            let option = `<option value=''> --select extra category -- </option>`;
            ex_data.forEach(element => {
                option += `<option value='${element.id}'>${element.extra_category}</option>`
            });
            return res.json(option);
        }
    } catch (err) {
        console.log('ajax brand err in extra category : ', err);
    }
}

module.exports.add = async (req, res) => {
    try {
        req.body.active = true;
        req.body.createAt = nDate;
        req.body.updateAt = nDate;

        req.body.image = model.upPath + '/' + req.file.filename;

        let data = await model.create(req.body);
        if (data) {
            req.flash('success', 'Brand Add Successfully');
            return res.redirect('back');
        }

    } catch (err) {
        console.log('add err in brand : ', err);
    }
}

module.exports.view = async (req, res) => {
    try {

        if (req.query.status == 'Active') {
            await model.findByIdAndUpdate(req.query.id, ({ active: false }))
        }
        if (req.query.status == 'deActive') {
            await model.findByIdAndUpdate(req.query.id, ({ active: true }))
        }

        let par_page = 2;
        let page = 1;
        let search = '';

        if (req.query.search) {
            search = req.query.search;
        }

        if (req.query.page) {
            page = req.query.page;
        }

        let count = await model.find({
            $or: [
                { brand: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();
        let t_page = Math.ceil(count / par_page);

        let data = await model.find({
            $or: [
                { brand: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
            .populate('cat_id')
            .populate('sub_id')
            .populate('ex_id')
            .limit(par_page * 1)
            .skip((page - 1) * par_page)
            .exec();

        return res.render('admin_panel/brand/view_brand', { search, page, count: t_page, data });
    } catch (err) {
        console.log('view err in brand', err);
    }
}

module.exports.edit_page = async (req, res) => {
    try {
        let data = await model.findById(req.params.id);
        let cat_data = await category.find({});
        let sub_cat_data = await sub_cat.find({ cat_id: data.cat_id });
        let ex_cat_data = await ex_cat.find({ sub_id: data.sub_id });

        if (ex_cat_data) {
            return res.render('admin_panel/brand/edit_brand', { data, sub_cat_data, category: cat_data, ex_cat_data });
        }
    } catch (err) {
        console.log('edit page err in brand', err);
    }
}

module.exports.edit = async (req, res) => {
    try {
        let data = await model.findById(req.body.eid);
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '../..', data.image));
            req.body.image = model.upPath + '/' + req.file.filename;
            let update = await model.findByIdAndUpdate(req.body.eid, req.body);
            if (update) {
                req.flash('success', 'Brand Updated Successfully');
                return res.redirect('/admin/brand/view');
            }

        } else {
            req.body.image = data.image;

            let update = await model.findByIdAndUpdate(req.body.eid, req.body);
            if (update) {
                req.flash('success', 'Brand Updated Successfully');
                return res.redirect('/admin/brand/view');
            }
        }
    } catch (err) {
        console.log('edit err in brand', err);
    }
}

module.exports.delete = async (req, res) => {
    try {
        let check = brand_del.product_data(req.params.id);
        if (check) {
            let data = await model.findById(req.params.id);
            if (data) {
                fs.unlinkSync(path.join(__dirname, '../..', data.image));
                let delate = await model.findByIdAndDelete(req.params.id);
                if (delate) {
                    req.flash('success', 'Brand Deleted Successfully');
                    return res.redirect('back');
                }
            }
        }
    } catch (err) {
        console.log('delete err in brand', err);
    }
}

module.exports.mul_del = async (req, res) => {
    try {
        let ids = req.body.mulDel;
        ids.shift();
        ids.forEach(async element => {
            let check = brand_del.product_data(element);
            if (check) {
                let data = await model.findById(element);
                if (data) {
                    fs.unlinkSync(path.join(__dirname, '../..', data.image));
                    await model.findByIdAndDelete(element);
                }
            }
        });
        req.flash('success', "All Brand's Ard Deleted");
        return res.redirect('back');
    } catch (err) {
        console.log('multi delete err  in brand ', err);
    }
}