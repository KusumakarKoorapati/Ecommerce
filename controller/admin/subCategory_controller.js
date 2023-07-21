const category = require('../../model/category_model');
const model = require('../../model/subCategory_model');
const sub_del = require('../services/sub_del');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.add_page = async (req, res) => {
    try {
        let category_data = await category.find({ active: true });
        return res.render('admin_panel/sub_category/add_subCategory', ({ category: category_data }));
    } catch (err) {
        console.log('sub category  add page err', err);
    }
}
module.exports.add = async (req, res) => {
    try {
        req.body.active = true;
        req.body.createAt = nDate;
        req.body.updateAt = nDate;

        let data = await model.create(req.body);
        if (data) {
            req.flash('success', "Subcategory Added Successfully");
            return res.redirect('back');
        }
    } catch (err) {
        console.log('add err in sub category', err);
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
        let par_page = 5;

        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }

        let count = await model.find({
            $or: [
                { sub_category: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();
        let t_page = Math.ceil(count / par_page);


        let data = await model.find({
            $or: [
                { sub_category: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).populate('cat_id')
            .limit(par_page * 1)
            .skip((page - 1) * par_page)
            .exec();

        return res.render('admin_panel/sub_category/view_subCategory', ({ data, search, page, count: t_page }));

    } catch (err) {
        console.log('view err in subcategory', err);
    }
}
module.exports.edit_page = async (req, res) => {
    try {
        let data = await model.findById(req.params.id);
        let category_data = await category.find({ active: true });
        if (data) {
            return res.render('admin_panel/sub_category/edit_subCategory', ({ data, category: category_data }))
        } else {
            req.flash('err', 'some thing wrong ');
            res.redirect('back');
        }
    } catch (err) {
        console.log('edit page err in sub category', err);
    }
}
module.exports.edit = async (req, res) => {
    try {
        req.body.updateAt = nDate;
        let update = await model.findByIdAndUpdate(req.body.eid, req.body);
        if (update) {
            req.flash('success', 'Subcategory Updated')
            return res.redirect('/admin/sub_category/view')
        }
    } catch (err) {
        console.log('edit err in subcategory', err);
    }
}


module.exports.delete = async (req, res) => {
    try {
        let id = req.params.id;
        //ex_cat
        sub_del.ex_cat_data(id)
        //brand
        sub_del.brand_data(id)
        //type
        sub_del.type_data(id)
        //product
        let check = sub_del.product_data(id)

        if (check) {
            let delate = await model.findByIdAndDelete(req.params.id);
            if (delate) {
                req.flash('success', 'Subcategory Delete Successfully ');
                return res.redirect('back');
            }
        }
    } catch (err) {
        console.log('sub category delete err :', err);
    }
}
module.exports.mul_del = async (req, res) => {
    try {
        let ids = req.body.mulDel;
        ids.shift();

        ids.forEach(async element => {
            //ex_cat
            sub_del.ex_cat_data(element)
            //brand
            sub_del.brand_data(element)
            //type
            sub_del.type_data(element)
            //product
            let check = sub_del.product_data(element)
            if (check) {
                await model.findByIdAndDelete(element);

            }
        });

        req.flash('success', 'All Subcategory Deleted Successfully ');
        return res.redirect('back');

    } catch (err) {
        console.log('multi delete  err in subcategory: ', err);
    }
}