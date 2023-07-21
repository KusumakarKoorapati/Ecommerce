const express=require('express');
const router=express.Router();
const controller=require('../../controller/admin/slider_controller');
const slider=require('../../model/slider_model');

router.get('/add_page',controller.add_page)
router.post('/type_brand_aj',controller.type_brand_aj);
router.post('/product_aj',controller.product_aj);

router.post('/add',slider.upImg,controller.add);

router.get('/view',controller.view);
router.get('/edit_page/:id',controller.edit_page);
router.post('/edit',slider.upImg,controller.edit);
router.get('/delete/:id',controller.delete);
router.post('/mul_del',controller.mul_del);
module.exports=router;