const express=require('express');
const router=express.Router();
const controller=require('../../controller/admin/category_controller');
const category = require('../../model/category_model');

router.get('/add_page',controller.add_page);
router.post('/add',category.upImg ,controller.add);

//view 
router.get('/view',category.upImg,controller.view);
router.get('/edit_page/:id',controller.edit_page);
router.post('/edit',category.upImg,controller.edit);

router.get('/delete/:id',controller.delete);

router.post('/mul_del',controller.mul_del);

module.exports=router;