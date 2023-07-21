const sub_cat = require('../../model/subCategory_model');
const model = require('../../model/extCategory_model');
const category = require('../../model/category_model');
const ex_del = require('../services/ex_del');
//for updateAt & createdAt 
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.add_page = async (req, res) => {
    try {
        let cat_data = await category.find({ active: true });
        return res.render('admin_panel/extra_category/add_exCategory', ({ category: cat_data }));
    } catch (err) {
        console.log('add page err in extra category : ', err);
    }
}
module.exports.add = async (req, res) => {
    try {
        req.body.active = true;
        req.body.createAt = nDate;
        req.body.updateAt = nDate;
        let size = req.body.size.toUpperCase();
        let color = req.body.color.toUpperCase();
        req.body.size = size.split(",");
        req.body.color = color.split(",");

        let data = await model.create(req.body);
        if (data) {
            req.flash('success', 'Extra Category Added Successfully');
            return res.redirect('back');
        }
    } catch (err) {
        console.log('add err in extra category', err);
    }
}
module.exports.ajax_subcategory = async (req, res) => {
    try {
        let sub_data = await sub_cat.find({ cat_id: req.body.cat_id }).populate('cat_id');

        let option = `<option value=''> --select subcategory --</option>`;
        sub_data.forEach(element => {
            option += `<option value='${element.id}'>${element.sub_category}</option>`
        });
        return res.json(option)
    } catch (err) {
        console.log('ajax_subcategory err in extra category : ', err);
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

        let search = '';
        let page = 1;
        let par_page = 2;

        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }

        let count = await model.find({
            $or: [
                { extra_category: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();

        let t_page = Math.ceil(count / par_page);

        let data = await model.find({
            $or: [
                { extra_category: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
            .populate('sub_id')
            .populate('cat_id')
            .limit(par_page * 1)
            .skip((page - 1) * par_page)
            .exec();
        if (data) {
            res.render('admin_panel/extra_category/view_exCategory', ({ data, search, page, count: t_page }));
        }
    } catch (err) {
        console.log('view err in extra category', err);
    }
}

module.exports.edit_page = async (req, res) => {
    try {
        let data = await model.findById(req.params.id);
        let category_data = await category.find({});
        let sub_data = await sub_cat.find({ cat_id: data.cat_id });

        res.render('admin_panel/extra_category/edit_exCategory', { data, category: category_data, sub_data });


    } catch (err) {
        console.log('edit page err in extra category', err);
    }
}
module.exports.edit = async (req, res) => {
    try {
        req.body.updateAt = nDate;
        let update = await model.findByIdAndUpdate(req.body.eid, req.body);
        if (update) {
            req.flash('success', 'Extra Category Updated ');
            res.redirect('/admin/ex_category/view');
        }
    } catch (err) {
        console.log('edit err in extra category ', err);
    }
}

module.exports.delete = async (req, res) => {
    try {
        let id = req.params.id;
        //brand
        ex_del.brand_data(id);
        //type
        ex_del.type_data(id);
        //product
        let check = ex_del.product_data(id);

        if (check) {
            let delate = await model.findByIdAndDelete(req.params.id);
            if (delate) {
                req.flash('success', 'Extra Category Deleted Successfully');
                return res.redirect('back');
            }
        }


    } catch (err) {
        console.log('delete err in extra category', err);
    }
}
module.exports.mul_del = async (req, res) => {
    try {
        let ids = req.body.mulDel;
        ids.shift();
        ids.forEach(async element => {

            let id = req.params.id;
            //brand
            ex_del.brand_data(id);
            //type
            ex_del.type_data(id);
            //product
            let check = ex_del.product_data(id);

            await model.findByIdAndDelete(element);
        });
        req.flash('success', 'All Extra Category Deleted');
        return res.redirect('back');
    } catch (err) {
        console.log('multi delete err in extra category', err);
    }
}