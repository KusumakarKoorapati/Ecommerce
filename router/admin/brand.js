const express=require('express');
const router=express.Router();
const controller=require('../../controller/admin/brand_controller');
const brand=require('../../model/brand_model');

router.get('/add_page',controller.add_page);
router.post('/ajax_exCategory',controller.ajax_exCategory);
router.post('/add',brand.upImg,controller.add);

router.get('/view',controller.view);
router.get('/edit_page/:id',controller.edit_page);
router.post('/edit',brand.upImg,controller.edit);

router.get('/delete/:id',controller.delete);
router.post('/mul_del',controller.mul_del);

module.exports=router; 