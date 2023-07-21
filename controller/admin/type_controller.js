const model = require('../../model/type_model');
const category = require('../../model/category_model');
const sub_cat = require('../../model/subCategory_model');
const ex_cat = require('../../model/extCategory_model');

const type_del = require('../services/type_del');

const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.add_page = async (req, res) => {
    try {
        let cat_data = await category.find({ active: true });
        return res.render('admin_panel/type/add_type', ({ category: cat_data }));
    } catch (err) {
        console.log('add page err in type ', err);
    }
}

module.exports.add = async (req, res) => {
    try {
        req.body.active = true,
            req.body.createAt = nDate;
        req.body.updateAt = nDate;

        let data = await model.create(req.body);
        if (data) {
            req.flash('success', "Type Added Successfully");
            return res.redirect('back');
        }
    } catch (err) {
        console.log('add err in type : ', err);
    }
}

module.exports.view = async (req, res) => {
    try {
        if (req.query.status == 'Active') {
            await model.findByIdAndUpdate(req.query.id, ({ active: false }));
        }
        if (req.query.status == 'deActive') {
            await model.findByIdAndUpdate(req.query.id, ({ active: true }));
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
                { type: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();

        let t_page = Math.ceil(count / par_page);

        let data = await model.find({
            $or: [
                { type: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).populate('cat_id')
            .populate('sub_id')
            .populate('ex_id')
            .limit(par_page * 1)
            .skip((page - 1) * par_page)
            .exec();

        if (data) {
            return res.render('admin_panel/type/view_type', ({ page, search, data, count: t_page }));
        }
    } catch (err) {
        console.log('view page err in type : ', err);
    }
}

module.exports.edit_page = async (req, res) => {
    try {
        let data = await model.findById(req.params.id);
        let cat_data = await category.find({ active: true });
        let sub_data = await sub_cat.find({ active: true, cat_id: data.cat_id });
        let ex_data = await ex_cat.find({ active: true, sub_id: data.sub_id });

        if (ex_data) {
            return res.render('admin_panel/type/edit_type', ({ data, category: cat_data, sub_data, ex_data }))
        }
    } catch (err) {
        console.log('edit page err in type : ', err);
    }
}

module.exports.edit = async (req, res) => {
    try {
        req.body.updateAt = nDate;
        let update = await model.findByIdAndUpdate(req.body.eid, req.body);
        if (update) {
            req.flash('success', 'Type Updated Successfully');
            return res.redirect('/admin/type/view');
        }
    } catch (err) {
        console.log('edit err in type : ', err);
    }
}

module.exports.delete = async (req, res) => {
    try {
        let check = type_del.product_data(req.params.id);
        if (check) {
            let delate = await model.findByIdAndDelete(req.params.id);
            if (delate) {
                req.flash('success', 'Type Deleted Successfully');
                return res.redirect('back');
            }
        }

    } catch (err) {
        console.log('delete err in type:', err);
    }
}

module.exports.mul_del = async (req, res) => {
    try {
        let ids = req.body.mulDel;
        ids.shift();
        ids.forEach(async element => {
            let check = type_del.product_data(element);

            if (check) {
                await model.findByIdAndDelete(element);
            }
        });
        req.flash('success', 'All Type Deleted Successfully');
        return res.redirect('back')
    } catch (err) {
        console.log('multi delete err in type: ', err);
    }
}